import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home (M0 placeholder)", () => {
  it("renders the name as the only h1", () => {
    render(<Home />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Harish");
  });

  it("states the role", () => {
    render(<Home />);
    expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
  });
});
