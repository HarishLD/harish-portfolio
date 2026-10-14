import { vi } from "vitest";
import type { Flip, Gsap, ScrollTrigger } from "@/components/motion/gsap";

/**
 * Test double for the lazy GSAP loaders (wired up in vitest.setup.ts).
 * Unit tests never import real GSAP, so no dynamic import can outlive the
 * jsdom environment. Assert animation behaviour against these spies.
 */
function tween() {
  const t = {
    progress: vi.fn(() => t),
    kill: vi.fn(),
    to: vi.fn(() => t),
    fromTo: vi.fn(() => t),
    set: vi.fn(() => t),
  };
  return t;
}

export const gsapMock = {
  registerPlugin: vi.fn(),
  context: vi.fn((setup: () => void) => {
    setup();
    return { revert: vi.fn() };
  }),
  to: vi.fn(() => tween()),
  fromTo: vi.fn(() => tween()),
  set: vi.fn(() => tween()),
  timeline: vi.fn(() => tween()),
  utils: {
    selector: (root: Element) => (selector: string) => [...root.querySelectorAll(selector)],
  },
};

export const flipMock = {
  getState: vi.fn(() => ({})),
  from: vi.fn(() => tween()),
};

export const scrollTriggerMock = {
  create: vi.fn(),
};

export const loaderMocks = {
  loadGsap: vi.fn(() => Promise.resolve(gsapMock as unknown as Gsap)),
  loadFlip: vi.fn(() => Promise.resolve(flipMock as unknown as Flip)),
  loadScrollTrigger: vi.fn(() => Promise.resolve(scrollTriggerMock as unknown as ScrollTrigger)),
};
