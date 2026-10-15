import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Unit tests never load real GSAP: the lazy loaders resolve to spies instead
// (see src/test/gsap-mock.ts). Everything else in the module stays real.
vi.mock("@/components/motion/gsap", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/components/motion/gsap")>()),
  ...(await import("@/test/gsap-mock")).loaderMocks,
}));

// Guard: importing real GSAP from a unit test is a bug, so it fails loudly
// instead of resolving after the environment has been torn down.
// (vi.mock must be called at the top level to be hoisted, hence one call per module.)
const realGsap = (id: string) => () => {
  throw new Error(`Unit tests must not import real "${id}"; use src/test/gsap-mock.ts`);
};
vi.mock("gsap", () => realGsap("gsap")());
vi.mock("gsap/CustomEase", () => realGsap("gsap/CustomEase")());
vi.mock("gsap/Flip", () => realGsap("gsap/Flip")());
vi.mock("gsap/ScrollTrigger", () => realGsap("gsap/ScrollTrigger")());

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// jsdom gaps: browser APIs the nav, motion provider and contact rely on.
if (typeof window !== "undefined") {
  if (!navigator.clipboard) {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.resolve() },
      configurable: true,
    });
  }
  window.matchMedia ??= vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  window.IntersectionObserver ??= class {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;

  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}
