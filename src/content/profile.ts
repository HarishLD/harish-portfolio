import type { Profile, SkillGroup } from "./schema";

export const profile: Profile = {
  name: "Harish Doraiswamy",
  shortName: "Harish",
  role: "Software Engineer",
  tagline: "builds across every layer.",
  summary:
    "2.5 years building production React Native and React.js apps backed by Node.js REST APIs and SQL. Promoted to L2 Technical Lead for a full platform: technical delivery, code reviews, mentoring and post-launch hyper-care.",
  headlineStack: ["React Native", "React", "TypeScript", "Node.js", "SQL"],
  email: "harishdoraiswamy1411@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/harish-ld-7194081b8",
    github: "https://github.com/HarishLD",
  },
  availability: "Available to join in 5 to 10 days. Open to remote and relocation.",
  howIWork: [
    {
      title: "Tested",
      body: "Jest and React Testing Library on booking and payment flows, on an MVVM and Clean Architecture codebase.",
    },
    {
      title: "Shipped safely",
      body: "Branch-based CI/CD (feature, release, hotfix) across dev, QA, integration and production.",
    },
    {
      title: "Led",
      body: "Code reviews, design discussions and mentoring as L2 Technical Lead.",
    },
    {
      title: "Planned",
      body: "UML diagrams, functional requirements and production readiness checklists before shipping.",
    },
    {
      title: "AI in the product",
      body: "Integrated OpenAI GPT responses into React.js interfaces for internal real-time tools.",
    },
    {
      title: "AI in the workflow",
      body: "Claude Code for code generation, test scaffolding, debugging and refactoring, with every change reviewed before merge.",
    },
  ],
  currentlyLearning: ["Python", "FastAPI", "AWS", "Docker", "Terraform", "Java", "Spring Boot"],
};

export const skills: SkillGroup[] = [
  { label: "Languages", items: ["JavaScript (ES2020+)", "TypeScript", "SQL", "HTML5", "CSS3"] },
  {
    label: "Mobile & frontend",
    items: [
      "React Native",
      "Native modules (Kotlin, Swift)",
      "React.js",
      "Next.js (App Router)",
      "Redux",
      "Redux-Saga",
      "Material UI",
      "WebView hybrid apps",
      "Accessibility",
    ],
  },
  {
    label: "Backend & APIs",
    items: ["Node.js", "REST API design", "JWT", "RBAC", "API error handling"],
  },
  {
    label: "Data",
    items: [
      "PostgreSQL",
      "Prisma",
      "SQLite",
      "Firebase",
      "Relational modelling",
      "Query optimization",
    ],
  },
  {
    label: "Integrations",
    items: [
      "Salesforce CRM",
      "Stripe",
      "App Store and Google Play IAP",
      "WebSockets",
      "Video streaming",
    ],
  },
  {
    label: "Architecture",
    items: [
      "MVVM",
      "Clean Architecture",
      "Repository pattern",
      "Dependency injection",
      "Real-time data sync",
    ],
  },
  { label: "Testing", items: ["Jest", "React Testing Library", "Vitest", "TDD", "Lighthouse"] },
  { label: "Security", items: ["HIPAA", "Encryption at rest and in transit", "Audit logging"] },
  {
    label: "Monitoring",
    items: ["Sentry", "Firebase Crashlytics", "Firebase Analytics", "Meta Ad Tracking"],
  },
];
