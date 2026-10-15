import { afterEach, describe, expect, it, vi } from "vitest";
import { projects } from "@/content";
import { personJsonLd, serializeJsonLd } from "./json-ld";

async function freshRobots() {
  vi.resetModules();
  return (await import("@/app/robots")).default();
}

describe("robots", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("disallows crawling outside production", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(await freshRobots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("allows crawling and points to the sitemap in production", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.dev");
    const robots = await freshRobots();
    expect(robots.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(robots.sitemap).toBe("https://example.dev/sitemap.xml");
  });
});

describe("sitemap", () => {
  it("lists the home page and every case study", async () => {
    const urls = (await import("@/app/sitemap")).default().map((e) => new URL(e.url).pathname);
    expect(urls).toEqual(["/", ...projects.map((p) => `/work/${p.slug}`)]);
  });
});

describe("Person JSON-LD", () => {
  it("describes a Software Engineer with public profiles and no phone or location", () => {
    const data = personJsonLd();
    expect(data["@type"]).toBe("Person");
    expect(data.jobTitle).toBe("Software Engineer");
    expect(data.sameAs).toContain("https://github.com/HarishLD");
    const json = JSON.stringify(data);
    expect(json).not.toMatch(/telephone|address|\+?\d[\d\s-]{8,}\d/);
  });

  it("escapes < so the payload can't close the script tag", () => {
    expect(serializeJsonLd({ a: "</script>" })).not.toContain("</script>");
  });
});
