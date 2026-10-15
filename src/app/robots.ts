import type { MetadataRoute } from "next";
import { indexable, site } from "@/lib/site";

/** Production allows crawling and points at the sitemap; every other deployment disallows it. */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).href,
  };
}
