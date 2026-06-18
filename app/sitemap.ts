import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ufmt-stats.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // /admin is intentionally excluded — it's auth-gated and disallowed in
  // robots.txt, so it shouldn't appear in the sitemap either.
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
