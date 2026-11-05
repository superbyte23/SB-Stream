import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Info, Star } from "lucide-react";
import { MediaRow } from "@/components/media-row";
import { Player } from "@/components/player";
import { WatchlistButton } from "@/components/watchlist-button";
import { getTitle } from "@/lib/tmdb";
import {
  formatRating,
  formatRuntime,
  truncate,
  titleHref,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id) || id <= 0) notFound();
  const title = await getTitle("movie", id);
  if (!title) notFound();

  return {
    title: `Watch ${title.title}`,
    description: truncate(`Watch ${title.title} on SBS. ${title.overview}`, 160),
    robots: { index: false, follow: true },
  };
}

export default async function WatchMoviePage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const title = await getTitle("movie", id);
  if (!title) notFound();

  return (
    <div className="watch-page">
      <div className="watch-shell">
        <div className="watch-top">
          <Link className="back-link" href={titleHref("movie", id)}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to details
          </Link>
          <span className="watch-badge">Now playing</span>
        </div>

        <Player media={title} />

        <section className="watch-info" aria-labelledby="watch-title">
          <div className="watch-info-copy">
            <p className="page-eyebrow">Film</p>
            <h1 id="watch-title">{title.title}</h1>
            <div className="title-meta">
              <span className="rating">
                <Star size={14} fill="currentColor" aria-hidden="true" />
                {formatRating(title.rating)}
              </span>
              {title.year ? <span>{title.year}</span> : null}
              {title.runtime ? (
                <span>
                  <Clock size={14} aria-hidden="true" />
                  {formatRuntime(title.runtime)}
                </span>
              ) : null}
            </div>
            <p className="watch-overview">{title.overview}</p>
            <div className="hero-actions">
              <Link className="btn btn-secondary" href={titleHref("movie", id)}>
                <Info size={17} aria-hidden="true" />
                More details
              </Link>
              <WatchlistButton media={title} />
            </div>
          </div>
        </section>

        <MediaRow title="More like this" items={title.recommendations} />
      </div>
    </div>
  );
}
