import type { Education, Role } from "./schema";

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

export const education: Education = {
  degree: "B.E. Computer Science and Engineering",
  school: "Rajalakshmi Institute of Technology",
  start: "2020-05",
  end: "2024-06",
  grade: "CGPA 8.0",
};

/** Certifications and teaching, as listed on the resume. */
export const learning: string[] = [
  "Full Stack Developer and AR/VR Engineer certifications (Naan Mudhalvan)",
  "Ran a 5-day Android and Web Development workshop for 300+ students",
];
