import {
  demoMovies,
  demoSearch,
  demoTrending,
  demoTv,
  demoTitleDetails,
  demoSeason,
  findDemoTitle,
} from "./demo";
import type {
  CastMember,
  Episode,
  Media,
  MediaType,
  PagedMedia,
  Season,
  Title,
} from "./types";

const API_BASE = "https://api.themoviedb.org/3";
const configuredRevalidate = Number(process.env.TMDB_REVALIDATE ?? 3600);
const DEFAULT_REVALIDATE =
  Number.isFinite(configuredRevalidate) && configuredRevalidate > 0
    ? configuredRevalidate
    : 3600;

interface RawMedia {
  id?: number;
  media_type?: string;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

interface RawList {
  page?: number;
  total_pages?: number;
  total_results?: number;
  results?: RawMedia[];
}

interface RawDetails extends RawMedia {
  tagline?: string;
  genres?: { id: number; name: string }[];
  runtime?: number | null;
  episode_run_time?: number[];
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
  status?: string;
  credits?: {
    cast?: {
      id: number;
      name: string;
      character?: string;
      profile_path?: string | null;
    }[];
  };
  videos?: {
    results?: {
      key: string;
      site: string;
      type: string;
      official?: boolean;
    }[];
  };
  recommendations?: RawList;
}

interface RawSeason {
  name?: string;
  overview?: string;
  season_number?: number;
  episodes?: {
    episode_number?: number;
    season_number?: number;
    name?: string;
    overview?: string;
    still_path?: string | null;
    air_date?: string;
    runtime?: number | null;
  }[];
}

type Credentials =
  | { kind: "bearer"; token: string }
  | { kind: "key"; key: string }
  | null;

function credentials(): Credentials {
  const token = process.env.TMDB_READ_TOKEN?.trim();
  if (token) return { kind: "bearer", token };
  const key = process.env.TMDB_API_KEY?.trim();
  if (key) return { kind: "key", key };
  return null;
}

export function hasTmdbCredentials(): boolean {
  return credentials() !== null;
}

async function request<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  revalidate = DEFAULT_REVALIDATE,
): Promise<T | null> {
  const creds = credentials();
  if (!creds) return null;

  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: HeadersInit = { accept: "application/json" };
  if (creds.kind === "bearer") {
    headers.authorization = `Bearer ${creds.token}`;
  } else {
    url.searchParams.set("api_key", creds.key);
  }

  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate },
    });

    if (!response.ok) {
      console.error(`[tmdb] ${path} responded ${response.status}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`[tmdb] ${path} failed`, error);
    return null;
  }
}

export function normalizeMedia(raw: RawMedia, fallbackType: MediaType): Media | null {
  if (!raw.id) return null;
  const type: MediaType =
    raw.media_type === "tv" || raw.media_type === "movie"
      ? raw.media_type
      : fallbackType;
  const date = raw.release_date || raw.first_air_date || "";
  const title = raw.title || raw.name || "Untitled";

  return {
    id: raw.id,
    type,
    title,
    overview: raw.overview?.trim() || "No overview is available for this title yet.",
    year: date.slice(0, 4),
    rating: raw.vote_average ?? 0,
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    hue: raw.id % 360,
  };
}

function normalizeTitle(raw: RawDetails, type: MediaType): Title {
  const base =
    normalizeMedia({ ...raw, media_type: type }, type) ?? {
      id: raw.id ?? 0,
      type,
      title: "Untitled",
      overview: "",
      year: "",
      rating: 0,
      posterPath: null,
      backdropPath: null,
      hue: 0,
    };

  const videos = raw.videos?.results ?? [];
  const trailer =
    videos.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official) ??
    videos.find((video) => video.site === "YouTube" && video.type === "Trailer") ??
    videos.find((video) => video.site === "YouTube") ??
    null;

  const cast: CastMember[] = (raw.credits?.cast ?? []).slice(0, 14).map((member) => ({
    id: member.id,
    name: member.name,
    character: member.character ?? "",
    profilePath: member.profile_path ?? null,
  }));

  const recommendations = (raw.recommendations?.results ?? [])
    .map((item) => normalizeMedia({ ...item, media_type: type }, type))
    .filter((item): item is Media => item !== null)
    .slice(0, 16);

  return {
    ...base,
    tagline: raw.tagline?.trim() || "",
    votes: raw.vote_count ?? 0,
    genres: (raw.genres ?? []).map((genre) => ({ id: genre.id, name: genre.name })),
    runtime:
      type === "movie"
        ? (raw.runtime ?? null)
        : (raw.episode_run_time?.[0] ?? null),
    seasons: type === "tv" ? (raw.number_of_seasons ?? null) : null,
    episodes: type === "tv" ? (raw.number_of_episodes ?? null) : null,
    status: raw.status ?? "",
    cast,
    trailerKey: trailer?.key ?? null,
    recommendations,
  };
}

function toPaged(
  data: RawList | null,
  type: MediaType,
  fallback: Media[],
  page: number,
): PagedMedia {
  if (!data?.results) {
    return {
      items: page === 1 ? fallback : [],
      page: 1,
      totalPages: 1,
      totalResults: fallback.length,
    };
  }

  const items = data.results
    .map((item) => normalizeMedia(item, type))
    .filter((item): item is Media => item !== null);

  return {
    items,
    page: data.page ?? page,
    totalPages: Math.min(data.total_pages ?? 1, 500),
    totalResults: data.total_results ?? items.length,
  };
}

export async function getTrending(): Promise<Media[]> {
  const data = await request<RawList>("/trending/all/week", {
    language: "en-US",
  });

  if (!data?.results) return demoTrending;

  const items = data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => normalizeMedia(item, item.media_type as MediaType))
    .filter((item): item is Media => item !== null);

  return items.length ? items : demoTrending;
}

export async function getPopularMovies(page = 1): Promise<PagedMedia> {
  const data = await request<RawList>("/movie/popular", {
    page,
    language: "en-US",
  });
  return toPaged(data, "movie", demoMovies, page);
}

export async function getPopularTv(page = 1): Promise<PagedMedia> {
  const data = await request<RawList>("/tv/popular", {
    page,
    language: "en-US",
  });
  return toPaged(data, "tv", demoTv, page);
}

export async function getUpcomingMovies(page = 1): Promise<PagedMedia> {
  const data = await request<RawList>("/movie/upcoming", {
    page,
    language: "en-US",
  });
  return toPaged(data, "movie", demoMovies, page);
}

export async function getNowPlayingMovies(page = 1): Promise<PagedMedia> {
  const data = await request<RawList>("/movie/now_playing", {
    page,
    language: "en-US",
  });
  return toPaged(data, "movie", demoMovies, page);
}

export async function getTopRatedMovies(page = 1): Promise<PagedMedia> {
  const data = await request<RawList>("/movie/top_rated", {
    page,
    language: "en-US",
  });
  return toPaged(data, "movie", demoMovies, page);
}

export async function getTopRatedTv(page = 1): Promise<PagedMedia> {
  const data = await request<RawList>("/tv/top_rated", {
    page,
    language: "en-US",
  });
  return toPaged(data, "tv", demoTv, page);
}

export async function getTitle(type: MediaType, id: number): Promise<Title | null> {
  if (!Number.isFinite(id) || id <= 0) return null;

  const data = await request<RawDetails>(`/${type}/${id}`, {
    language: "en-US",
    append_to_response: "videos,credits,recommendations",
  });

  if (data) return normalizeTitle(data, type);

  const demo = findDemoTitle(type, id);
  return demo ? demoTitleDetails(demo) : null;
}

export async function getSeason(id: number, seasonNumber: number): Promise<Season | null> {
  if (!Number.isFinite(id) || id <= 0 || seasonNumber < 0) return null;

  const data = await request<RawSeason>(`/tv/${id}/season/${seasonNumber}`, {
    language: "en-US",
  });

  if (data?.episodes) {
    const episodes: Episode[] = data.episodes
      .map((episode) => ({
        seasonNumber: episode.season_number ?? seasonNumber,
        episodeNumber: episode.episode_number ?? 0,
        name: episode.name || `Episode ${episode.episode_number ?? ""}`.trim(),
        overview: episode.overview?.trim() || "",
        stillPath: episode.still_path ?? null,
        airDate: episode.air_date ?? "",
        runtime: episode.runtime ?? null,
      }))
      .filter((episode) => episode.episodeNumber > 0)
      .sort((a, b) => a.episodeNumber - b.episodeNumber);

    return {
      seasonNumber,
      name: data.name || `Season ${seasonNumber}`,
      overview: data.overview?.trim() || "",
      episodes,
    };
  }

  const demo = findDemoTitle("tv", id);
  return demo ? demoSeason(demo, seasonNumber) : null;
}

export async function searchTitles(query: string, page = 1): Promise<PagedMedia> {
  const clean = query.trim();
  if (!clean) {
    return { items: [], page: 1, totalPages: 0, totalResults: 0 };
  }

  const data = await request<RawList>("/search/multi", {
    query: clean,
    page,
    include_adult: "false",
    language: "en-US",
  });

  if (!data?.results) {
    const items = demoSearch(clean);
    return {
      items: page === 1 ? items : [],
      page: 1,
      totalPages: 1,
      totalResults: items.length,
    };
  }

  const items = data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => normalizeMedia(item, item.media_type as MediaType))
    .filter((item): item is Media => item !== null);

  return {
    items,
    page: data.page ?? page,
    totalPages: Math.min(data.total_pages ?? 1, 500),
    totalResults: data.total_results ?? items.length,
  };
}
