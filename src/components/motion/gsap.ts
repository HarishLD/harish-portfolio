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

// A failed chunk load (offline, deploy in between) clears the memo so a later
// trigger can retry instead of caching the rejection forever.
function retryable<T>(load: () => Promise<T>, clear: () => void): Promise<T> {
  return load().catch((error: unknown) => {
    clear();
    throw error;
  });
}

export function loadGsap(): Promise<Gsap> {
  core ??= retryable(
    () =>
      Promise.all([import("gsap"), import("gsap/CustomEase")]).then(
        ([{ gsap }, { CustomEase }]) => {
          gsap.registerPlugin(CustomEase);
          CustomEase.create(SIGNAL_EASE, "0.2,0.8,0.2,1");
          return gsap;
        },
      ),
    () => (core = undefined),
  );
  return core;
}

export function loadFlip(): Promise<Flip> {
  flip ??= retryable(
    () =>
      Promise.all([loadGsap(), import("gsap/Flip")]).then(([gsap, { Flip }]) => {
        gsap.registerPlugin(Flip);
        return Flip;
      }),
    () => (flip = undefined),
  );
  return flip;
}

export function loadScrollTrigger(): Promise<ScrollTrigger> {
  scrollTrigger ??= retryable(
    () =>
      Promise.all([loadGsap(), import("gsap/ScrollTrigger")]).then(([gsap, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        return ScrollTrigger;
      }),
    () => (scrollTrigger = undefined),
  );
  return scrollTrigger;
}

/**
 * The one way to consume a loader: runs `use` with the loaded value only if
 * `signal` has not been aborted by then (the component unmounted, the effect
 * re-ran, or Activity hid it). A failed load is swallowed: animation is an
 * enhancement, content never depends on it.
 */
export function afterLoad<T>(load: Promise<T>, signal: AbortSignal, use: (value: T) => void) {
  load.then(
    (value) => {
      if (!signal.aborted) use(value);
    },
    () => {},
  );
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
