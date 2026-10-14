"use client";

import { useEffect } from "react";
import { loadGsap, loadScrollTrigger, onIdle, useMotion } from "@/components/motion";

/**
 * Draws each signal segment once, when its section arrives: the line grows
 * from the top and the dot lights up. Not scroll-scrubbed (only the hero
 * morph and Layers are). Segments already on screen when GSAP loads stay
 * drawn, so nothing visible ever disappears. Reduced motion: static thread.
 */
export function SignalThread() {
  const motion = useMotion();

  useEffect(() => {
    if (motion.reduced) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    const cancelIdle = onIdle(async () => {
      const [gsap, ScrollTrigger] = await Promise.all([loadGsap(), loadScrollTrigger()]);
      if (cancelled) return;
      const ctx = gsap.context(() => {
        for (const line of document.querySelectorAll<HTMLElement>("[data-signal-line]")) {
          if (line.getBoundingClientRect().top < window.innerHeight) continue;
          const stroke = line.querySelector("[data-signal-stroke]");
          const head = line.querySelector("[data-signal-head]");
          gsap.set(stroke, { scaleY: 0 });
          gsap.set(head, { scale: 0 });
          ScrollTrigger.create({
            trigger: line,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap
                .timeline({ defaults: { ease: motion.ease } })
                .to(head, { scale: 1, duration: motion.duration.micro })
                .to(stroke, { scaleY: 1, duration: motion.duration.section }, "<");
            },
          });
        }
      });
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      cancelIdle();
      revert?.();
    };
  }, [motion]);

  return null;
}
