import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "@/components/motion";
import { profile } from "@/content";
import { Hero } from ".";

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches: query.includes("reduce") ? matches : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

function renderHero() {
  return render(
    <MotionProvider>
      <Hero profile={profile} />
    </MotionProvider>,
  );
}

const stage = (container: HTMLElement) => container.querySelector("[data-device-stage]");

describe("Hero", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders name, role, tagline and the primary CTA as plain content", () => {
    mockReducedMotion(false);
    renderHero();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Harish");
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("builds across every layer.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See the work" })).toHaveAttribute("href", "/#work");
  });

  it("hides the resume CTA until the PDF exists", () => {
    mockReducedMotion(false);
    renderHero();
    expect(screen.queryByRole("link", { name: /resume/i })).toBeNull();
  });

  it("starts the device as a phone", () => {
    mockReducedMotion(false);
    const { container } = renderHero();
    expect(stage(container)).toHaveAttribute("data-state", "mobile");
  });

  it("shows a static phone: no chips, no layer buttons", () => {
    mockReducedMotion(true);
    const { container } = renderHero();
    expect(stage(container)).toHaveAttribute("data-state", "mobile");
    expect(screen.queryByRole("group", { name: "Device layer" })).toBeNull();
    expect(screen.queryByText("Backend")).toBeNull();
  });
});
