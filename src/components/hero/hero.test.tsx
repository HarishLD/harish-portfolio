import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("starts the device as a phone, with layers as passive labels in full motion", () => {
    mockReducedMotion(false);
    const { container } = renderHero();
    expect(stage(container)).toHaveAttribute("data-state", "mobile");
    expect(screen.queryByRole("button", { name: "Backend" })).toBeNull();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("turns the morph into three tappable states under reduced motion", async () => {
    mockReducedMotion(true);
    const user = userEvent.setup();
    const { container } = renderHero();
    const group = screen.getByRole("group", { name: "Device layer" });
    expect(within(group).getAllByRole("button")).toHaveLength(3);

    await user.click(within(group).getByRole("button", { name: "Backend" }));
    expect(stage(container)).toHaveAttribute("data-state", "backend");
    expect(within(group).getByRole("button", { name: "Backend" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
