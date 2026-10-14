import { z } from "zod";
import { experience as rawExperience } from "./experience";
import { profile as rawProfile, skills as rawSkills } from "./profile";
import { projects as rawProjects } from "./projects";
import {
  type NavItem,
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

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export type { Layer, Metric, NavItem, Profile, Project, Role, SkillGroup } from "./schema";
