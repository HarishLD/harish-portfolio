import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { projects } from "@/content";
import { matches } from "./layers";
import { WorkSection } from ".";

describe("layer filter", () => {
  it("matches all, or projects that include the layer", () => {
    expect(matches(["web"], "all")).toBe(true);
    expect(matches(["mobile", "web"], "web")).toBe(true);
    expect(matches(["web"], "backend")).toBe(false);
  });
});

describe("WorkSection", () => {
  it("renders every project as a link to its case study, in featured order", () => {
    render(<WorkSection />);
    const links = screen.getAllByRole("link", { name: /case study/i });
    expect(links.map((l) => l.getAttribute("href"))).toEqual(
      projects.map((p) => `/work/${p.slug}`),
    );
  });

  it("shows platform reach on its own line for the flagship", () => {
    render(<WorkSection />);
    expect(
      screen.getByText("Platform: 100K+ downloads · 5K DAU · 250+ locations"),
    ).toBeInTheDocument();
  });

  it("filters by layer and announces the result", async () => {
    const user = userEvent.setup();
    const { container } = render(<WorkSection />);
    const group = screen.getByRole("group", { name: "Filter projects by layer" });
    await user.click(within(group).getByRole("button", { name: /^Backend/ }));

    expect(within(group).getByRole("button", { name: /^Backend/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const visible = [...container.querySelectorAll("li[data-flip-id]")].filter(
      (li) => !li.hasAttribute("hidden"),
    );
    expect(visible.map((li) => li.getAttribute("data-flip-id"))).toEqual(
      projects.filter((p) => p.layers.includes("backend")).map((p) => p.slug),
    );
    expect(screen.getByText(/Showing 2 projects with Backend/)).toBeInTheDocument();
  });
});
