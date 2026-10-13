import { MetricLines } from "@/components/metric-lines";
import {
  Accent,
  ButtonLink,
  Card,
  Container,
  Display,
  Label,
  Section,
  SignalDot,
} from "@/components/ui";
import { experience, profile, projects, skills } from "@/content";

const layerLabel = { mobile: "Mobile", web: "Web", backend: "Backend" } as const;

function formatMonth(ym: string) {
  const [year, month] = ym.split("-").map(Number);
  return new Date(Date.UTC(year ?? 0, (month ?? 1) - 1)).toLocaleDateString("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * M1 scaffold: real content wired through the primitives so navigation and the
 * content layer can be reviewed. Each section is replaced by its designed
 * version in M2 (hero), M3 (work), M4 (layers, path, how I work), M5 (contact).
 */
export default function Home() {
  return (
    <>
      <Container className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center gap-8 py-18 lg:min-h-[calc(100dvh-5rem)]">
        <Label className="text-muted">{profile.role}</Label>
        <Display as="h1" size="name">
          {profile.shortName}
        </Display>
        <Accent as="p" className="text-[clamp(2rem,3.8vw,3.4rem)] leading-none">
          {profile.tagline}
        </Accent>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/#work" size="lg">
            See the work
          </ButtonLink>
          {profile.resumeUrl && (
            <ButtonLink href={profile.resumeUrl} variant="secondary" size="lg" download>
              Download resume
            </ButtonLink>
          )}
        </div>
      </Container>

      <Section id="work" aria-labelledby="work-title">
        <Label className="text-muted">Selected work</Label>
        <Display id="work-title" className="mt-4">
          Work
        </Display>
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.slug}>
              <Card className="flex h-full flex-col gap-4">
                <Label className="text-muted">
                  {p.layers.map((l) => layerLabel[l]).join(" · ")}
                  {p.delivery && ` · ${p.delivery}`}
                </Label>
                <h3 className="font-display text-3xl uppercase">{p.name}</h3>
                <p>{p.summary}</p>
                <MetricLines metrics={p.metrics} />
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="layers" tone="ink" aria-labelledby="layers-title">
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

      <Section id="path" aria-labelledby="path-title">
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

      <Section id="how-i-work" aria-labelledby="how-title" className="border-t border-line">
        <Display id="how-title">How I work</Display>
        <ul className="mt-12 grid max-w-[70ch] gap-3">
          {profile.howIWork.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Section>

      <Section id="contact" tone="ink" aria-labelledby="contact-title">
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
