import { Hero } from "@/components/hero";
import { HowSection } from "@/components/how";
import { LayersSection } from "@/components/layers";
import { PathSection } from "@/components/path";
import { SignalThread } from "@/components/signal";
import { ButtonLink, Display, Label, Section, SignalDot } from "@/components/ui";
import { WorkSection } from "@/components/work";
import { profile } from "@/content";

/**
 * Home. Contact is still the M1 scaffold; its designed version lands in M5.
 */
export default function Home() {
  return (
    <>
      <Hero profile={profile} />
      <SignalThread />

      <WorkSection />

      <LayersSection />

      <PathSection />

      <HowSection />

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
