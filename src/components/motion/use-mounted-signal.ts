"use client";

import { useEffect, useRef } from "react";

/**
 * An AbortSignal that aborts when the component unmounts (or Activity hides
 * it). For loaders started from event handlers, e.g. preloading GSAP on hover:
 * `afterLoad(loadGsap(), signal.current, ...)`.
 */
export function useMountedSignal() {
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    const c = new AbortController();
    controller.current = c;
    return () => c.abort();
  }, []);
  return controller;
}
