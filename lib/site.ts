export const siteName = "SB Stream";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/\/+$/, "")}`;

  const preview = process.env.VERCEL_URL?.trim();
  if (preview) return `https://${preview.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const siteDescription =
  "Stream trending movies and TV shows with a fast, cinematic interface and multiple playback servers.";
