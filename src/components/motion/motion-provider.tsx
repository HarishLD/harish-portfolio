"use client";

import {
  createContext,
  type ReactNode,
  use,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { SIGNAL_EASE, gsap } from "./gsap";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Seconds, for GSAP. Mirrors --duration-* in globals.css. */
const FULL = { micro: 0.2, ui: 0.45, section: 0.8 } as const;
/** Reduced motion: every transition becomes a 150ms fade. */
const REDUCED = { micro: 0.15, ui: 0.15, section: 0.15 } as const;

export type Motion = {
  /** True when the user asked for reduced motion: no scrub, no parallax, no transforms. */
  reduced: boolean;
  duration: { micro: number; ui: number; section: number };
  ease: string;
};

const fullMotion: Motion = { reduced: false, duration: FULL, ease: SIGNAL_EASE };
const reducedMotion: Motion = { reduced: true, duration: REDUCED, ease: "none" };

const MotionContext = createContext<Motion>(fullMotion);

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
// The server can't know the preference. Markup is identical either way:
// content is always visible first and animation is layered on after hydration.
const getServerSnapshot = () => false;

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => (reduced ? reducedMotion : fullMotion), [reduced]);

  useEffect(() => {
    gsap.defaults({ ease: value.ease, duration: value.duration.ui });
  }, [value]);

  return <MotionContext value={value}>{children}</MotionContext>;
}

export function useMotion(): Motion {
  return use(MotionContext);
}
