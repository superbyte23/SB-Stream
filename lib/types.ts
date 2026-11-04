export type MediaType = "movie" | "tv";

export interface Media {
  id: number;
  type: MediaType;
  title: string;
  overview: string;
  year: string;
  rating: number;
  posterPath: string | null;
  backdropPath: string | null;
  /** Deterministic hue used for artwork fallbacks. */
  hue: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface Title extends Media {
  tagline: string;
  votes: number;
  genres: Genre[];
  runtime: number | null;
  seasons: number | null;
  episodes: number | null;
  status: string;
  cast: CastMember[];
  trailerKey: string | null;
  recommendations: Media[];
}

export interface Episode {
  seasonNumber: number;
  episodeNumber: number;
  name: string;
  overview: string;
  stillPath: string | null;
  airDate: string;
  runtime: number | null;
}

export interface Season {
  seasonNumber: number;
  name: string;
  overview: string;
  episodes: Episode[];
}

export interface PagedMedia {
  items: Media[];
  page: number;
  totalPages: number;
  totalResults: number;
}
