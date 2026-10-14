import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MotionProvider, useMotion } from ".";

function Probe() {
  const m = useMotion();
  return <p>{`${m.reduced} ${m.duration.ui}`}</p>;
}

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

describe("MotionProvider", () => {
  afterEach(() => vi.restoreAllMocks());

  it("uses full motion by default", () => {
    mockReducedMotion(false);
    render(
      <MotionProvider>
        <Probe />
      </MotionProvider>,
    );
    expect(screen.getByText("false 0.45")).toBeInTheDocument();
  });

  it("switches every duration to a 150ms fade under reduced motion", () => {
    mockReducedMotion(true);
    render(
      <MotionProvider>
        <Probe />
      </MotionProvider>,
    );
    expect(screen.getByText("true 0.15")).toBeInTheDocument();
  });
});
