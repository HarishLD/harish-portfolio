import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SignalLine } from ".";

describe("SignalLine", () => {
  it("is decorative", () => {
    const { container } = render(<SignalLine tone="paper" />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("is lime on ink and an ink line with a ringed dot on paper", () => {
    const { container: ink } = render(<SignalLine tone="ink" />);
    expect(ink.querySelector("[data-signal-stroke]")?.className).toContain("bg-signal");
    expect(ink.querySelector("[data-signal-head]")?.className).not.toContain("ring-ink");

    const { container: paper } = render(<SignalLine tone="paper" />);
    expect(paper.querySelector("[data-signal-stroke]")?.className).toContain("bg-ink");
    expect(paper.querySelector("[data-signal-head]")?.className).toContain("ring-ink");
  });

  it("ends the thread at its dot in the contact section", () => {
    const { container } = render(<SignalLine tone="ink" variant="end" />);
    expect(container.firstElementChild).toHaveAttribute("data-signal-line", "end");
    expect(container.querySelector("[data-signal-head]")?.className).toContain("bottom-0");
  });
});
