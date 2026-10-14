"use client";

import { useRef, useState } from "react";
import type { Layer } from "@/content";
import { loadScrollTrigger, useLazyGsap, useMotion } from "@/components/motion";
import { cx } from "@/lib/cx";
import { Device } from "./device";

const LAYERS: { id: Layer; label: string }[] = [
  { id: "mobile", label: "Mobile" },
  { id: "web", label: "Web" },
  { id: "backend", label: "Backend" },
];

/**
 * Hero device island. Renders the phone immediately (static HTML, no JS needed).
 * Full motion: on idle, loads GSAP + ScrollTrigger and scrubs phone → browser →
 * server over the first stretch of scroll, finishing while the device is still
 * fully in view (not pinned). Reduced motion: no scrub, no drift;
 * the three states become buttons with a 150ms fade.
 */
export function HeroMorph({ className }: { className?: string }) {
  const motion = useMotion();
  const scope = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<Layer>("mobile");

  useLazyGsap(
    scope,
    (gsap) => {
      const root = scope.current;
      const hero = root?.closest<HTMLElement>("[data-hero]");
      if (motion.reduced || !root || !hero) return;
      setState("mobile");

      const q = gsap.utils.selector(root);
      const phone = q("[data-face=mobile]");
      const web = q("[data-face=web]");
      const server = q("[data-face=backend]");
      const units = q("[data-server-unit]");
      gsap.set([...phone, ...web, ...server], { opacity: 0 });
      gsap.set(phone, { opacity: 1 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            // Finishes while the device is still fully on screen (no pinning).
            end: "bottom 60%",
            scrub: 0.6,
            onUpdate: ({ progress }) =>
              setState(progress < 0.3 ? "mobile" : progress < 0.68 ? "web" : "backend"),
          },
        })
        // Phone turns landscape and hands over to the browser.
        .to(phone, { rotateZ: -90, scale: 1.1, duration: 0.36 }, 0)
        .to(phone, { opacity: 0, duration: 0.08 }, 0.28)
        .fromTo(web, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.14 }, 0.3)
        // Browser folds down into stacked server units.
        .to(web, { scaleY: 0.3, duration: 0.12 }, 0.6)
        .to(web, { opacity: 0, duration: 0.06 }, 0.68)
        .set(server, { opacity: 1 }, 0.68)
        .fromTo(
          units,
          { opacity: 0, y: (i: number) => (i - 1) * 60, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.2, stagger: 0.04 },
          0.68,
        );
    },
    { load: "idle", plugins: [loadScrollTrigger], deps: [motion.reduced] },
  );

  return (
    <div ref={scope} className={cx("flex flex-col items-center gap-5", className)}>
      <Device state={state} className="w-full" />
      {motion.reduced ? (
        <div role="group" aria-label="Device layer" className={rowClass}>
          {LAYERS.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={state === l.id}
              onClick={() => setState(l.id)}
              className={labelClass(state === l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
      ) : (
        <p className={rowClass}>
          {LAYERS.map((l) => (
            <span key={l.id} className={labelClass(state === l.id)}>
              {l.label}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

// Paper pill keeps the labels legible where they overlap the avatar.
const rowClass = "flex rounded-pill bg-paper p-1";

function labelClass(active: boolean) {
  return cx(
    "inline-flex h-9 items-center rounded-pill px-2.5 font-mono text-label uppercase md:text-[0.8125rem]",
    "transition-colors duration-(--duration-micro)",
    active ? "bg-ink text-paper" : "text-muted",
  );
}
