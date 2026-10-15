import type { LayerChapter } from "./schema";

/**
 * Layers chapters (Mobile → Web → Backend). Every line traces to
 * docs/resume-facts.md. Logos: max 5 per chapter, the first is the layer's
 * own mark (highlighted). `icon` is a simple-icons slug; without one the
 * logo renders as a text label (no invented marks).
 */
export const layerChapters: LayerChapter[] = [
  {
    id: "mobile",
    title: "Mobile",
    body: "React Native apps with native Kotlin and Swift modules, profiled until they hold 60fps on real devices.",
    proof: {
      value: "4.2s → 1.8s",
      label: "load time I cut on the Healthcare Records apps",
      scope: "own",
    },
    logos: [
      { name: "React Native", icon: "react" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Kotlin", icon: "kotlin" },
      { name: "Swift", icon: "swift" },
      { name: "Firebase", icon: "firebase" },
    ],
  },
  {
    id: "web",
    title: "Web",
    body: "React and Next.js front ends with reusable components and Redux state, kept fast with debouncing and list virtualization.",
    proof: {
      value: "1,000+",
      label: "real-time name suggestions in a virtualized list I built",
      scope: "own",
    },
    logos: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Redux", icon: "redux" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    body: "Node.js REST APIs and SQL behind the apps, with real-time CRM sync and WebSocket connections that recover on their own.",
    proof: {
      value: "50K+",
      label: "weekday bookings through the Node.js, SQL and Salesforce module I built",
      scope: "own",
    },
    logos: [
      { name: "Node.js", icon: "nodedotjs" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Prisma", icon: "prisma" },
      { name: "Salesforce" },
      { name: "WebSockets" },
    ],
  },
];
