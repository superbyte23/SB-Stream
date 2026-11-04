import Image from "next/image";
import Link from "next/link";
import { Info, Play, Star } from "lucide-react";
import { WatchlistButton } from "./watchlist-button";
import { tmdbImage } from "@/lib/images";
import type { Media } from "@/lib/types";
import { formatRating, gradientFor, titleHref, watchHref } from "@/lib/utils";

interface HeroProps {
  media: Media;
  eyebrow?: string;
}

export function Hero({ media, eyebrow = "Trending this week" }: HeroProps) {
  const backdrop = tmdbImage(media.backdropPath, "original");
  const playLink =
    media.type === "movie"
      ? watchHref("movie", media.id)
      : watchHref("tv", media.id, 1, 1);

  return (
    <section className="hero" aria-labelledby="hero-title">
      {backdrop ? (
        <Image
          className="hero-image"
          src={backdrop}
          alt=""
          fill
          priority
          sizes="100vw"
        />
      ) : (
        <div
          className="hero-image hero-image-fallback"
          style={{ background: gradientFor(media.hue, 120) }}
          aria-hidden="true"
        />
      )}

      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 id="hero-title">{media.title}</h1>

        <div className="hero-meta">
          <span className="rating">
            <Star size={14} fill="currentColor" aria-hidden="true" />
            {formatRating(media.rating)}
          </span>
          {media.year ? <span>{media.year}</span> : null}
          <span>{media.type === "tv" ? "Series" : "Film"}</span>
          <span className="quality">HD</span>
        </div>

        <p className="hero-overview">{media.overview}</p>

        <div className="hero-actions">
          <Link className="btn btn-primary" href={playLink}>
            <Play size={18} fill="currentColor" aria-hidden="true" />
            Play
          </Link>
          <Link className="btn btn-secondary" href={titleHref(media.type, media.id)}>
            <Info size={18} aria-hidden="true" />
            More info
          </Link>
          <WatchlistButton media={media} />
        </div>
      </div>
    </section>
  );
}
