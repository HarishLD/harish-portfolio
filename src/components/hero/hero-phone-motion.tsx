"use client";

import { useEffect, useRef } from "react";
import { onIdle } from "@/components/motion";

/**
 * Enhancements for the hero phone, started after idle (never on the first
 * paint path): pause the CSS loop while the hero is off screen, and on
 * desktop with a fine pointer a cursor-reactive tilt (max 6deg). Reduced
 * motion: nothing (the CSS already shows a still frame).
 */
const MAX_TILT = 6;

export function HeroPhoneMotion() {
  const probe = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const link = probe.current?.closest<HTMLElement>("[data-hero-phone]");
    const hero = link?.closest<HTMLElement>("[data-hero]");
    const tilt = link?.querySelector<HTMLElement>("[data-hero-tilt]");
    if (!link || !hero || !tilt) return;
    let stop = () => {};

    const cancelIdle = onIdle(() => {
      const io = new IntersectionObserver(([entry]) => {
        hero.toggleAttribute("data-paused", !entry?.isIntersecting);
      });
      io.observe(hero);

      const canTilt = window.matchMedia(
        "(min-width: 80rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches;
      let frame = 0;
      const onMove = (e: PointerEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = link.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
          const dy = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
          const clamp = (v: number) => Math.max(-1, Math.min(1, v)) * MAX_TILT;
          tilt.style.setProperty("--tilt-y", `${clamp(dx)}deg`);
          tilt.style.setProperty("--tilt-x", `${clamp(-dy)}deg`);
        });
      };
      const reset = () => {
        tilt.style.removeProperty("--tilt-x");
        tilt.style.removeProperty("--tilt-y");
      };
      if (canTilt) {
        hero.addEventListener("pointermove", onMove);
        hero.addEventListener("pointerleave", reset);
      }
      stop = () => {
        io.disconnect();
        cancelAnimationFrame(frame);
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", reset);
        hero.removeAttribute("data-paused");
        reset();
      };
    });

    return () => {
      cancelIdle();
      stop();
    };
  }, []);

  return <span ref={probe} hidden />;
}
