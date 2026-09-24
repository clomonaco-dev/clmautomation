import type { MetadataRoute } from "next";
import { routes, href, siteUrl } from "@/lib/routes";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return (["it", "en"] as const).flatMap((locale) =>
    routes.map((route) => ({
      url: siteUrl + href(locale, route),
      alternates: {
        languages: {
          it: siteUrl + href("it", route),
          en: siteUrl + href("en", route),
        },
      },
    })),
  );
}
