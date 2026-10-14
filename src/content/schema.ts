import { z } from "zod";

/**
 * Content schema. Every claim on the site flows through these types and is
 * validated at build time (see ./index.ts). Source of truth: docs/resume-facts.md.
 */

export const layerSchema = z.enum(["mobile", "web", "backend"]);
export type Layer = z.infer<typeof layerSchema>;

/**
 * Every metric declares its scope:
 * - "platform": reach of the whole product (Harish did not produce it alone)
 * - "own": the outcome of Harish's own work
 */
export const metricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  /** Compact label for cards and one-line summaries ("5K DAU"). */
  short: z.string().min(1),
  scope: z.enum(["platform", "own"]),
  /** The one metric a work card leads with. */
  featured: z.boolean().optional(),
});
export type Metric = z.infer<typeof metricSchema>;

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug");
const httpsUrl = z.url({ protocol: /^https$/ });

export const projectSchema = z
  .object({
    slug,
    name: z.string().min(1),
    /** Client work uses a generic name and recreated screens; personal work may show real ones. */
    kind: z.enum(["client", "personal"]),
    role: z.string().min(1),
    /** One short line for the work grid; the full `summary` is for the case study. */
    cardSummary: z.string().min(1).max(80),
    summary: z.string().min(1),
    layers: z.array(layerSchema).min(1),
    stack: z.array(z.string().min(1)).min(1),
    delivery: z.string().min(1).optional(),
    metrics: z.array(metricSchema),
    highlights: z.array(z.string().min(1)).min(1),
    screens: z.enum(["recreated", "real"]),
    links: z.object({ live: httpsUrl.optional(), source: httpsUrl.optional() }).optional(),
  })
  .refine((p) => p.metrics.filter((m) => m.featured).length === 1, {
    message: "Exactly one featured metric per project",
    path: ["metrics"],
  })
  .refine((p) => p.kind === "personal" || p.screens === "recreated", {
    message: "Client projects must use recreated screens",
    path: ["screens"],
  })
  .refine((p) => p.kind === "personal" || !p.links, {
    message: "Client projects cannot link to live products or source",
    path: ["links"],
  });
export type Project = z.infer<typeof projectSchema>;

export const roleSchema = z.object({
  title: z.string().min(1),
  org: z.string().min(1),
  /** ISO year-month, e.g. "2024-02". */
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}$/),
  summary: z.string().min(1),
  projects: z.array(slug),
});
export type Role = z.infer<typeof roleSchema>;

export const profileSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  role: z.literal("Software Engineer"),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  headlineStack: z.array(z.string().min(1)).min(1),
  email: z.email(),
  links: z.object({ linkedin: httpsUrl, github: httpsUrl }),
  /** Phone-free public PDF. Optional until M5: CTAs render nothing when it is missing. */
  resumeUrl: z.string().startsWith("/").optional(),
  /** Practices for "How I Work" (internal AI tooling lives here, not as a project). */
  howIWork: z.array(z.string().min(1)).min(1),
  /** The only place the learning stack may appear. */
  currentlyLearning: z.array(z.string().min(1)),
});
export type Profile = z.infer<typeof profileSchema>;

export const skillGroupSchema = z.object({
  label: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});
export type SkillGroup = z.infer<typeof skillGroupSchema>;

export const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().regex(/^\/(#[a-z-]+)?$/, "in-page anchor on the home page"),
});
export type NavItem = z.infer<typeof navItemSchema>;
