import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "1FLEX — Stream Movies & TV Shows",
    short_name: "1FLEX",
    description:
      "Stream trending movies and TV shows with a fast, cinematic interface and multiple playback servers.",
    start_url: "/",
    display: "standalone",
    background_color: "#141414",
    theme_color: "#141414",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
