import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ufmt-stats.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      // Admin is intentionally not indexed — auth-gated.
      url: `${SITE_URL}/admin`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.1,
      robots: { index: false, follow: false },
    },
  ];
}
