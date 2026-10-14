import type { ReactNode } from "react";
import type { Project } from "@/content";
import { cx } from "@/lib/cx";
import { FormPdfBrowser, HealthRecordsPhone, NamingBrowser, NotesBrowser } from "./others";
import { PetBookingPhone, PetScheduleBrowser } from "./pet-care";

/**
 * Recreated screens per project. Client products are never shown as-is: these
 * are rebuilt in HTML/CSS with sample data and always labelled. A project
 * without an entry renders nothing (no placeholders).
 */
type ScreenSet = {
  /** Composition for the work card (decorative). */
  card: ReactNode;
  /** Figures for the case study, each with a description. */
  figures: { node: ReactNode; description: string }[];
};

const screens: Record<string, ScreenSet> = {
  "pet-care-platform": {
    card: (
      <div className="relative">
        <PetScheduleBrowser className="w-full md:w-[96%]" />
        <PetBookingPhone className="absolute top-[24%] right-[-2%] w-[30%] md:top-[30%] md:w-[32%]" />
      </div>
    ),
    figures: [
      {
        node: <PetBookingPhone className="mx-auto w-full max-w-72" />,
        description: "Booking flow on mobile: pick a day, a service and a free slot.",
      },
      {
        node: <PetScheduleBrowser className="w-full" />,
        description:
          "Location schedule on web, synced with the CRM, with an overlapping booking flagged.",
      },
    ],
  },
  "healthcare-records-platform": {
    card: <HealthRecordsPhone className="mx-auto w-[56%] max-w-60" />,
    figures: [
      {
        node: <HealthRecordsPhone className="mx-auto w-full max-w-72" />,
        description: "Records in caregiver view: shared documents and the next appointment.",
      },
    ],
  },
  "enterprise-product-naming-platform": {
    card: <NamingBrowser className="w-full" />,
    figures: [
      {
        node: <NamingBrowser className="w-full" />,
        description:
          "Naming workspace: business type and attributes on the left, a long filtered list of suggestions.",
      },
    ],
  },
  "notes-app": {
    card: <NotesBrowser className="w-full" />,
    figures: [
      {
        node: <NotesBrowser className="w-full" />,
        description: "Notes filtered by tag and search.",
      },
    ],
  },
  "dynamic-form-pdf-platform": {
    card: <FormPdfBrowser className="w-full" />,
    figures: [
      {
        node: <FormPdfBrowser className="w-full" />,
        description:
          "Step 3 of 5 with field-level validation, next to the live 6-page PDF preview.",
      },
    ],
  },
};

export function getScreens(slug: string): ScreenSet | undefined {
  return screens[slug];
}

/** The label every recreated screen carries. */
export function recreatedLabel(project: Pick<Project, "screens">) {
  return project.screens === "recreated"
    ? "Recreated UI · sample data, not the client's product"
    : "Screenshot";
}

export function ScreenFigure({
  project,
  node,
  description,
  className,
}: {
  project: Pick<Project, "screens" | "name">;
  node: ReactNode;
  description: string;
  className?: string;
}) {
  return (
    <figure className={cx("flex flex-col gap-4", className)}>
      <div role="img" aria-label={`${project.name}: ${description} (${recreatedLabel(project)})`}>
        <div aria-hidden="true">{node}</div>
      </div>
      <figcaption className="flex flex-col gap-1">
        <span className="font-mono text-label text-muted uppercase">{recreatedLabel(project)}</span>
        <span>{description}</span>
      </figcaption>
    </figure>
  );
}
