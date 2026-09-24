import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/__forms.html" },
    sitemap: "https://clmautomation.it/sitemap.xml",
  };
}
