export const BRAND_COLOR = "e50914";

export type ProviderId =
  | "viduki-1"
  | "viduki-2"
  | "viduki-3"
  | "viduki-4"
  | "vidfast"
  | "vidy"
  | "vidsrc";

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

function viduki(api: 1 | 2 | 3 | 4, badge: string, description: string): Provider {
  return {
    id: `viduki-${api}` as ProviderId,
    name: `Viduki ${api}`,
    badge,
    description,
    origins: ["https://www.viduki.net", "https://viduki.net"],
    supportsProgress: false,
    supportsFallbackEvent: true,
    movieUrl: ({ tmdbId }) =>
      `https://www.viduki.net/${api}/movie/${tmdbId}?color=${BRAND_COLOR}`,
    tvUrl: ({ tmdbId, season = 1, episode = 1 }) =>
      `https://www.viduki.net/${api}/tv/${tmdbId}/${season}/${episode}?color=${BRAND_COLOR}`,
  };
}

export const providers: Provider[] = [
  {
    id: "vidy",
    name: "Vidy",
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
    id: "vidsrc",
    name: "Vidsrc",
    badge: "Free",
    description: "Alternative streaming embeds",
    origins: ["https://vidsrc.mov", "https://vidsrc.to", "https://www.vidsrc.mov", "https://www.vidsrc.to"],
    supportsProgress: false,
    supportsFallbackEvent: false,
    movieUrl: ({ tmdbId }) => `https://vidsrc.mov/embed/movie/${tmdbId}`,
    tvUrl: ({ tmdbId, season = 1, episode = 1 }) => `https://vidsrc.mov/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  viduki(1, "Multi-server", "Auto-selecting backend with the widest catalogue."),
  viduki(2, "Multi-language", "Alternate backends with additional language tracks."),
  viduki(3, "Multi-embed", "Different embed pool when the first two are busy."),
  viduki(4, "Premium", "Priority embeds and the fastest available source."),
  {
    id: "vidfast",
    name: "VidFast",
    badge: "Fast",
    description: "Fast player with automatic next-episode controls.",
    origins: ["https://vidfast.vc", "https://www.vidfast.vc"],
    supportsProgress: false,
    supportsFallbackEvent: false,
    movieUrl: ({ tmdbId }) =>
      `https://vidfast.vc/movie/${tmdbId}?theme=${BRAND_COLOR}&autoPlay=true`,
    tvUrl: ({ tmdbId, season = 1, episode = 1 }) =>
      `https://vidfast.vc/tv/${tmdbId}/${season}/${episode}?theme=${BRAND_COLOR}&autoPlay=true&nextButton=true&autoNext=true`,
  },
];

export const defaultProviderId: ProviderId = "vidy";

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
