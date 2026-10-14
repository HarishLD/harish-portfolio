import type { Project } from "./schema";

/** Featured order is the array order (see CLAUDE.md). */
export const projects: Project[] = [
  {
    slug: "pet-care-platform",
    name: "Pet Care Platform",
    kind: "client",
    role: "Software Engineer, then L2 Technical Lead",
    summary:
      "React Native apps and a mobile-first React.js web version for a pet care and wellness business, backed by Node.js REST APIs, SQL and Salesforce CRM.",
    layers: ["mobile", "web", "backend"],
    stack: ["React Native", "React.js", "Node.js", "SQL", "Salesforce CRM"],
    metrics: [
      { value: "100K+", label: "downloads", short: "downloads", scope: "platform" },
      { value: "5K", label: "daily active users", short: "DAU", scope: "platform" },
      { value: "250+", label: "franchise locations", short: "locations", scope: "platform" },
      {
        value: "50K+",
        label: "weekday bookings through the module I built",
        short: "weekday bookings",
        scope: "own",
        featured: true,
      },
      {
        value: "70K+",
        label: "weekend bookings through the module I built",
        short: "weekend bookings",
        scope: "own",
      },
      {
        value: "~2,000",
        label: "concurrent users at peak on booking",
        short: "peak concurrent users",
        scope: "own",
      },
      {
        value: "<100",
        label: "CRM sync failures per day",
        short: "sync failures/day",
        scope: "own",
      },
      { value: "<0.1%", label: "crash rate after launch", short: "crash rate", scope: "platform" },
    ],
    highlights: [
      "Progressed from Phase 1 contributor to Phase 2 L2 Technical Lead for the entire platform.",
      "Built the booking and scheduling module end to end: mobile and web clients, Node.js REST APIs, SQL and Salesforce CRM, with interval overlap detection and real-time CRM sync.",
      "Real-time video streaming and in-app payments: WebSocket connection management, exponential-backoff reconnection, adaptive bitrate for variable mobile networks.",
      "Standardized data fetching, retry and error recovery with reusable components, custom Hooks and Redux-Saga (MVVM).",
      "Sustained 60fps scrolling across mobile, tablet and desktop, and led the production cutover from the legacy app.",
      "Two months of post-launch hyper-care: Sentry triage and 13 client user stories in one 4-week sprint.",
    ],
    screens: "recreated",
  },
  {
    slug: "healthcare-records-platform",
    name: "Healthcare Records Platform",
    kind: "client",
    role: "Core engineer, 5-member team",
    summary:
      "React Native apps and a React.js web version for medical records, appointment tracking, wellness logs and caregiver document sharing. Launched May 2026.",
    layers: ["mobile", "web"],
    stack: ["React Native", "React.js", "REST APIs", "Stripe", "HIPAA"],
    metrics: [
      { value: "400+", label: "screens", short: "screens", scope: "platform" },
      {
        value: "4.2s → 1.8s",
        label: "load time",
        short: "load time",
        scope: "own",
        featured: true,
      },
      { value: "<0.1%", label: "crash incidents", short: "crash incidents", scope: "platform" },
    ],
    highlights: [
      "RBAC for patients, caregivers and providers, with JWT, encryption at rest, TLS in transit and audit logging.",
      "Stripe plus App Store and Google Play IAP: subscription tiers, renewal tracking and grace periods.",
      "Native Kotlin and Swift calendar integrations, Firebase Analytics and Meta Ad Tracking.",
      "MVVM, Clean Architecture, repository pattern and dependency injection.",
    ],
    screens: "recreated",
  },
  {
    slug: "enterprise-product-naming-platform",
    name: "Enterprise Product Naming Platform",
    kind: "client",
    role: "Software Engineering Analyst",
    summary:
      "An AI-assisted naming platform that classifies products by business type and attributes and suggests context-aware names in real time.",
    layers: ["web"],
    stack: ["React.js", "REST APIs"],
    delivery: "2 weeks",
    metrics: [
      {
        value: "1,000+",
        label: "name suggestions in real time",
        short: "live suggestions",
        scope: "own",
        featured: true,
      },
    ],
    highlights: [
      "Built end to end: product classification with string tokenization and whitespace pattern segmentation.",
      "UI, reusable component architecture, state management and REST integration.",
      "Debounced filtering and list virtualization for large result lists.",
    ],
    screens: "recreated",
  },
  {
    slug: "notes-app",
    name: "Full Stack Notes App",
    kind: "personal",
    role: "Personal project",
    summary:
      "A full stack notes app with JWT auth, tagging and filtered search on PostgreSQL, built test-first.",
    layers: ["web", "backend"],
    stack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma"],
    metrics: [
      {
        value: "113",
        label: "unit and integration tests",
        short: "tests",
        scope: "own",
        featured: true,
      },
      { value: "100", label: "Lighthouse accessibility", short: "Lighthouse a11y", scope: "own" },
    ],
    highlights: [
      "Next.js App Router with strict TypeScript.",
      "TDD with Vitest; trade-offs documented in DECISIONS.md.",
    ],
    // Live app is behind a login; recreated until a real screenshot is provided.
    screens: "recreated",
    links: {
      live: "https://notes-app-v19s-three.vercel.app",
      source: "https://github.com/HarishLD/notes_app",
    },
  },
  {
    slug: "dynamic-form-pdf-platform",
    name: "Dynamic Form + PDF Platform",
    kind: "client",
    role: "Software Engineering Analyst",
    summary:
      "A 5-step form workflow with field-level validation and a dynamic PDF generation engine.",
    layers: ["web"],
    stack: ["React.js", "HTML/CSS templating"],
    delivery: "4 days",
    metrics: [
      { value: "5", label: "step form workflow", short: "form steps", scope: "own" },
      { value: "6", label: "page dynamic PDF", short: "PDF pages", scope: "own", featured: true },
    ],
    highlights: ["Reusable form components and a templated HTML/CSS rendering layer."],
    screens: "recreated",
  },
];
