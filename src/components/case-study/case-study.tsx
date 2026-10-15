import Link from "next/link";
import { ScreenFigure, getScreens } from "@/components/screens";
import { ButtonLink, Display, Label } from "@/components/ui";
import { type Project, projects } from "@/content";
import { cx } from "@/lib/cx";
import { layerLabel } from "@/components/work/layers";

const scopeTitle = { platform: "Platform", own: "My work" } as const;

/**
 * Case study body, shared by the full page (/work/[slug]) and the overlay
 * opened from the work grid. In the overlay (`inOverlay`) the title is an h2
 * (the page keeps the only h1) and "Next project" replaces the history entry,
 * so Close/Escape always return to where the visitor opened it.
 */
export function CaseStudy({
  project,
  inOverlay = false,
  titleId,
}: {
  project: Project;
  inOverlay?: boolean;
  titleId?: string;
}) {
  const screens = getScreens(project.slug);
  // One level below the title: h2 on the page (title h1), h3 in the overlay (title h2).
  const sub = inOverlay ? "h3" : "h2";
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="flex flex-col gap-14 md:gap-20">
      <header className="flex flex-col gap-5">
        <Label className="text-muted">
          {project.kind === "client" ? "Client project" : "Personal project"} ·{" "}
          {project.layers.map((l) => layerLabel[l]).join(" · ")}
          {project.delivery && ` · Delivered in ${project.delivery}`}
        </Label>
        <Display as={inOverlay ? "h2" : "h1"} id={titleId} size="xl">
          {project.name}
        </Display>
        <p className="max-w-[60ch] text-[clamp(1.25rem,2vw,1.5rem)] leading-snug">
          {project.summary}
        </p>
        <p className="text-muted">Role: {project.role}</p>
        {project.links && (
          <div className="flex flex-wrap gap-3 pt-2">
            {project.links.live && (
              <ButtonLink href={project.links.live}>
                Open the live app<span className="sr-only"> (opens in a new tab)</span>
              </ButtonLink>
            )}
            {project.links.source && (
              <ButtonLink href={project.links.source} variant="secondary">
                Source on GitHub<span className="sr-only"> (opens in a new tab)</span>
              </ButtonLink>
            )}
          </div>
        )}
      </header>

      <section aria-label="Results" className="flex flex-col gap-10">
        {(["platform", "own"] as const).map((scope) => {
          const items = project.metrics.filter((m) => m.scope === scope);
          if (items.length === 0) return null;
          return (
            <div key={scope} className="flex flex-col gap-4 border-t border-line pt-6">
              <Label as={sub} className="text-muted">
                {scopeTitle[scope]}
              </Label>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
                {items.map((m) => (
                  <div
                    key={m.label}
                    className={cx(
                      "flex flex-col-reverse justify-end gap-2",
                      // Long values ("4.2s → 1.8s") get two columns on phones instead of wrapping.
                      m.value.length > 6 && "col-span-2 md:col-span-1",
                    )}
                  >
                    <dt className="text-muted">{m.label}</dt>
                    <dd className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none whitespace-nowrap">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </section>

      {screens && (
        <section
          aria-label="Screens"
          className={cx(
            "grid gap-10 rounded-card bg-paper-2 p-6 md:p-10",
            screens.figures.length > 1 && "md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-end",
          )}
        >
          {screens.figures.map((f) => (
            <ScreenFigure
              key={f.description}
              project={project}
              node={f.node}
              description={f.description}
            />
          ))}
        </section>
      )}

      <section
        aria-labelledby={`${project.slug}-did`}
        className="grid gap-6 md:grid-cols-[1fr_2fr]"
      >
        <Label as={sub} id={`${project.slug}-did`} className="text-muted">
          What I did
        </Label>
        <ul className="flex flex-col gap-4">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-4">
              <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-ink" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby={`${project.slug}-stack`}
        className="grid gap-6 md:grid-cols-[1fr_2fr]"
      >
        <Label as={sub} id={`${project.slug}-stack`} className="text-muted">
          Stack
        </Label>
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li key={s} className="rounded-pill border border-line px-4 py-2">
              {s}
            </li>
          ))}
        </ul>
      </section>

      {next && next.slug !== project.slug && (
        <nav aria-label="More work" className="border-t border-line pt-8">
          <Link
            href={`/work/${next.slug}`}
            scroll={false}
            replace={inOverlay}
            className="group flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between"
          >
            <Label as="span" className="text-muted">
              Next project
            </Label>
            <span className="font-display text-[clamp(2rem,4vw,3rem)] leading-none uppercase">
              {next.name}{" "}
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        </nav>
      )}
    </article>
  );
}
