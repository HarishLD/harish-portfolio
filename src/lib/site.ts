import { profile } from "@/content";

/**
 * Site-wide constants. Public values only: nothing secret belongs here.
 * NEXT_PUBLIC_SITE_URL is set per environment (see .env.example).
 */

function resolveSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  // Vercel sets this automatically on every deployment (preview and production).
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelUrl) return new URL(`https://${vercelUrl}`);

  return new URL("http://localhost:3000");
}

/**
 * Search engines may index only the production deployment. Previews, local
 * builds and CI stay noindex (VERCEL_ENV is "production" only on Vercel prod).
 */
export const indexable = process.env.VERCEL_ENV === "production";

export const site = {
  name: profile.name,
  shortName: profile.shortName,
  role: profile.role,
  description:
    "Software engineer building products across mobile, web and backend with React Native, React, Node.js and SQL.",
  url: resolveSiteUrl(),
} as const;
