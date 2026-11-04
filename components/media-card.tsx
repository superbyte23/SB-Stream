import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { tmdbImage } from "@/lib/images";
import type { Media } from "@/lib/types";
import { cn, formatRating, gradientFor, initials, titleHref } from "@/lib/utils";

interface MediaCardProps {
  media: Media;
  sizes?: string;
  className?: string;
  orientation?: "poster" | "wide";
}

export function MediaCard({
  media,
  sizes = "(max-width: 640px) 122px, 166px",
  className,
  orientation = "poster",
}: MediaCardProps) {
  const imagePath =
    orientation === "wide" ? media.backdropPath ?? media.posterPath : media.posterPath;
  const image = tmdbImage(imagePath, orientation === "wide" ? "w780" : "w342");
  const rating = formatRating(media.rating);

  return (
    <Link
      className={cn("media-card", orientation === "wide" && "is-wide", className)}
      href={titleHref(media.type, media.id)}
      aria-label={`${media.title}${media.year ? ` (${media.year})` : ""}`}
    >
      <div className="poster">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes={sizes}
            className="poster-image"
          />
        ) : (
          <div
            className="poster-fallback"
            style={{ background: gradientFor(media.hue) }}
            aria-hidden="true"
          >
            <span>{initials(media.title)}</span>
          </div>
        )}
        <span className="card-badge" aria-label={`Rated ${rating}`}>
          <Star size={11} fill="currentColor" aria-hidden="true" />
          {rating}
        </span>
        <span className="card-title">
          <span>{media.title}</span>
          <span className="card-sub">
            {media.year || "New"} · {media.type === "tv" ? "Series" : "Film"}
          </span>
        </span>
      </div>
    </Link>
  );
}
