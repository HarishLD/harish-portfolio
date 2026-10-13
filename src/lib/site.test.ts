import { afterEach, describe, expect, it, vi } from "vitest";

async function loadSite() {
  vi.resetModules();
  return (await import("./site")).site;
}

describe("site.url", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers NEXT_PUBLIC_SITE_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.dev");
    vi.stubEnv("VERCEL_URL", "preview.vercel.app");
    expect((await loadSite()).url.href).toBe("https://example.dev/");
  });

  it("falls back to the Vercel deployment URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.stubEnv("VERCEL_URL", "preview.vercel.app");
    expect((await loadSite()).url.href).toBe("https://preview.vercel.app/");
  });

  it("falls back to localhost", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.stubEnv("VERCEL_URL", "");
    expect((await loadSite()).url.href).toBe("http://localhost:3000/");
  });
});
