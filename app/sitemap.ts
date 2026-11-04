import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/movies`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/tv`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/legal`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
