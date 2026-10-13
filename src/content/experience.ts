import type { Role } from "./schema";

/** Newest first. AVASOFT and zeb are entities of the same group. */
export const experience: Role[] = [
  {
    title: "Software Engineering Analyst",
    org: "zeb",
    start: "2026-04",
    end: "2026-06",
    summary:
      "Fast client deliveries in React.js: a 2-week naming platform and a 4-day form and PDF platform.",
    projects: ["enterprise-product-naming-platform", "dynamic-form-pdf-platform"],
  },
  {
    title: "Software Engineer",
    org: "AVASOFT",
    start: "2024-08",
    end: "2026-04",
    summary:
      "Mobile, web and backend on two production platforms; promoted to L2 Technical Lead for the full pet care platform.",
    projects: ["pet-care-platform", "healthcare-records-platform"],
  },
  {
    title: "Trainee Engineer, Mobility",
    org: "AVASOFT",
    start: "2024-02",
    end: "2024-08",
    summary:
      "React Native and React.js screens and reusable components from requirements and designs, under code-review practices.",
    projects: [],
  },
];
