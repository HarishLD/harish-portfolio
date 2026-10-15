import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "@/components/motion";
import { profile } from "@/content";
import { getResumeHref } from "@/lib/resume";
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

  it("shows the resume CTA exactly when the PDF exists", () => {
    mockReducedMotion(false);
    renderHero();
    const cta = screen.queryByRole("link", { name: /resume/i });
    if (getResumeHref()) expect(cta).toHaveAttribute("download");
    else expect(cta).toBeNull();
  });

  it("makes the phone a labelled link to the Pet Care case study", () => {
    mockReducedMotion(false);
    const { container } = renderHero();
    const link = screen.getByRole("link", {
      name: "Pet Care Platform booking demo (recreated UI), open case study",
    });
    expect(link).toHaveAttribute("href", "/work/pet-care-platform");
    expect(container.querySelector(".booking-demo [data-demo-tick]")).not.toBeNull();
    expect(screen.queryByRole("group", { name: "Device layer" })).toBeNull();
  });
});
