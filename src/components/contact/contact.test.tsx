import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { profile } from "@/content";
import { getResumeHref } from "@/lib/resume";
import { ContactSection } from ".";

describe("ContactSection", () => {
  it("ends the signal thread in a mailto CTA", () => {
    const { container } = render(<ContactSection />);
    expect(screen.getByRole("link", { name: /^email me/i })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
    expect(container.querySelector('[data-signal-line="contact"]')).not.toBeNull();
  });

  it("copies the email address and announces it", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<ContactSection />);
    await user.click(screen.getByRole("button", { name: /copy email address/i }));
    expect(writeText).toHaveBeenCalledWith(profile.email);
    expect(screen.getByRole("status")).toHaveTextContent("Email address copied");
  });

  it("links LinkedIn and GitHub in a new tab, and never a phone number", () => {
    const { container } = render(<ContactSection />);
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /^GitHub\s*github\.com/i })).toHaveAttribute(
      "href",
      profile.links.github,
    );
    expect(container.querySelector('a[href^="tel:"]')).toBeNull();
  });

  it("has a footer with the copyright line and a link to the source", () => {
    render(<ContactSection />);
    expect(screen.getByText("© 2026 Harish Doraiswamy")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /source on github/i })).toHaveAttribute(
      "href",
      "https://github.com/HarishLD/harish-portfolio",
    );
  });

  it("hides the resume download until public/resume.pdf exists", () => {
    expect(getResumeHref()).toBeUndefined();
    render(<ContactSection />);
    expect(screen.queryByRole("link", { name: /resume/i })).toBeNull();
  });
});
