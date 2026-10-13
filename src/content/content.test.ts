import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { experience, nav, profile, projects, skills } from ".";
import { projectSchema } from "./schema";

const resumeFacts = readFileSync("docs/resume-facts.md", "utf8");
const allContent = JSON.stringify({ profile, projects, experience, skills, nav });

describe("content", () => {
  it("keeps the featured project order from the brief", () => {
    expect(projects.map((p) => p.name)).toEqual([
      "Pet Care Platform",
      "Healthcare Records Platform",
      "Enterprise Product Naming Platform",
      "Full Stack Notes App",
      "Dynamic Form + PDF Platform",
    ]);
  });

  it("never contains a phone number", () => {
    expect(allContent).not.toMatch(/\+?\d[\d\s-]{8,}\d/);
  });

  it("positions Harish as a software engineer, location-neutral", () => {
    expect(profile.role).toBe("Software Engineer");
    expect(allContent).not.toMatch(/mobile developer|AI engineer|Chennai|India/i);
  });

  it("keeps the learning stack out of everything except currentlyLearning", () => {
    const { currentlyLearning, ...rest } = profile;
    const elsewhere = JSON.stringify({ rest, projects, skills, experience });
    for (const tech of currentlyLearning) {
      expect(elsewhere, tech).not.toMatch(new RegExp(`\\b${tech}\\b`));
    }
  });

  it("puts platform reach for the flagship on platform scope", () => {
    const flagship = projects[0]!;
    const platform = flagship.metrics.filter((m) => m.scope === "platform").map((m) => m.value);
    expect(platform).toEqual(expect.arrayContaining(["100K+", "5K", "250+"]));
  });

  it("only uses metric values that appear in the resume facts", () => {
    for (const m of projects.flatMap((p) => p.metrics)) {
      const core = m.value.replace(/^[~<]/, "").split(" → ")[0]!;
      expect(resumeFacts, m.value).toContain(core);
    }
  });

  it("rejects a client project with real screens or live links", () => {
    const client = { ...projects[0]!, screens: "real" };
    expect(projectSchema.safeParse(client).success).toBe(false);
    const linked = { ...projects[0]!, links: { live: "https://example.com" } };
    expect(projectSchema.safeParse(linked).success).toBe(false);
  });

  it("only lets the personal project link out", () => {
    const linked = projects.filter((p) => p.links);
    expect(linked.map((p) => p.slug)).toEqual(["notes-app"]);
  });
});
