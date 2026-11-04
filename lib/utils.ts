import type { Media, MediaType } from "./types";

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function gradientFor(hue: number, angle = 160): string {
  const first = ((hue % 360) + 360) % 360;
  const second = (first + 64) % 360;
  return `linear-gradient(${angle}deg, hsl(${first} 58% 38%), hsl(${second} 52% 13%))`;
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return "";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest}m`;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export function formatRating(rating: number | null | undefined): string {
  if (!rating || rating <= 0) return "NR";
  return rating.toFixed(1);
}

export function formatVotes(votes: number | null | undefined): string {
  if (!votes || votes <= 0) return "";
  if (votes >= 1_000_000) return `${(votes / 1_000_000).toFixed(1)}M`;
  if (votes >= 1_000) return `${Math.round(votes / 1_000)}K`;
  return String(votes);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(`${value.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatYear(value: string | null | undefined): string {
  return value && value.length >= 4 ? value.slice(0, 4) : "";
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function watchHref(
  type: MediaType,
  id: number,
  season?: number,
  episode?: number,
): string {
  if (type === "movie") return `/watch/movie/${id}`;
  return `/watch/tv/${id}/${season ?? 1}/${episode ?? 1}`;
}

export function titleHref(type: MediaType, id: number): string {
  return `/title/${type}/${id}`;
}

export function mediaHref(media: Pick<Media, "type" | "id">): string {
  return titleHref(media.type, media.id);
}

export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

export function initials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
