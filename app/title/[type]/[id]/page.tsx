import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, Play, Star, Tv, Video } from "lucide-react";
import { CastRow } from "@/components/cast-row";
import { EpisodeList } from "@/components/episode-list";
import { MediaRow } from "@/components/media-row";
import { SeasonSelect } from "@/components/season-select";
import { WatchlistButton } from "@/components/watchlist-button";
import { tmdbImage } from "@/lib/images";
import { getSeason, getTitle } from "@/lib/tmdb";
import type { MediaType } from "@/lib/types";
import {
  clamp,
  formatRating,
  formatRuntime,
  formatVotes,
  gradientFor,
  initials,
  truncate,
  watchHref,
} from "@/lib/utils";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parseType(value: string): MediaType | null {
  return value === "movie" || value === "tv" ? value : null;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type: rawType, id: rawId } = await params;
  const type = parseType(rawType);
  const id = Number(rawId);
  if (!type || !Number.isFinite(id)) return { title: "Title not found" };

  const title = await getTitle(type, id);
  if (!title) notFound();

  const description = truncate(title.overview, 160);
  const image = tmdbImage(title.backdropPath ?? title.posterPath, "w1280");
  const canonical = `/title/${type}/${id}`;

  return {
    title: title.year ? `${title.title} (${title.year})` : title.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: title.title,
      description,
      type: "website",
      url: canonical,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: title.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function TitlePage({ params, searchParams }: PageProps) {
  const { type: rawType, id: rawId } = await params;
  const type = parseType(rawType);
  const id = Number(rawId);
  if (!type || !Number.isFinite(id) || id <= 0) notFound();

  const title = await getTitle(type, id);
  if (!title) notFound();

  const query = await searchParams;
  const requestedSeason = Number.parseInt(first(query.season) ?? "1", 10);
  const seasonNumbers = Array.from(
    { length: Math.max(1, title.seasons ?? 1) },
    (_, index) => index + 1,
  );
  const seasonNumber = clamp(
    Number.isFinite(requestedSeason) ? requestedSeason : 1,
    1,
    seasonNumbers.length,
  );
  const season = type === "tv" ? await getSeason(id, seasonNumber) : null;

  const poster = tmdbImage(title.posterPath, "w500");
  const backdrop = tmdbImage(title.backdropPath, "original");
  const playLink =
    type === "movie" ? watchHref("movie", id) : watchHref("tv", id, 1, 1);
  const status = title.status && title.status !== "Released" ? title.status : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type === "movie" ? "Movie" : "TVSeries",
    name: title.title,
    description: title.overview,
    image: poster ?? undefined,
    datePublished: title.year || undefined,
    genre: title.genres.map((genre) => genre.name),
    aggregateRating:
      title.votes > 0 && title.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: title.rating,
            ratingCount: title.votes,
            bestRating: 10,
            worstRating: 1,
          }
        : undefined,
  };

  return (
    <div className="title-page">
      <section className="title-hero">
        {backdrop ? (
          <Image
            className="title-backdrop"
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="title-backdrop title-backdrop-fallback"
            style={{ background: gradientFor(title.hue, 110) }}
            aria-hidden="true"
          />
        )}
        <div className="title-scrim" aria-hidden="true" />

        <div className="title-inner">
          <div className="title-poster">
            {poster ? (
              <Image src={poster} alt={`${title.title} poster`} fill sizes="240px" />
            ) : (
              <div
                className="title-poster-fallback"
                style={{ background: gradientFor(title.hue) }}
                aria-hidden="true"
              >
                <span>{initials(title.title)}</span>
              </div>
            )}
          </div>

          <div className="title-details">
            <p className="page-eyebrow">
              {type === "tv" ? "Series" : "Film"}
              {status ? ` · ${status}` : ""}
            </p>
            <h1>{title.title}</h1>
            {title.tagline ? <p className="title-tagline">“{title.tagline}”</p> : null}

            <div className="title-meta">
              <span className="rating">
                <Star size={14} fill="currentColor" aria-hidden="true" />
                {formatRating(title.rating)}
              </span>
              {title.year ? (
                <span>
                  <Calendar size={14} aria-hidden="true" />
                  {title.year}
                </span>
              ) : null}
              {title.runtime ? (
                <span>
                  <Clock size={14} aria-hidden="true" />
                  {formatRuntime(title.runtime)}
                </span>
              ) : null}
              {type === "tv" && title.seasons ? (
                <span>
                  <Tv size={14} aria-hidden="true" />
                  {title.seasons} {title.seasons === 1 ? "season" : "seasons"}
                </span>
              ) : null}
              {title.votes > 0 ? <span>{formatVotes(title.votes)} votes</span> : null}
            </div>

            {title.genres.length ? (
              <div className="genre-pills" aria-label="Genres">
                {title.genres.map((genre) => (
                  <span className="genre-pill" key={genre.id}>
                    {genre.name}
                  </span>
                ))}
              </div>
            ) : null}

            <p className="title-overview">{title.overview}</p>

            <div className="hero-actions">
              <Link className="btn btn-primary" href={playLink}>
                <Play size={18} fill="currentColor" aria-hidden="true" />
                {type === "tv" ? "Play season 1" : "Play"}
              </Link>
              {title.trailerKey ? (
                <a
                  className="btn btn-secondary"
                  href={`https://www.youtube.com/watch?v=${title.trailerKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Video size={18} aria-hidden="true" />
                  Trailer
                </a>
              ) : null}
              <WatchlistButton media={title} />
            </div>
          </div>
        </div>
      </section>

      <div className="title-body">
        <CastRow cast={title.cast} />

        {type === "tv" && season ? (
          <section className="episodes-section" aria-labelledby="episodes-heading">
            <div className="section-head">
              <h2 id="episodes-heading">Episodes</h2>
              <SeasonSelect seasons={seasonNumbers} current={seasonNumber} />
            </div>
            {season.overview ? <p className="season-overview">{season.overview}</p> : null}
            <EpisodeList
              tvId={id}
              seasonNumber={seasonNumber}
              episodes={season.episodes}
            />
          </section>
        ) : null}

        <MediaRow
          title="More like this"
          items={title.recommendations}
          linkLabel=""
          className="recommendation-row"
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
