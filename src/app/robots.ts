import type { MetadataRoute } from "next";
import { getEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const { NEXTAUTH_URL: baseUrl } = getEnv();

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/signup"],
      disallow: ["/dashboard", "/posts"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}