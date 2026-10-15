import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getResumeHref } from "@/lib/resume";
import Home from "./page";

describe("Home", () => {
  it("renders the name as the only h1", () => {
    render(<Home />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Harish");
  });

  it("states the role", () => {
    render(<Home />);
    expect(screen.getAllByText("Software Engineer")[0]).toBeInTheDocument();
  });
});

describe("Home metrics", () => {
  it("shows platform reach on its own line", () => {
    render(<Home />);
    expect(
      screen.getByText("Platform: 100K+ downloads · 5K DAU · 250+ locations"),
    ).toBeInTheDocument();
  });

  it("shows the hero resume CTA exactly when the PDF exists", () => {
    render(<Home />);
    const cta = screen.queryByRole("link", { name: /download resume/i });
    if (getResumeHref()) expect(cta).toHaveAttribute("href", "/resume.pdf");
    else expect(cta).toBeNull();
  });
});
