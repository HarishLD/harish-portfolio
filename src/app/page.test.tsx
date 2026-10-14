import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
      screen.getByText(
        "100K+ downloads · 5K daily active users · 250+ franchise locations · <0.1% crash rate after launch",
      ),
    ).toBeInTheDocument();
  });

  it("hides the resume CTA until a phone-free PDF exists", () => {
    render(<Home />);
    expect(screen.queryByRole("link", { name: /download resume/i })).toBeNull();
  });
});
