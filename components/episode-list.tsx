import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { Episode } from "@/lib/types";
import { tmdbImage } from "@/lib/images";
import { cn, formatDate, formatRuntime, gradientFor, watchHref } from "@/lib/utils";

interface EpisodeListProps {
  tvId: number;
  seasonNumber: number;
  episodes: Episode[];
  variant?: "list" | "strip";
  activeEpisode?: number;
}

export function EpisodeList({
  tvId,
  seasonNumber,
  episodes,
  variant = "list",
  activeEpisode,
}: EpisodeListProps) {
  if (!episodes.length) {
    return <p className="empty-note">No episodes are available for this season yet.</p>;
  }

  if (variant === "strip") {
    return (
      <div className="episode-strip" aria-label={`Season ${seasonNumber} episodes`}>
        {episodes.map((episode) => {
          const image = tmdbImage(episode.stillPath, "w300");
          const active = episode.episodeNumber === activeEpisode;
          return (
            <Link
              key={episode.episodeNumber}
              href={watchHref("tv", tvId, seasonNumber, episode.episodeNumber)}
              className={cn("episode-strip-card", active && "is-active")}
              aria-current={active ? "true" : undefined}
            >
              <span className="episode-strip-art">
                {image ? (
                  <Image src={image} alt="" fill sizes="220px" />
                ) : (
                  <span
                    className="episode-strip-fallback"
                    style={{ background: gradientFor((tvId + episode.episodeNumber) % 360) }}
                    aria-hidden="true"
                  >
                    {episode.episodeNumber}
                  </span>
                )}
                <span className="episode-strip-play" aria-hidden="true">
                  <Play size={14} fill="currentColor" />
                </span>
              </span>
              <span className="episode-strip-title">
                {episode.episodeNumber}. {episode.name}
              </span>
              {episode.runtime ? (
                <span className="episode-strip-meta">{formatRuntime(episode.runtime)}</span>
              ) : null}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <ol className="episode-list">
      {episodes.map((episode) => {
        const image = tmdbImage(episode.stillPath, "w300");
        return (
          <li key={episode.episodeNumber}>
            <Link
              href={watchHref("tv", tvId, seasonNumber, episode.episodeNumber)}
              className="episode-row"
              aria-label={`Watch episode ${episode.episodeNumber}: ${episode.name}`}
            >
              <span className="episode-still">
                {image ? (
                  <Image src={image} alt="" fill sizes="(max-width: 640px) 112px, 168px" />
                ) : (
                  <span
                    className="episode-still-fallback"
                    style={{ background: gradientFor((tvId + episode.episodeNumber) % 360) }}
                    aria-hidden="true"
                  >
                    {episode.episodeNumber}
                  </span>
                )}
                <span className="episode-play" aria-hidden="true">
                  <Play size={15} fill="currentColor" />
                </span>
              </span>

              <span className="episode-copy">
                <span className="episode-title">
                  <span className="episode-number">{episode.episodeNumber}</span>
                  {episode.name}
                </span>
                <span className="episode-overview">
                  {episode.overview || "No episode description is available yet."}
                </span>
                <span className="episode-meta">
                  {formatDate(episode.airDate)}
                  {episode.runtime ? ` · ${formatRuntime(episode.runtime)}` : ""}
                </span>
              </span>

              {episode.runtime ? (
                <span className="episode-duration">{formatRuntime(episode.runtime)}</span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
