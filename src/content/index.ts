import { z } from "zod";
import {
  education as rawEducation,
  experience as rawExperience,
  learning as rawLearning,
} from "./experience";
import { layerChapters as rawLayerChapters } from "./layers";
import { profile as rawProfile, skills as rawSkills } from "./profile";
import { projects as rawProjects } from "./projects";
import {
  type NavItem,
  educationSchema,
  layerChapterSchema,
  navItemSchema,
  profileSchema,
  projectSchema,
  roleSchema,
  skillGroupSchema,
} from "./schema";

/**
 * Typed, validated content. Parsing at import time means a bad edit fails
 * `next build` (and the unit tests) instead of shipping.
 */

const rawNav: NavItem[] = [
  { label: "Work", href: "/#work" },
  { label: "Layers", href: "/#layers" },
  { label: "Path", href: "/#path" },
  { label: "How I work", href: "/#how-i-work" },
];

const projectList = z
  .array(projectSchema)
  .refine(
    (list) => new Set(list.map((p) => p.slug)).size === list.length,
    "Duplicate project slug",
  );

export const profile = profileSchema.parse(rawProfile);
export const skills = z.array(skillGroupSchema).parse(rawSkills);
export const projects = projectList.parse(rawProjects);
export const nav = z.array(navItemSchema).parse(rawNav);
export const contactHref = "/#contact";

const slugs = new Set(projects.map((p) => p.slug));
export const experience = z
  .array(
    roleSchema.refine(
      (r) => r.projects.every((s) => slugs.has(s)),
      "Role references unknown project",
    ),
  )
  .parse(rawExperience);

export const layerChapters = z
  .array(layerChapterSchema)
  .length(3)
  .refine(
    (c) => c.map((x) => x.id).join() === "mobile,web,backend",
    "Chapters must be Mobile, Web, Backend",
  )
  .parse(rawLayerChapters);
export const education = educationSchema.parse(rawEducation);
export const learning = z.array(z.string().min(1)).parse(rawLearning);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export type {
  Education,
  Layer,
  LayerChapter,
  Metric,
  NavItem,
  Profile,
  Project,
  Role,
  SkillGroup,
} from "./schema";
