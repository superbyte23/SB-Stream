export const BRAND_COLOR = "9333ea";

export type ProviderId = "server-1" | "server-2" | "server-3";

export interface ProviderBuildOptions {
  tmdbId: number;
  season?: number;
  episode?: number;
  progress?: number;
}

export interface Provider {
  id: ProviderId;
  name: string;
  badge: string;
  description: string;
  origins: string[];
  supportsProgress: boolean;
  supportsFallbackEvent: boolean;
  movieUrl: (options: ProviderBuildOptions) => string;
  tvUrl: (options: ProviderBuildOptions) => string;
}

export const providers: Provider[] = [
  {
    id: "server-1",
    name: "Server 1",
    badge: "Resume",
    description: "Remembers playback position and continues where you left off.",
    origins: ["https://vidy.st", "https://www.vidy.st"],
    supportsProgress: true,
    supportsFallbackEvent: false,
    movieUrl: ({ tmdbId, progress }) => {
      const resume = progress && progress > 10 ? `&progress=${Math.floor(progress)}` : "";
      return `https://vidy.st/movie/${tmdbId}?color=${BRAND_COLOR}&autoplay=true${resume}`;
    },
    tvUrl: ({ tmdbId, season = 1, episode = 1, progress }) => {
      const resume = progress && progress > 10 ? `&progress=${Math.floor(progress)}` : "";
      return `https://vidy.st/tv/${tmdbId}/${season}/${episode}?color=${BRAND_COLOR}&autoplay=true&nextEpisode=true&episodeSelector=true&autoplayNextEpisode=true${resume}`;
    },
  },
  {
    id: "server-2",
    name: "Server 2",
    badge: "Alt",
    description: "Alternative playback option.",
    origins: ["https://vidsrc.mov", "https://vidsrc.to", "https://www.vidsrc.mov", "https://www.vidsrc.to"],
    supportsProgress: false,
    supportsFallbackEvent: false,
    movieUrl: ({ tmdbId }) => `https://vidsrc.mov/embed/movie/${tmdbId}`,
    tvUrl: ({ tmdbId, season = 1, episode = 1 }) => `https://vidsrc.mov/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: "server-3",
    name: "Server 3",
    badge: "Fast",
    description: "Fast playback with automatic next-episode controls.",
    origins: ["https://vidfast.vc", "https://www.vidfast.vc"],
    supportsProgress: false,
    supportsFallbackEvent: false,
    movieUrl: ({ tmdbId }) =>
      `https://vidfast.vc/movie/${tmdbId}?theme=${BRAND_COLOR}&autoPlay=true`,
    tvUrl: ({ tmdbId, season = 1, episode = 1 }) =>
      `https://vidfast.vc/tv/${tmdbId}/${season}/${episode}?theme=${BRAND_COLOR}&autoPlay=true&nextButton=true&autoNext=true`,
  },
];

export const defaultProviderId: ProviderId = "server-1";

export function getProvider(id: string | null | undefined): Provider {
  return providers.find((provider) => provider.id === id) ?? providers[0];
}

export function providerEmbedUrl(
  provider: Provider,
  type: "movie" | "tv",
  options: ProviderBuildOptions,
): string {
  return type === "movie" ? provider.movieUrl(options) : provider.tvUrl(options);
}

export function isKnownProvider(value: unknown): value is ProviderId {
  return typeof value === "string" && providers.some((provider) => provider.id === value);
}
