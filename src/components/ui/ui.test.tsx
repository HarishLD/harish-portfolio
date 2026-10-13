import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ButtonLink, SignalDot } from ".";

describe("ButtonLink", () => {
  it("opens external links in a new tab safely", () => {
    render(<ButtonLink href="https://github.com/HarishLD">GitHub</ButtonLink>);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps internal and mailto links in the same tab", () => {
    render(
      <>
        <ButtonLink href="/#work">Work</ButtonLink>
        <ButtonLink href="mailto:a@b.co">Email</ButtonLink>
      </>,
    );
    expect(screen.getByRole("link", { name: "Work" })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:a@b.co");
  });
});

describe("SignalDot", () => {
  it("is decorative and gets an ink ring on paper only", () => {
    const { container } = render(
      <>
        <SignalDot />
        <SignalDot tone="ink" />
      </>,
    );
    const [onPaper, onInk] = container.querySelectorAll("[data-signal-dot]");
    expect(onPaper).toHaveAttribute("aria-hidden", "true");
    expect(onPaper?.className).toContain("ring-ink");
    expect(onInk?.className).not.toContain("ring-ink");
  });
});
