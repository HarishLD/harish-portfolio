import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { experience } from "@/content";
import { HowSection } from "@/components/how";
import { PathSection } from ".";

describe("PathSection", () => {
  it("lists roles newest first and marks the L2 Technical Lead promotion", () => {
    render(<PathSection />);
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(experience.map((r) => r.title));
    expect(screen.getByText(/Promoted to L2 Technical Lead/)).toBeInTheDocument();
  });

  it("links each role's projects to their case studies", () => {
    render(<PathSection />);
    expect(screen.getByRole("link", { name: /Pet Care Platform/ })).toHaveAttribute(
      "href",
      "/work/pet-care-platform",
    );
  });
});

describe("HowSection", () => {
  it("shows the learning stack in exactly one 'Currently learning' line", () => {
    render(<HowSection />);
    expect(screen.getAllByText(/Currently learning/)).toHaveLength(1);
    expect(screen.getByText(/Spring Boot/)).toBeInTheDocument();
  });
});
