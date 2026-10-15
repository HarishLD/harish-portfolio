import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { layerChapters } from "@/content";
import { LayersSection } from ".";

describe("LayersSection (static steps: server HTML, no JS, reduced motion, phones)", () => {
  it("renders Mobile, Web, Backend in order with a resume-backed proof point each", () => {
    render(<LayersSection />);
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(["Mobile", "Web", "Backend"]);
    for (const c of layerChapters) expect(screen.getByText(c.proof.value)).toBeInTheDocument();
  });

  it("lists at most five logos per chapter, the layer's own mark first and highlighted", () => {
    render(<LayersSection />);
    for (const c of layerChapters) {
      const list = screen.getByRole("list", { name: `${c.title} stack` });
      const items = within(list).getAllByRole("listitem");
      expect(items.length).toBeLessThanOrEqual(5);
      expect(items[0]).toHaveTextContent(c.logos[0]!.name);
      expect(items[0]!.querySelector(".text-signal")).not.toBeNull();
      expect(list.querySelectorAll(".text-signal")).toHaveLength(1);
    }
  });

  it("uses text labels, not invented marks, where simple-icons has none", () => {
    render(<LayersSection />);
    const backend = screen.getByRole("list", { name: "Backend stack" });
    for (const name of ["Salesforce", "WebSockets"]) {
      const item = within(backend).getByText(name, { selector: ".sr-only" }).closest("li")!;
      expect(item.querySelector("svg")).toBeNull();
    }
  });

  it("starts as static steps; the pinned layout only appears once GSAP is ready on desktop", () => {
    const { container } = render(<LayersSection />);
    expect(screen.getByRole("list", { name: "Layers" })).toBeInTheDocument();
    expect(container.querySelector("[data-progress-fill]")).toBeNull();
  });
});
