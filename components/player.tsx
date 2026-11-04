"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  Loader2,
  RefreshCw,
  Server,
} from "lucide-react";
import type { Media } from "@/lib/types";
import {
  defaultProviderId,
  getProvider,
  isKnownProvider,
  providerEmbedUrl,
  providers,
  type ProviderId,
} from "@/lib/providers";
import {
  getResumeSeconds,
  historyKey,
  upsertHistory,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

const SERVER_KEY = "1flex:server:v1";

interface PlayerProps {
  media: Media;
  season?: number;
  episode?: number;
  episodeName?: string;
}

interface Progress {
  watched: number;
  duration: number;
}

export function Player({ media, season, episode, episodeName }: PlayerProps) {
  const [providerId, setProviderId] = useState<ProviderId>(defaultProviderId);
  const [hydrated, setHydrated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [resumeAt, setResumeAt] = useState(0);
  const [failedAll, setFailedAll] = useState(false);
  const [notice, setNotice] = useState(false);
  const lastWrite = useRef(0);

  const provider = getProvider(providerId);
  const embedUrl = providerEmbedUrl(provider, media.type, {
    tmdbId: media.id,
    season,
    episode,
    progress: resumeAt,
  });

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SERVER_KEY);
      if (isKnownProvider(saved)) setProviderId(saved);
    } catch {
      // Ignore blocked storage.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    setLoaded(false);
    setFailedAll(false);
    setNotice(false);
    setResumeAt(getResumeSeconds(media.type, media.id, season, episode));
    lastWrite.current = 0;
    setHydrated(true);
  }, [media.id, media.type, season, episode]);

  useEffect(() => {
    const writeProgress = (watched: number, duration: number) => {
      if (!Number.isFinite(watched) || watched <= 1) return;
      if (duration > 0 && watched / duration < 0.01) return;

      const now = Date.now();
      if (now - lastWrite.current < 4000) return;
      lastWrite.current = now;

      upsertHistory({
        key: historyKey(media.type, media.id, season, episode),
        id: media.id,
        type: media.type,
        title: media.title,
        posterPath: media.posterPath,
        backdropPath: media.backdropPath,
        hue: media.hue,
        season: media.type === "tv" ? (season ?? 1) : undefined,
        episode: media.type === "tv" ? (episode ?? 1) : undefined,
        episodeName: media.type === "tv" ? episodeName : undefined,
        progress: watched,
        duration: Number.isFinite(duration) ? duration : 0,
        updatedAt: now,
      });
    };

    const onMessage = (event: MessageEvent) => {
      if (!providers.some((item) => item.origins.includes(event.origin))) return;

      let payload: unknown = event.data;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }

      if (!payload || typeof payload !== "object") return;
      const data = payload as Record<string, unknown>;

      if (data.type === "viduki:all-servers-failed") {
        const index = providers.findIndex((item) => item.id === providerId);
        const next = providers[index + 1];
        if (next) {
          setProviderId(next.id);
          setLoaded(false);
          setFailedAll(false);
          setNotice(true);
          setResumeAt(getResumeSeconds(media.type, media.id, season, episode));
          try {
            window.localStorage.setItem(SERVER_KEY, next.id);
          } catch {
            // Ignore blocked storage.
          }
        } else {
          setFailedAll(true);
        }
        return;
      }

      const progress = extractProgress(data, media.id, season, episode);
      if (progress) writeProgress(progress.watched, progress.duration);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [episode, episodeName, media, providerId, season]);

  const selectProvider = (next: ProviderId) => {
    setProviderId(next);
    setLoaded(false);
    setFailedAll(false);
    setNotice(false);
    setResumeAt(getResumeSeconds(media.type, media.id, season, episode));
    try {
      window.localStorage.setItem(SERVER_KEY, next);
    } catch {
      // Ignore blocked storage.
    }
  };

  const retry = () => {
    setProviderId(providers[0].id);
    setLoaded(false);
    setFailedAll(false);
    setNotice(false);
    try {
      window.localStorage.setItem(SERVER_KEY, providers[0].id);
    } catch {
      // Ignore blocked storage.
    }
  };

  return (
    <div className="player">
      <div className={cn("player-frame", loaded && "is-loaded")}>
        {hydrated && !failedAll ? (
          <iframe
            key={`${provider.id}-${media.id}-${season ?? 0}-${episode ?? 0}-${resumeAt}`}
            src={embedUrl}
            title={`${media.title} — ${provider.name} player`}
            allow="encrypted-media; autoplay *; fullscreen *; picture-in-picture *"
            allowFullScreen
            loading="eager"
            onLoad={() => setLoaded(true)}
          />
        ) : null}

        {!loaded && !failedAll ? (
          <div className="player-loading" role="status">
            <Loader2 className="spin" size={26} aria-hidden="true" />
            <span>Connecting to {provider.name}…</span>
          </div>
        ) : null}

        {failedAll ? (
          <div className="player-error" role="alert">
            <AlertTriangle size={30} aria-hidden="true" />
            <h2>No working server found</h2>
            <p>
              Every server reported a problem for this title. Try again, or choose a
              different server below.
            </p>
            <button type="button" className="btn btn-primary" onClick={retry}>
              <RefreshCw size={17} aria-hidden="true" />
              Try again
            </button>
          </div>
        ) : null}
      </div>

      <div className="player-toolbar">
        <div className="server-picker">
          <span className="server-label">
            <Server size={15} aria-hidden="true" />
            Server
          </span>
          <div className="server-list" role="radiogroup" aria-label="Playback server">
            {providers.map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={item.id === providerId}
                className={cn("server-button", item.id === providerId && "is-active")}
                onClick={() => selectProvider(item.id)}
              >
                <span>{item.name}</span>
                <small>{item.badge}</small>
              </button>
            ))}
          </div>
        </div>

        <a
          className="external-link"
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in new tab
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>

      <div className="player-notes">
        <p>
          <strong>{provider.name}</strong> — {provider.description}
        </p>
        <p>
          Stream not starting? Switch servers. Playback is embedded from a third-party
          provider; 1FLEX does not host any video.
        </p>
        {resumeAt > 0 ? (
          <p className="player-resume-note">
            {provider.supportsProgress
              ? `Resuming from ${formatClock(resumeAt)}.`
              : `Your place (${formatClock(resumeAt)}) is saved. Choose Vidy to resume automatically.`}
          </p>
        ) : null}
        {notice ? (
          <p className="player-resume-note">
            That server did not respond, so playback moved to {provider.name}.
          </p>
        ) : null}
        <p className="sr-only" aria-live="polite">
          Playing on {provider.name}
        </p>
      </div>
    </div>
  );
}

