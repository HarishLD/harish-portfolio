import Link from "next/link";
import { getScreens } from "@/components/screens";
import { Label } from "@/components/ui";
import type { Project } from "@/content";
import { cx } from "@/lib/cx";
import { layerLabel } from "./layers";

/**
 * One bento card. Server-rendered; the whole card is a link to the case study
 * (stretched from the title so the accessible name stays the project name).
 * Screens are decorative here; the case study carries the described figures.
 */
export function WorkCard({ project, flagship }: { project: Project; flagship?: boolean }) {
  const featured = project.metrics.find((m) => m.featured);
  // Platform reach on its own line, never mixed with personal output (first three, e.g. downloads · DAU · locations).
  const platform = project.metrics.filter((m) => m.scope === "platform").slice(0, 3);
  const screens = getScreens(project.slug);
  const ink = flagship;

  return (
    <article
      data-spotlight=""
      className={cx(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-card p-6 md:p-8",
        screens && "pb-0 md:pb-0",
        "transition-transform duration-(--duration-micro) ease-(--ease-out-signal) hover:-translate-y-1",
        "focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-4 focus-within:ring-offset-paper",
        ink ? "bg-ink text-paper" : "border border-line bg-paper-2 text-ink",
      )}
    >
      {/* Spotlight: follows the pointer via --mx/--my set by WorkGrid. */}
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-(--duration-ui) group-hover:opacity-100",
          ink
            ? "bg-[radial-gradient(28rem_circle_at_var(--mx,50%)_var(--my,50%),rgb(239_237_230/0.08),transparent_60%)]"
            : "bg-[radial-gradient(28rem_circle_at_var(--mx,50%)_var(--my,50%),rgb(255_255_255/0.7),transparent_60%)]",
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <Label className={ink ? "text-fog" : "text-muted"}>
          {project.layers.map((l) => layerLabel[l]).join(" · ")}
          {project.kind === "personal" ? " · Personal" : " · Client"}
          {project.delivery && ` · ${project.delivery}`}
        </Label>
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-medium"
        >
          Case study
          <span className="transition-transform duration-(--duration-micro) group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>

      <h3 className="mt-3 font-display text-3xl leading-[0.95] uppercase md:text-4xl">
        <Link
          href={`/work/${project.slug}`}
          scroll={false}
          className="outline-none after:absolute after:inset-0 after:z-10 after:content-['']"
        >
          {project.name}
          <span className="sr-only">, case study</span>
        </Link>
      </h3>
      <p className={cx("mt-3 line-clamp-3 max-w-[46ch]", ink ? "text-fog" : "text-muted")}>
        {project.summary}
      </p>

      {featured && (
        <p className="mt-5 flex flex-wrap items-baseline gap-x-3">
          <span className="font-display text-5xl leading-none md:text-6xl">{featured.value}</span>
          <span>
            {featured.short}
            <span
              className={cx("ml-2 font-mono text-label uppercase", ink ? "text-fog" : "text-muted")}
            >
              {featured.scope === "own" ? "My work" : "Platform"}
            </span>
          </span>
        </p>
      )}
      {platform.length > 0 && (
        <p className={cx("mt-2", ink ? "text-fog" : "text-muted")}>
          Platform: {platform.map((m) => `${m.value} ${m.short}`).join(" · ")}
        </p>
      )}

      {/* Screens peek up from the card's bottom edge (clipped by the card). */}
      {screens && (
        <div
          aria-hidden="true"
          className={cx("relative mt-8 h-56 min-h-0 md:h-auto md:flex-1", flagship && "md:mt-10")}
        >
          <div
            className={cx(
              "absolute inset-x-0 transition-transform duration-(--duration-ui) ease-(--ease-out-signal) group-hover:-translate-y-2",
              "top-0",
            )}
          >
            {screens.card}
          </div>
        </div>
      )}
    </article>
  );
}
