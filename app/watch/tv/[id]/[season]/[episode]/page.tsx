import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  Star,
} from "lucide-react";
import { EpisodeList } from "@/components/episode-list";
import { Player } from "@/components/player";
import { SeasonSelect } from "@/components/season-select";
import { WatchlistButton } from "@/components/watchlist-button";
import { getSeason, getTitle } from "@/lib/tmdb";
import {
  formatDate,
  formatRating,
  formatRuntime,
  truncate,
  titleHref,
  watchHref,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string; season: string; episode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: rawId, season: rawSeason, episode: rawEpisode } = await params;
  const id = Number(rawId);
  const seasonNumber = Number(rawSeason);
  const episodeNumber = Number(rawEpisode);

  if (
    !Number.isFinite(id) ||
    id <= 0 ||
    !Number.isFinite(seasonNumber) ||
    seasonNumber <= 0 ||
    !Number.isFinite(episodeNumber) ||
    episodeNumber <= 0
  ) {
    notFound();
  }

  const title = await getTitle("tv", id);
  if (!title) notFound();

  const season = await getSeason(id, seasonNumber);
  if (!season?.episodes.some((item) => item.episodeNumber === episodeNumber)) {
    notFound();
  }

  return {
    title: `Watch ${title.title} — S${seasonNumber}E${episodeNumber}`,
    description: truncate(
      `Watch ${title.title} season ${seasonNumber}, episode ${episodeNumber} on 1FLEX.`,
      160,
    ),
    robots: { index: false, follow: true },
  };
}

export default async function WatchTvPage({ params }: PageProps) {
  const { id: rawId, season: rawSeason, episode: rawEpisode } = await params;
  const id = Number(rawId);
  const seasonNumber = Number(rawSeason);
  const episodeNumber = Number(rawEpisode);

  if (
    !Number.isFinite(id) ||
    id <= 0 ||
    !Number.isFinite(seasonNumber) ||
    seasonNumber <= 0 ||
    !Number.isFinite(episodeNumber) ||
    episodeNumber <= 0
  ) {
    notFound();
  }

  const title = await getTitle("tv", id);
  if (!title) notFound();

  const season = await getSeason(id, seasonNumber);
  if (!season) notFound();

  const index = season.episodes.findIndex(
    (item) => item.episodeNumber === episodeNumber,
  );
  if (index === -1) notFound();

  const episode = season.episodes[index];
  const previous = index > 0 ? season.episodes[index - 1] : null;
  const next =
    index < season.episodes.length - 1 ? season.episodes[index + 1] : null;
  const seasons = Array.from(
    { length: Math.max(1, title.seasons ?? seasonNumber) },
    (_, index) => index + 1,
  );

  return (
    <div className="watch-page">
      <div className="watch-shell">
        <div className="watch-top">
          <Link className="back-link" href={titleHref("tv", id)}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to details
          </Link>
          <div className="watch-top-tools">
            <SeasonSelect
              seasons={seasons}
              current={seasonNumber}
              tvId={id}
              mode="watch"
            />
            <span className="watch-badge">
              S{seasonNumber} · E{episodeNumber}
            </span>
          </div>
        </div>

        <Player
          media={title}
          season={seasonNumber}
          episode={episodeNumber}
          episodeName={episode.name}
        />

        <section className="watch-info" aria-labelledby="watch-title">
          <div className="watch-info-copy">
            <p className="page-eyebrow">
              Series · Season {seasonNumber}, Episode {episodeNumber}
            </p>
            <h1 id="watch-title">{episode.name || title.title}</h1>
            <div className="title-meta">
              <span className="rating">
                <Star size={14} fill="currentColor" aria-hidden="true" />
                {formatRating(title.rating)}
              </span>
              {episode.airDate ? <span>{formatDate(episode.airDate)}</span> : null}
              {episode.runtime ? (
                <span>
                  <Clock size={14} aria-hidden="true" />
                  {formatRuntime(episode.runtime)}
                </span>
              ) : null}
              <span>{title.title}</span>
            </div>
            <p className="watch-overview">
              {episode.overview || "No episode description is available yet."}
            </p>
            <div className="hero-actions">
              {previous ? (
                <Link
                  className="btn btn-secondary"
                  href={watchHref("tv", id, seasonNumber, previous.episodeNumber)}
                >
                  <ChevronLeft size={17} aria-hidden="true" />
                  Previous
                </Link>
              ) : null}
              {next ? (
                <Link
                  className="btn btn-primary"
                  href={watchHref("tv", id, seasonNumber, next.episodeNumber)}
                >
                  Next episode
                  <ChevronRight size={17} aria-hidden="true" />
                </Link>
              ) : null}
              <Link className="btn btn-secondary" href={titleHref("tv", id)}>
                <Info size={17} aria-hidden="true" />
                More details
              </Link>
              <WatchlistButton media={title} />
            </div>
          </div>
        </section>

        <section className="watch-episodes" aria-labelledby="watch-episodes-heading">
          <div className="section-head">
            <h2 id="watch-episodes-heading">Season {seasonNumber}</h2>
            <Link className="view-all" href={`${titleHref("tv", id)}?season=${seasonNumber}`}>
              All episodes
              <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <EpisodeList
            tvId={id}
            seasonNumber={seasonNumber}
            episodes={season.episodes}
            variant="strip"
            activeEpisode={episodeNumber}
          />
        </section>
      </div>
    </div>
  );
}
