"use client";

import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Device } from "@/components/hero/device";
import {
  type Gsap,
  type ScrollTrigger,
  afterLoad,
  loadGsap,
  loadScrollTrigger,
  useMotion,
} from "@/components/motion";
import type { Layer } from "@/content";
import { cx } from "@/lib/cx";

export type ChapterSlot = {
  id: Layer;
  title: string;
  /** Server-rendered chapter text (title, body, proof point). */
  text: ReactNode;
  /** Server-rendered logo list; `orbit` variant is the same list, unstyled for positioning. */
  logos: ReactNode;
  orbitLogos: ReactNode;
};

const LG = "(min-width: 64rem)";
const subscribeLg = (cb: () => void) => {
  const mq = window.matchMedia(LG);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Settled angle per chapter: each layer gets its own fixed view of the device. */
const ANGLES: Record<Layer, { rotationY: number; rotationX: number }> = {
  mobile: { rotationY: -24, rotationX: 8 },
  web: { rotationY: 16, rotationX: 6 },
  backend: { rotationY: -12, rotationX: 10 },
};

/**
 * Layers island.
 * - Default (server HTML, no JS, reduced motion, below lg): three static steps;
 *   below lg they are horizontally swipeable cards.
 * - Desktop with full motion: once GSAP + ScrollTrigger have loaded (a viewport
 *   before the section arrives, so nothing visible shifts) it switches to the
 *   pinned layout. One scrubbed timeline: hold, turn and morph, hold... so each
 *   state holds while its chapter is on screen and scrolling back reverses it.
 */
export function LayersIsland({ chapters, skipTo }: { chapters: ChapterSlot[]; skipTo: string }) {
  const motion = useMotion();
  const isLg = useSyncExternalStore(
    subscribeLg,
    () => window.matchMedia(LG).matches,
    () => false,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lib = useRef<{ gsap: Gsap; st: ScrollTrigger } | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const pinned = ready && isLg && !motion.reduced;

  // Load GSAP + ScrollTrigger one viewport ahead of the section, desktop + full motion only.
  // Approached from above only (see below); the observer stays on until then.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !isLg || motion.reduced || lib.current) return;
    const controller = new AbortController();
    const io = new IntersectionObserver(
      ([entry]) => {
        // Only switch while the section is still below the viewport (approached from
        // above). Switching after a jump past it (dock link, hash) would add the pin's
        // height above the reader and push what they jumped to off screen.
        if (!entry?.isIntersecting || entry.boundingClientRect.top <= 0) return;
        io.disconnect();
        afterLoad(
          Promise.all([loadGsap(), loadScrollTrigger()]),
          controller.signal,
          ([gsap, st]) => {
            lib.current = { gsap, st };
            setReady(true);
          },
        );
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => {
      controller.abort();
      io.disconnect();
    };
  }, [isLg, motion.reduced]);

  useLayoutEffect(() => {
    const pin = pinRef.current;
    if (!pinned || !pin || !lib.current) return;
    const { gsap, st } = lib.current;
    const ease = motion.ease;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(pin);
      const stage = q("[data-device-stage]")[0];
      const faces = chapters.map((c) => q(`[data-face=${c.id}]`)[0]);
      const units = q("[data-server-unit]");
      const texts = q("[data-chapter-text]");
      const orbits = chapters.map((_, i) => q(`[data-chapter-orbit="${i}"] [data-logo]`));
      const center = q("[data-orbit-center]")[0];

      // From the device's center, so logos pop out of it and tuck back in.
      const fromCenter = (axis: "x" | "y") => (_: number, el: Element) => {
        if (!center) return 0;
        const c = center.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return axis === "x"
          ? c.left + c.width / 2 - (r.left + r.width / 2)
          : c.top + c.height / 2 - (r.top + r.height / 2);
      };
      const tucked = { x: fromCenter("x"), y: fromCenter("y"), scale: 0.3, opacity: 0 };
      const out = { x: 0, y: 0, scale: 1, opacity: 1 };

      gsap.set(stage ?? [], ANGLES.mobile);
      // GSAP owns the faces here: drop the CSS opacity transition (used for the static
      // states), or each instant swap becomes a 450ms crossfade that ghosts mid-turn.
      gsap.set([...faces, ...units], { transition: "none" });
      gsap.set(faces, { opacity: 0 });
      gsap.set(faces[0] ?? [], { opacity: 1 });
      gsap.set(texts, { opacity: 0, y: 24 });
      gsap.set(texts[0] ?? [], { opacity: 1, y: 0 });
      for (const logos of orbits) gsap.set(logos, tucked);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          pin: true,
          start: "top top",
          end: () => `+=${window.innerHeight * 3}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: ({ progress }) => setActive(Math.min(2, Math.floor(progress * 3))),
        },
      });

      tl.fromTo(q("[data-progress-fill]"), { scaleY: 0 }, { scaleY: 1, duration: 3 }, 0);
      tl.to(orbits[0] ?? [], { ...out, duration: 0.12, stagger: 0.02, ease }, 0);

      chapters.slice(1).forEach((chapter, n) => {
        const from = n; // chapter index we leave
        const to = n + 1;
        const t = to; // the swap happens exactly at the chapter boundary
        const turn = to === 1 ? 70 : -70;

        tl.to(orbits[from] ?? [], { ...tucked, duration: 0.1, stagger: 0.015, ease }, t - 0.28)
          .to(texts[from] ?? [], { opacity: 0, y: -24, duration: 0.12 }, t - 0.26)
          // Turn the device edge-on, swap the form, settle at the new angle.
          .to(
            stage ?? [],
            { rotationY: turn, rotationX: 4, duration: 0.2, ease: "power1.in" },
            t - 0.2,
          )
          .to(faces[from] ?? [], { opacity: 0, duration: 0.02 }, t - 0.01)
          .to(faces[to] ?? [], { opacity: 1, duration: 0.02 }, t - 0.01)
          .to(stage ?? [], { ...ANGLES[chapter.id], duration: 0.2, ease: "power1.out" }, t);
        if (chapter.id === "backend") {
          tl.fromTo(
            units,
            { y: (i: number) => (i - 1) * 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.12, stagger: 0.03 },
            t,
          );
        }
        tl.fromTo(
          texts[to] ?? [],
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.12 },
          t + 0.08,
        ).to(orbits[to] ?? [], { ...out, duration: 0.12, stagger: 0.02, ease }, t + 0.2);
      });
      tl.to({}, { duration: 0.01 }, 2.99); // backend holds until the end
    }, pin);

    st.refresh();
    return () => {
      ctx.revert();
      setActive(0);
    };
  }, [pinned, chapters, motion.ease]);

  return (
    // The device sits on ink here: lighter body, faint shadow.
    <div
      ref={rootRef}
      className="[--device-body:var(--color-ink-3)] [--device-shadow:rgb(239_237_230/0.08)]"
    >
      {pinned ? (
        <div ref={pinRef} className="relative flex h-svh items-center">
          <a
            href={`#${skipTo}`}
            className="absolute top-8 left-0 font-mono text-label text-fog uppercase underline-offset-4 hover:text-paper hover:underline focus-visible:outline-paper"
          >
            Skip Layers ↓
          </a>
          <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_auto] items-center gap-10">
            {/* All chapters share one grid cell, so the panel is as tall as the longest. */}
            <div className="grid items-center">
              {chapters.map((c) => (
                <article key={c.id} data-chapter-text="" className="[grid-area:1/1]">
                  {c.text}
                </article>
              ))}
            </div>

            <div className="relative mx-auto w-[min(340px,26vw)]">
              <span data-orbit-center="" className="absolute inset-[30%]" />
              <Device state={chapters[active]?.id ?? "mobile"} threeD className="w-full" />
              {chapters.map((c, i) => (
                <div
                  key={c.id}
                  data-chapter-orbit={i}
                  className="pointer-events-none absolute -inset-[38%]"
                >
                  {c.orbitLogos}
                </div>
              ))}
            </div>

            <div className="flex items-stretch gap-4">
              <span
                aria-hidden="true"
                className="relative w-0.5 overflow-hidden rounded-pill bg-ink-3"
              >
                <span data-progress-fill="" className="absolute inset-0 origin-top bg-signal" />
              </span>
              <ol aria-label="Layers progress" className="flex flex-col gap-5 py-1">
                {chapters.map((c, i) => (
                  <li
                    key={c.id}
                    aria-current={active === i ? "step" : undefined}
                    className={cx(
                      "font-mono text-label uppercase transition-colors duration-(--duration-micro)",
                      active === i ? "text-paper" : "text-fog/60",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")} {c.title}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      ) : (
        <ol
          aria-label="Layers"
          // Scrollable below lg: focusable so keyboard users can scroll it.
          tabIndex={0}
          className={cx(
            "focus-visible:outline-paper",
            // Below lg: swipeable cards. lg+: three static steps. `relative` keeps
            // absolutely positioned descendants (sr-only labels) inside the scroller,
            // otherwise they widen the page and phones zoom out.
            "relative -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:-mx-14 md:px-14",
            "lg:mx-0 lg:grid lg:snap-none lg:gap-24 lg:overflow-visible lg:px-0 lg:pb-0",
          )}
        >
          {chapters.map((c) => (
            <li
              key={c.id}
              className={cx(
                "flex w-[85%] shrink-0 snap-center flex-col gap-8 rounded-card bg-ink-2 p-6 md:w-[60%]",
                "lg:grid lg:w-auto lg:grid-cols-2 lg:items-center lg:gap-16 lg:rounded-none lg:bg-transparent lg:p-0",
              )}
            >
              {c.text}
              <div className="flex flex-col items-center gap-8">
                <Device state={c.id} className="w-[75%] max-w-80 lg:w-[70%]" />
                {c.logos}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
