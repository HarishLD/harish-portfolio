"use client";

import { type RefObject, useEffect, useRef } from "react";
import { type Gsap, type GsapContext, loadGsap, onIdle } from "./gsap";

type Options = {
  /**
   * "visible": load when the scope comes within 200px of the viewport (below-the-fold sections).
   * "idle": load once the main thread is idle (above-the-fold enhancements such as the hero).
   */
  load?: "visible" | "idle";
  /** Extra async setup to await before `setup` runs, e.g. loadScrollTrigger. */
  plugins?: Array<() => Promise<unknown>>;
  /** Re-run setup (reverting the previous run) when these change. */
  deps?: unknown[];
};

/**
 * Loads GSAP on demand and runs `setup` inside a gsap.context scoped to `scope`,
 * reverting every tween and ScrollTrigger on unmount or when deps change.
 * Content must already be visible without this: animation is only layered on.
 */
export function useLazyGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (gsap: Gsap) => void,
  { load = "visible", plugins = [], deps = [] }: Options = {},
) {
  const setupRef = useRef(setup);
  const pluginsRef = useRef(plugins);
  useEffect(() => {
    setupRef.current = setup;
    pluginsRef.current = plugins;
  });

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    let cancelled = false;
    let ctx: GsapContext | undefined;

    const start = () => {
      void Promise.all([loadGsap(), ...pluginsRef.current.map((p) => p())]).then(([gsap]) => {
        if (cancelled) return;
        ctx = gsap.context(() => setupRef.current(gsap), el);
      });
    };

    let stop: () => void;
    if (load === "idle") {
      stop = onIdle(start);
    } else {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          io.disconnect();
          start();
        },
        { rootMargin: "200px 0px" },
      );
      io.observe(el);
      stop = () => io.disconnect();
    }

    return () => {
      cancelled = true;
      stop();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller-controlled deps
  }, [scope, load, ...deps]);
}
