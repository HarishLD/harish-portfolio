import type { gsap as GsapCore } from "gsap";
import type { Flip as FlipPlugin } from "gsap/Flip";
import type { ScrollTrigger as ScrollTriggerPlugin } from "gsap/ScrollTrigger";

/**
 * The single GSAP entry point. GSAP is never in the initial bundle: every
 * island loads it on demand through these loaders (idle, visible or on
 * interaction), so content renders and becomes interactive without it.
 * Each loader is memoized, so plugins and the "signal" ease register once.
 */

export type Gsap = typeof GsapCore;
export type Flip = typeof FlipPlugin;
export type ScrollTrigger = typeof ScrollTriggerPlugin;
export type GsapContext = ReturnType<Gsap["context"]>;

/** cubic-bezier(.2,.8,.2,1): the entrance ease from the design spec. */
export const SIGNAL_EASE = "signal";

let core: Promise<Gsap> | undefined;
let flip: Promise<Flip> | undefined;
let scrollTrigger: Promise<ScrollTrigger> | undefined;

export function loadGsap(): Promise<Gsap> {
  core ??= Promise.all([import("gsap"), import("gsap/CustomEase")]).then(
    ([{ gsap }, { CustomEase }]) => {
      gsap.registerPlugin(CustomEase);
      CustomEase.create(SIGNAL_EASE, "0.2,0.8,0.2,1");
      return gsap;
    },
  );
  return core;
}

export function loadFlip(): Promise<Flip> {
  flip ??= Promise.all([loadGsap(), import("gsap/Flip")]).then(([gsap, { Flip }]) => {
    gsap.registerPlugin(Flip);
    return Flip;
  });
  return flip;
}

export function loadScrollTrigger(): Promise<ScrollTrigger> {
  scrollTrigger ??= Promise.all([loadGsap(), import("gsap/ScrollTrigger")]).then(
    ([gsap, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      return ScrollTrigger;
    },
  );
  return scrollTrigger;
}

/**
 * Resolves once every loader that has already started has finished, without
 * starting new ones. Tests await it so lazy imports never outlive the test
 * environment.
 */
export function settleLoaders(): Promise<unknown> {
  return Promise.allSettled([core, flip, scrollTrigger].filter(Boolean));
}

/** Runs `fn` when the main thread is idle (after hydration and LCP work). */
export function onIdle(fn: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fn, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
}
