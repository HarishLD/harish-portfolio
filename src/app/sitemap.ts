import type { MetadataRoute } from "next";
import { projects } from "@/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).href;
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: url(`/work/${p.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
