import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MotionProvider } from "@/components/motion";
import { SiteNav } from ".";

function renderNav() {
  return render(
    <MotionProvider>
      <SiteNav />
    </MotionProvider>,
  );
}

describe("SiteNav", () => {
  it("links every section and the contact CTA from the desktop bar", () => {
    renderNav();
    const bar = screen.getByRole("navigation", { name: "Primary" });
    for (const name of ["Work", "Layers", "Path", "How I work"]) {
      expect(within(bar).getByRole("link", { name })).toHaveAttribute(
        "href",
        expect.stringMatching(/^\/#/),
      );
    }
    expect(within(bar).getByRole("link", { name: /let.s talk/i })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });

  it("opens the full-screen menu as a modal dialog", async () => {
    const user = userEvent.setup();
    renderNav();
    const button = screen.getByRole("button", { name: "Menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(within(dialog).getByRole("link", { name: "Path" })).toBeInTheDocument();
  });

  it("has no phone link anywhere", () => {
    const { container } = renderNav();
    expect(container.querySelector('a[href^="tel:"]')).toBeNull();
  });
});
