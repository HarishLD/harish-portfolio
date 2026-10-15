import { education, layerChapters, profile } from "@/content";
import { site } from "@/lib/site";

/** schema.org Person for the home page. Only public, resume-backed facts; no phone, no location. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: site.description,
    url: site.url.href,
    email: `mailto:${profile.email}`,
    image: new URL("/opengraph-image", site.url).href,
    sameAs: [profile.links.linkedin, profile.links.github],
    alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
    knowsAbout: [...new Set(layerChapters.flatMap((c) => c.logos.map((l) => l.name)))],
  };
}

/** Serialize for a <script type="application/ld+json">, escaping "<" (Next.js JSON-LD guide). */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
