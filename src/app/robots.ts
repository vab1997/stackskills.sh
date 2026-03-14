import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/oauth-popup-callback"],
      },
    ],
    sitemap: "https://stackskills.sh/sitemap.xml",
  };
}
