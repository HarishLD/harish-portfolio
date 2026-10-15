import Link from "next/link";
import { PetBookingPhone } from "@/components/screens/pet-care";
import { cx } from "@/lib/cx";
import { HeroPhoneMotion } from "./hero-phone-motion";

/**
 * The hero phone: the recreated Pet Care booking screen playing a CSS-only
 * loop, in the tilted device pose (xl). A link to the case study.
 * Layers, outermost first: link → perspective box → float (CSS) → tilt
 * (CSS vars set by HeroPhoneMotion after idle) → phone.
 */
export function HeroPhone({ className }: { className?: string }) {
  // The link is an empty overlay on top of the visuals: its accessible name is the
  // label alone (the demo's on-screen text isn't part of the link).
  return (
    <div data-hero-phone="" className={cx("group relative", className)}>
      <div aria-hidden="true" className="relative aspect-square xl:[perspective:1400px]">
        {/* One soft shadow on paper, as a gradient (no filters). */}
        <span className="absolute inset-x-[10%] bottom-[-2%] h-[10%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(11_11_10/0.22),transparent)]" />
        <div className="hero-float size-full">
          <div
            data-hero-tilt=""
            className={cx(
              "booking-demo relative size-full transition-transform duration-500 ease-(--ease-out-signal)",
              "xl:[transform:rotateY(calc(-24deg+var(--tilt-y,0deg)))_rotateX(calc(8deg+var(--tilt-x,0deg)))]",
            )}
          >
            <PetBookingPhone className="absolute inset-y-[1.5%] left-[27%] w-[46%]" />
          </div>
        </div>
      </div>
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-pill bg-ink px-3 py-1.5",
          "font-mono text-[0.6875rem] whitespace-nowrap text-paper uppercase opacity-0",
          "transition-opacity duration-(--duration-micro) group-hover:opacity-100 group-has-[a:focus-visible]:opacity-100",
        )}
      >
        Recreated UI
      </span>
      <Link
        href="/work/pet-care-platform"
        scroll={false}
        aria-label="Pet Care Platform booking demo (recreated UI), open case study"
        className="absolute -inset-2 z-10 rounded-card outline-none focus-visible:ring-2 focus-visible:ring-ink"
      />
      <HeroPhoneMotion />
    </div>
  );
}
