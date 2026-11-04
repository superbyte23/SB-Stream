import type { Media, MediaType } from "./types";

const HISTORY_KEY = "1flex:progress:v1";
const WATCHLIST_KEY = "1flex:watchlist:v1";
const HISTORY_LIMIT = 40;

export const HISTORY_EVENT = "1flex:progress";
export const WATCHLIST_EVENT = "1flex:watchlist";

export interface HistoryEntry {
  key: string;
  id: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  hue: number;
  season?: number;
  episode?: number;
  episodeName?: string;
  progress: number;
  duration: number;
  updatedAt: number;
}

export interface WatchlistEntry extends Media {
  addedAt: number;
}

export function historyKey(
  type: MediaType,
  id: number,
  season?: number,
  episode?: number,
): string {
  return type === "movie" ? `movie:${id}` : `tv:${id}:${season ?? 1}:${episode ?? 1}`;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function emit(name: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(name));
}

export function readHistory(): HistoryEntry[] {
  const value = readJson<HistoryEntry[]>(HISTORY_KEY, []);
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (entry) =>
        entry &&
        typeof entry.id === "number" &&
        (entry.type === "movie" || entry.type === "tv") &&
        typeof entry.progress === "number",
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getHistoryEntry(
  type: MediaType,
  id: number,
  season?: number,
  episode?: number,
): HistoryEntry | null {
  const key = historyKey(type, id, season, episode);
  return readHistory().find((entry) => entry.key === key) ?? null;
}

export function upsertHistory(entry: HistoryEntry): void {
  if (!canUseStorage()) return;
  const current = readHistory().filter((item) => item.key !== entry.key);
  const next = [entry, ...current].slice(0, HISTORY_LIMIT);
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    emit(HISTORY_EVENT);
  } catch {
    // Storage can be full or blocked (private mode). Playback should continue.
  }
}

export function removeHistory(key: string): void {
  if (!canUseStorage()) return;
  const next = readHistory().filter((entry) => entry.key !== key);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  emit(HISTORY_EVENT);
}

export function clearHistory(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(HISTORY_KEY);
  emit(HISTORY_EVENT);
}

export function isFinished(entry: HistoryEntry): boolean {
  return entry.duration > 0 && entry.progress >= entry.duration - 60;
}

export function getResumeSeconds(
  type: MediaType,
  id: number,
  season?: number,
  episode?: number,
): number {
  const entry = getHistoryEntry(type, id, season, episode);
  if (!entry || entry.progress < 15 || isFinished(entry)) return 0;
  return Math.floor(entry.progress);
}

export function readWatchlist(): WatchlistEntry[] {
  const value = readJson<WatchlistEntry[]>(WATCHLIST_KEY, []);
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (entry) =>
        entry &&
        typeof entry.id === "number" &&
        (entry.type === "movie" || entry.type === "tv"),
    )
    .sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
}

export function isInWatchlist(type: MediaType, id: number): boolean {
  return readWatchlist().some((entry) => entry.id === id && entry.type === type);
}

export function toggleWatchlist(media: Media): boolean {
  if (!canUseStorage()) return false;
  const current = readWatchlist();
  const exists = current.some((entry) => entry.id === media.id && entry.type === media.type);
  const next = exists
    ? current.filter((entry) => !(entry.id === media.id && entry.type === media.type))
    : [
        {
          id: media.id,
          type: media.type,
          title: media.title,
          overview: media.overview,
          year: media.year,
          rating: media.rating,
          posterPath: media.posterPath,
          backdropPath: media.backdropPath,
          hue: media.hue,
          addedAt: Date.now(),
        },
        ...current,
      ];

  try {
    window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
    emit(WATCHLIST_EVENT);
  } catch {
    return exists;
  }

  return !exists;
}
