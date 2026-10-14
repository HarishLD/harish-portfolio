"use client";

import { useEffect } from "react";
import { afterLoad, loadGsap, loadScrollTrigger, onIdle, useMotion } from "@/components/motion";

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
    const controller = new AbortController();
    let revert: (() => void) | undefined;

    const cancelIdle = onIdle(() =>
      afterLoad(
        Promise.all([loadGsap(), loadScrollTrigger()]),
        controller.signal,
        ([gsap, ScrollTrigger]) => {
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
        },
      ),
    );

    return () => {
      controller.abort();
      cancelIdle();
      revert?.();
    };
  }, [motion]);

  return null;
}
