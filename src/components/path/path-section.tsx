import Link from "next/link";
import { Display, Label, Section, SignalDot } from "@/components/ui";
import { education, experience, getProject, learning } from "@/content";
import { cx } from "@/lib/cx";

function month(ym: string) {
  const [year, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(year ?? 0, (m ?? 1) - 1)).toLocaleDateString("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Path: roles newest first on a hairline timeline. The one lime moment is the
 * promotion to L2 Technical Lead; everything else stays ink.
 */
export function PathSection() {
  return (
    <Section id="path" signal="through" aria-labelledby="path-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Label className="text-muted">2020 to 2026</Label>
          <Display id="path-title" className="mt-4">
            Path
          </Display>
          <p className="mt-6 max-w-[36ch] text-muted">
            From trainee engineer to L2 Technical Lead, then fast client deliveries.
          </p>
        </div>

        <div>
          <ol className="relative flex flex-col gap-14 border-l border-line pl-8 md:pl-12">
            {experience.map((role) => {
              const lead = role.projects.includes("pet-care-platform");
              return (
                <li key={`${role.org}-${role.start}`} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-2 -left-[calc(2rem+5px)] size-2.5 rounded-pill bg-ink md:-left-[calc(3rem+5px)]"
                  />
                  <Label className="text-muted">
                    {month(role.start)} to {month(role.end)} · {role.org}
                  </Label>
                  <h3 className="mt-2 font-display text-[clamp(2rem,4vw,3rem)] leading-[0.95] uppercase">
                    {role.title}
                  </h3>
                  <p className="mt-3 max-w-[60ch]">{role.summary}</p>
                  {lead && (
                    <p className="mt-5 inline-flex items-center gap-3 rounded-pill border border-line px-4 py-2">
                      <SignalDot size="sm" />
                      <span>Promoted to L2 Technical Lead for the full Pet Care Platform</span>
                    </p>
                  )}
                  {role.projects.length > 0 && (
                    <ul
                      aria-label={`Projects as ${role.title}`}
                      className="mt-5 flex flex-wrap gap-2"
                    >
                      {role.projects.map((slug) => {
                        const p = getProject(slug);
                        if (!p) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/work/${slug}`}
                              scroll={false}
                              className="inline-flex items-center gap-2 rounded-pill bg-paper-2 px-4 py-2 transition-colors hover:bg-ink hover:text-paper"
                            >
                              {p.name} <span aria-hidden="true">→</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            <div className={cx("rounded-card border border-line p-6")}>
              <Label className="text-muted">Education</Label>
              <p className="mt-3 font-medium">{education.degree}</p>
              <p className="text-muted">
                {education.school} · {month(education.start)} to {month(education.end)} ·{" "}
                {education.grade}
              </p>
            </div>
            <div className="rounded-card border border-line p-6">
              <Label className="text-muted">Teaching and certifications</Label>
              <ul className="mt-3 flex flex-col gap-2">
                {learning.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
