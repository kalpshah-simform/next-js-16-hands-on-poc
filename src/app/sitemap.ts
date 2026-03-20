import type { MetadataRoute } from "next";
import { getEnv } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const { NEXTAUTH_URL: baseUrl } = getEnv();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
