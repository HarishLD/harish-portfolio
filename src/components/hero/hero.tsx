import Image from "next/image";
import { SignalLine } from "@/components/signal";
import { Accent, ButtonLink, Container, Label } from "@/components/ui";
import type { Profile } from "@/content";
import { HeroMorph } from "./hero-morph";

/**
 * Name Wall. Server-rendered and readable with zero JS: role, name and CTAs
 * are plain HTML, the avatar is the preloaded LCP image. HeroMorph is the
 * only client island and layers the device morph on after idle.
 *
 * Desktop: HARISH across the top, the avatar standing on the hero line in
 * front of its last letter, the device floating at his side, text and CTAs
 * bottom left.
 * Mobile: text first, then avatar and device sharing the bottom of the screen.
 */
export function Hero({ profile }: { profile: Profile }) {
  return (
    <section
      data-hero=""
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-line [--signal-start:5.75rem]"
    >
      <Container className="relative flex min-h-[calc(100svh-4rem)] flex-col pt-8 pb-10 lg:min-h-[max(calc(100svh-5rem),40rem)] lg:pt-10 lg:pb-16">
        <Label className="relative z-30 text-muted">{profile.role}</Label>
        <h1
          id="hero-title"
          className="relative z-0 mt-2 font-display text-name tracking-[-0.01em] uppercase"
        >
          {profile.shortName}
        </h1>

        <div className="relative z-30 mt-4 flex flex-col gap-6 lg:mt-auto lg:max-w-[34rem] lg:gap-8">
          <Accent as="p" className="text-[clamp(2rem,3.4vw,3rem)] leading-none">
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
        </div>

        {/* Mobile: a stage under the text. Desktop: a layer over the whole hero. */}
        <div className="pointer-events-none relative mt-8 -mb-10 min-h-[24rem] flex-1 [--avatar-h:min(72svh,680px)] [--avatar-left:calc(3.5rem+min(70vw,1014px)-var(--avatar-h)*0.349)] [--device-w:clamp(200px,18vw,280px)] lg:absolute lg:inset-0 lg:m-0">
          <Image
            src="/avatars/hero-main-outline.webp"
            alt={`Illustrated avatar of ${profile.shortName}`}
            width={1612}
            height={2310}
            preload
            fetchPriority="high"
            sizes="(min-width: 1024px) 475px, 62vw"
            className="absolute right-[-6%] bottom-0 z-10 h-full w-auto max-w-none lg:right-auto lg:left-(--avatar-left) lg:h-(--avatar-h)"
          />
          {/* Desktop: beside the avatar, just overlapping his sleeve. */}
          <HeroMorph className="pointer-events-auto absolute bottom-4 left-0 z-20 w-[48%] max-w-64 lg:bottom-[9%] lg:left-[calc(var(--avatar-left)-var(--device-w)+1.5rem)] lg:w-(--device-w) lg:max-w-none" />
        </div>
      </Container>
      <SignalLine tone="paper" variant="start" />
    </section>
  );
}
