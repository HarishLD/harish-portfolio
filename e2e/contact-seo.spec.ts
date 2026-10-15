import { expect, test } from "@playwright/test";

test.describe("contact", () => {
  test("the signal line lands in the Email me CTA (desktop)", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 768, "the gutter line shows from md");
    await page.goto("/#contact");
    const cta = page.locator("#contact").getByRole("link", { name: /^email me/i });
    await expect(cta).toHaveAttribute("href", /^mailto:/);
    const [line, button] = await Promise.all([
      page.locator("#contact [data-signal-head]").boundingBox(),
      cta.boundingBox(),
    ]);
    // The horizontal segment ends at the button's left edge, at its vertical centre.
    expect(Math.abs(line!.x + line!.width - button!.x)).toBeLessThan(3);
    expect(Math.abs(line!.y - (button!.y + button!.height / 2))).toBeLessThan(3);
  });

  test("copies the email address", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only here");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/#contact");
    await page.getByRole("button", { name: /copy email address/i }).click();
    await expect(page.getByRole("status").filter({ hasText: "copied" })).toHaveCount(1);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "harishdoraiswamy1411@gmail.com",
    );
  });

  test("the floating dock steps aside while Contact is in view", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 1024, "the dock is desktop only");
    await page.goto("/");
    await page.mouse.wheel(0, 900);
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toHaveAttribute("data-docked", "true");
    await page.evaluate(() => document.getElementById("contact")!.scrollIntoView());
    await expect(nav).toHaveAttribute("data-dock-hidden", "true");
    await expect(nav).toHaveCSS("opacity", "0");
    await page.evaluate(() => document.getElementById("work")!.scrollIntoView());
    await expect(nav).toHaveAttribute("data-dock-hidden", "false");
  });

  test("no resume button until the PDF exists", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /resume/i })).toHaveCount(0);
  });
});

test.describe("seo", () => {
  test("non-production builds are not indexable", async ({ page, request }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  });

  test("sitemap lists home and every case study", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml.match(/<loc>/g)).toHaveLength(6);
    expect(xml).toContain("/work/pet-care-platform</loc>");
  });

  test("home has Person JSON-LD and Open Graph images", async ({ page, request }) => {
    await page.goto("/");
    const ld = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
    );
    expect(ld).toMatchObject({
      "@type": "Person",
      name: "Harish Doraiswamy",
      jobTitle: "Software Engineer",
    });
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    const res = await request.get(new URL(og!).pathname + new URL(og!).search);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
  });

  test("case studies have their own title, canonical and OG image", async ({ page, request }) => {
    await page.goto("/work/notes-app");
    await expect(page).toHaveTitle("Full Stack Notes App · Harish Doraiswamy");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/work\/notes-app$/,
    );
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toContain("/work/notes-app/opengraph-image");
    expect((await request.get(new URL(og!).pathname)).status()).toBe(200);
  });
});
