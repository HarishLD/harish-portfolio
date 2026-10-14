import Image from "next/image";
import { SignalLine } from "@/components/signal";
import { Accent, ButtonLink, Container } from "@/components/ui";
import type { Profile } from "@/content";
import { HeroMorph } from "./hero-morph";

/**
 * Name Wall. Server-rendered and readable with zero JS: role, name and CTAs
 * are plain HTML, the avatar is the preloaded LCP image. HeroMorph is the
 * only client island and layers the device morph on after idle.
 *
 * One grid, sized by the name itself:
 * - Column 1 is exactly as wide as HARISH, so the avatar centers under "RIS"
 *   without measuring. Its height follows the name size, so his head always
 *   covers the upper half of the letters.
 * - Desktop (xl): role, tagline and CTAs sit right under the name, left of
 *   the avatar; the device takes column 2, past the end of the name. The
 *   avatar stands on the hero's bottom edge.
 * - Below xl: the device moves under the letters at the avatar's side, the
 *   avatar stands on a line, and the text follows below it.
 *
 * Vars: --F name size, --Ha avatar height (desktop: 72svh, max 680px).
 */
export function Hero({ profile }: { profile: Profile }) {
  return (
    <section
      data-hero=""
      aria-labelledby="hero-title"
      className="relative overflow-hidden xl:border-b xl:border-line"
    >
      <Container
        className={[
          "relative grid grid-cols-[auto_1fr] pt-8 xl:pt-10",
          "[--F:var(--text-name)] [--Ha:min(calc(var(--F)*2.2),55svh)] xl:[--Ha:min(72svh,680px)]",
          // Row 2 is the avatar's height minus the part that overlaps the name.
          "grid-rows-[auto_calc(var(--Ha)-var(--F)*0.7)_auto]",
          "xl:min-h-[calc(var(--F)*0.12+var(--Ha))] xl:grid-rows-[auto_auto_1fr]",
        ].join(" ")}
      >
        <h1
          id="hero-title"
          className="relative z-0 col-start-1 row-start-1 font-display text-name tracking-[-0.01em] uppercase"
        >
          {profile.shortName}
        </h1>

        <Image
          src="/avatars/hero-main-outline.webp"
          alt={`Illustrated avatar of ${profile.shortName}`}
          width={1612}
          height={2310}
          preload
          fetchPriority="high"
          sizes="(min-width: 1280px) 475px, 45vw"
          className="relative z-10 col-start-1 row-span-2 row-start-1 h-(--Ha) w-auto max-w-none self-end justify-self-center xl:row-span-full"
        />

        {/* Below xl the avatar stands on this line; on xl the hero's bottom edge plays that part. */}
        <span
          aria-hidden="true"
          className="col-span-full row-start-2 h-px self-end bg-line xl:hidden"
        />

        <HeroMorph className="relative z-20 col-span-full row-start-2 mb-2 w-[min(34%,calc(var(--Ha)-var(--F)*0.7-4.5rem))] items-end self-end justify-self-end xl:col-span-1 xl:col-start-2 xl:row-span-full xl:row-start-1 xl:mb-8 xl:ml-6 xl:w-full xl:max-w-[300px] xl:items-center xl:justify-self-center" />

        <div className="relative z-30 col-span-full row-start-3 flex flex-col gap-5 pt-8 pb-10 [--signal-top:0.9rem] xl:col-span-1 xl:col-start-1 xl:row-span-2 xl:row-start-2 xl:max-w-[calc(var(--F)*1.3-var(--Ha)*0.349-1.5rem)] xl:pt-6 xl:pb-0">
          <SignalLine tone="paper" variant="start" anchor="content" />
          <p className="text-lg font-medium xl:text-xl">{profile.role}</p>
          <Accent as="p" className="-mt-2 text-[clamp(2.25rem,8vw,2.75rem)] leading-[1.02]">
            {profile.tagline}
          </Accent>
          <div className="flex flex-wrap gap-3 pt-1">
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
      </Container>
    </section>
  );
}