function formatClock(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(rest).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function deepProgress(value: unknown, depth = 0): Progress | null {
  if (!value || typeof value !== "object" || depth > 6) return null;
  const record = value as Record<string, unknown>;

  const current = asNumber(record.currentTime);
  if (current !== null) {
    return {
      watched: current,
      duration: asNumber(record.duration) ?? 0,
    };
  }

  const progress = record.progress;
  if (progress && typeof progress === "object") {
    const watched = asNumber((progress as Record<string, unknown>).watched);
    if (watched !== null) {
      return {
        watched,
        duration: asNumber((progress as Record<string, unknown>).duration) ?? 0,
      };
    }
  }

  for (const key of Object.keys(record)) {
    const found = deepProgress(record[key], depth + 1);
    if (found) return found;
  }

  return null;
}

function extractProgress(
  payload: Record<string, unknown>,
  id: number,
  season?: number,
  episode?: number,
): Progress | null {
  let data: unknown = payload.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      data = null;
    }
  }

  if (data && typeof data === "object") {
    const container = data as Record<string, unknown>;
    const entry =
      container[String(id)] ??
      (container.id === id ? container : null) ??
      null;

    if (entry && typeof entry === "object") {
      const record = entry as Record<string, unknown>;

      if (record.type === "tv" && season && episode) {
        const showProgress = record.show_progress;
        if (showProgress && typeof showProgress === "object") {
          const episodeEntry = (showProgress as Record<string, unknown>)[
            `s${season}e${episode}`
          ];
          if (episodeEntry) {
            const progress = deepProgress(episodeEntry);
            if (progress) return progress;
          }
        }
      }

      const progress = deepProgress(record);
      if (progress) return progress;
    }

    const direct = deepProgress(container);
    if (direct) return direct;
  }

  return deepProgress(payload);
}
