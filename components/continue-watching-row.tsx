"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { tmdbImage } from "@/lib/images";
import {
  clearHistory,
  HISTORY_EVENT,
  isFinished,
  readHistory,
  removeHistory,
  type HistoryEntry,
} from "@/lib/storage";
import { clamp, gradientFor, initials } from "@/lib/utils";

export function ContinueWatchingRow() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => setEntries(readHistory().filter((entry) => !isFinished(entry)));
    sync();
    setMounted(true);
    window.addEventListener(HISTORY_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(HISTORY_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!mounted || entries.length === 0) return null;

  return (
    <section className="media-section continue-section" aria-labelledby="continue-heading">
      <div className="section-head">
        <h2 id="continue-heading">Continue watching</h2>
        <button type="button" className="view-all" onClick={() => clearHistory()}>
          Clear
        </button>
      </div>

      <div className="continue-scroller">
        {entries.slice(0, 12).map((entry) => {
          const href =
            entry.type === "movie"
              ? `/watch/movie/${entry.id}`
              : `/watch/tv/${entry.id}/${entry.season ?? 1}/${entry.episode ?? 1}`;
          const image = tmdbImage(entry.backdropPath ?? entry.posterPath, "w780");
          const progress =
            entry.duration > 0
              ? clamp((entry.progress / entry.duration) * 100, 0, 100)
              : 0;
          const episodeLabel =
            entry.type === "tv"
              ? `S${entry.season ?? 1} E${entry.episode ?? 1}${
                  entry.episodeName ? ` · ${entry.episodeName}` : ""
                }`
              : "Film";

          return (
            <article className="continue-card" key={entry.key}>
              <Link className="continue-link" href={href} aria-label={`Resume ${entry.title}`}>
                <span className="continue-art">
                  {image ? (
                    <Image src={image} alt="" fill sizes="(max-width: 640px) 240px, 300px" />
                  ) : (
                    <span
                      className="continue-art-fallback"
                      style={{ background: gradientFor(entry.hue) }}
                      aria-hidden="true"
                    >
                      {initials(entry.title)}
                    </span>
                  )}
                  <span className="continue-shade" aria-hidden="true" />
                  <span className="continue-copy">
                    <span className="continue-title">{entry.title}</span>
                    <span className="continue-sub">
                      {episodeLabel}
                      {entry.duration > 0
                        ? ` · ${Math.max(1, Math.round((entry.duration - entry.progress) / 60))} min left`
                        : ""}
                    </span>
                  </span>
                  {progress > 0 ? (
                    <span className="continue-progress" aria-hidden="true">
                      <span style={{ width: `${progress}%` }} />
                    </span>
                  ) : null}
                </span>
              </Link>
              <button
                type="button"
                className="continue-remove"
                onClick={() => removeHistory(entry.key)}
                aria-label={`Remove ${entry.title} from continue watching`}
              >
                <X size={14} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
