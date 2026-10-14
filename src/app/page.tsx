import { Hero } from "@/components/hero";
import { SignalThread } from "@/components/signal";
import { WorkSection } from "@/components/work";
import { ButtonLink, Display, Label, Section, SignalDot } from "@/components/ui";
import { experience, profile, skills } from "@/content";

function formatMonth(ym: string) {
  const [year, month] = ym.split("-").map(Number);
  return new Date(Date.UTC(year ?? 0, (month ?? 1) - 1)).toLocaleDateString("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Home. Hero (M2) and Work (M3) are final; the rest is the M1 scaffold, replaced
 * by the designed versions in M4 (layers, path, how I work) and M5 (contact).
 */
export default function Home() {
  return (
    <>
      <Hero profile={profile} />
      <SignalThread />

      <WorkSection />

      <Section id="layers" tone="ink" signal="through" aria-labelledby="layers-title">
        <Label className="text-fog">Mobile · Web · Backend</Label>
        <Display id="layers-title" className="mt-4">
          Layers
        </Display>
        <dl className="mt-12 grid gap-8 md:grid-cols-3">
          {skills.map((g) => (
            <div key={g.label}>
              <dt>
                <Label as="span" className="text-fog">
                  {g.label}
                </Label>
              </dt>
              <dd className="mt-2">{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-12 text-fog">
          Currently learning: {profile.currentlyLearning.join(", ")}.
        </p>
      </Section>

      <Section id="path" signal="through" aria-labelledby="path-title">
        <Display id="path-title">Path</Display>
        <ol className="mt-12 flex flex-col gap-10">
          {experience.map((r) => (
            <li key={`${r.org}-${r.start}`} className="flex gap-4">
              <SignalDot className="mt-2" />
              <div>
                <Label className="text-muted">
                  {formatMonth(r.start)} to {formatMonth(r.end)} · {r.org}
                </Label>
                <h3 className="mt-1 font-display text-2xl uppercase">{r.title}</h3>
                <p className="mt-2 max-w-[60ch]">{r.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="how-i-work"
        signal="through"
        aria-labelledby="how-title"
        className="border-t border-line"
      >
        <Display id="how-title">How I work</Display>
        <ul className="mt-12 grid max-w-[70ch] gap-3">
          {profile.howIWork.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Section>

      <Section id="contact" tone="ink" signal="end" aria-labelledby="contact-title">
        <div className="flex items-center gap-3">
          <SignalDot tone="ink" />
          <Label className="text-fog">Contact</Label>
        </div>
        <Display id="contact-title" size="xl" className="mt-4">
          Let&rsquo;s talk
        </Display>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={`mailto:${profile.email}`} variant="signal" size="lg">
            {profile.email}
          </ButtonLink>
          <ButtonLink href={profile.links.linkedin} variant="ghost" size="lg">
            LinkedIn
          </ButtonLink>
          <ButtonLink href={profile.links.github} variant="ghost" size="lg">
            GitHub
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
