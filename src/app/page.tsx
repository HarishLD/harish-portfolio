import { ContactSection } from "@/components/contact";
import { Hero } from "@/components/hero";
import { HowSection } from "@/components/how";
import { LayersSection } from "@/components/layers";
import { PathSection } from "@/components/path";
import { SignalThread } from "@/components/signal";
import { WorkSection } from "@/components/work";
import { profile } from "@/content";
import { personJsonLd, serializeJsonLd } from "@/lib/json-ld";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd()) }}
      />
      <Hero profile={profile} />
      <SignalThread />

      <WorkSection />

      <LayersSection />

      <PathSection />

      <HowSection />

      <ContactSection />
    </>
  );
}
