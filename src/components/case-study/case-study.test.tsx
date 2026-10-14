import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getProject } from "@/content";
import { CaseStudy } from ".";

const pet = getProject("pet-care-platform")!;
const notes = getProject("notes-app")!;

describe("CaseStudy", () => {
  it("owns the h1 on the full page and uses an h2 inside the overlay", () => {
    const { unmount } = render(<CaseStudy project={pet} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Pet Care Platform");
    unmount();
    render(<CaseStudy project={pet} inOverlay titleId="t" />);
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Pet Care Platform" })).toHaveAttribute(
      "id",
      "t",
    );
  });

  it("separates platform reach from my own work", () => {
    render(<CaseStudy project={pet} />);
    const results = screen.getByRole("region", { name: "Results" });
    expect(within(results).getByRole("heading", { name: "Platform" })).toBeInTheDocument();
    expect(within(results).getByRole("heading", { name: "My work" })).toBeInTheDocument();
  });

  it("labels every recreated screen", () => {
    render(<CaseStudy project={pet} />);
    const figures = screen.getAllByRole("figure");
    expect(figures.length).toBeGreaterThan(0);
    for (const f of figures) expect(f).toHaveTextContent(/Recreated UI · sample data/);
  });

  it("links out only for the personal project, in a new tab", () => {
    render(<CaseStudy project={pet} />);
    expect(screen.queryByRole("link", { name: /live app|source/i })).toBeNull();
    render(<CaseStudy project={notes} />);
    const live = screen.getByRole("link", { name: /open the live app/i });
    expect(live).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /source on github/i })).toHaveAttribute(
      "href",
      "https://github.com/HarishLD/notes_app",
    );
  });
});
