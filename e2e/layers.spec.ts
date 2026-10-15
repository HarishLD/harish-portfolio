import { type Page, expect, test } from "@playwright/test";

const isDesktop = (w: number | undefined) => (w ?? 0) >= 1024;

/** Scroll near the section so the island loads GSAP and pins, then return the pin's start. */
async function pinStart(page: Page) {
  // The island loads one viewport ahead of itself: put the section top at the fold.
  await page.evaluate(() =>
    window.scrollTo(0, document.querySelector<HTMLElement>("#layers")!.offsetTop - innerHeight),
  );
  await expect(page.locator("#layers .pin-spacer")).toHaveCount(1);
  return page.evaluate(
    () => document.querySelector("#layers .pin-spacer")!.getBoundingClientRect().top + scrollY,
  );
}

test.describe("layers, desktop", () => {
  test.beforeEach(({ viewport }) => test.skip(!isDesktop(viewport?.width), "desktop only"));

  test("pins and walks Mobile → Web → Backend, and reverses on the way back", async ({ page }) => {
    await page.goto("/");
    const start = await pinStart(page);
    const vh = page.viewportSize()!.height;
    const current = page.locator('#layers [aria-current="step"]');
    const stage = page.locator("#layers [data-device-stage]");

    for (const [p, label, state] of [
      [0.1, "Mobile", "mobile"],
      [0.5, "Web", "web"],
      [0.9, "Backend", "backend"],
      [0.1, "Mobile", "mobile"],
    ] as const) {
      await page.evaluate((y) => window.scrollTo(0, y), start + p * vh * 3);
      await expect(current).toContainText(label);
      await expect(stage).toHaveAttribute("data-state", state);
    }
  });

  test("the device stays in view while pinned", async ({ page }) => {
    await page.goto("/");
    const start = await pinStart(page);
    const vh = page.viewportSize()!.height;
    for (const p of [0.2, 0.5, 0.8]) {
      await page.evaluate((y) => window.scrollTo(0, y), start + p * vh * 3);
      await expect(page.locator("#layers [data-device-stage]")).toBeInViewport();
    }
  });

  test("jumping past Layers (dock link) does not pin it under the reader", async ({ page }) => {
    await page.goto("/");
    await page.mouse.wheel(0, 900);
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "How I work" })
      .click();
    await page.waitForTimeout(800);
    await expect(page.getByRole("heading", { name: "How I work" })).toBeInViewport();
    await expect(page.locator("#layers .pin-spacer")).toHaveCount(0);
  });

  test("Skip Layers jumps past the pinned section", async ({ page }) => {
    await page.goto("/");
    const start = await pinStart(page);
    await page.evaluate((y) => window.scrollTo(0, y), start + 10);
    await page.getByRole("link", { name: /Skip Layers/ }).click();
    await expect(page).toHaveURL(/#path$/);
    await expect(page.getByRole("heading", { name: "Path" })).toBeInViewport();
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("no pin: three static steps with logos in place", async ({ page }) => {
      await page.goto("/#layers");
      await page.waitForTimeout(800);
      await expect(page.locator("#layers .pin-spacer")).toHaveCount(0);
      await expect(page.locator('#layers ol[aria-label="Layers"] > li')).toHaveCount(3);
      await expect(page.getByRole("list", { name: "Backend stack" })).toBeVisible();
    });
  });
});

test.describe("layers, phones", () => {
  test.beforeEach(({ viewport }) => test.skip(isDesktop(viewport?.width), "phones only"));

  test("swipeable chapter cards, no pinning", async ({ page }) => {
    await page.goto("/#layers");
    await page.waitForTimeout(800);
    await expect(page.locator("#layers .pin-spacer")).toHaveCount(0);
    const list = page.locator('#layers ol[aria-label="Layers"]');
    await expect(list.locator("> li")).toHaveCount(3);
    const scrollable = await list.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(scrollable).toBe(true);
    await list.evaluate((el) => el.scrollTo({ left: el.scrollWidth }));
    await expect(list.locator("> li").last()).toBeInViewport();
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("all three chapters are readable", async ({ page }) => {
    await page.goto("/");
    for (const t of ["Mobile", "Web", "Backend"]) {
      await expect(
        page.locator("#layers").getByRole("heading", { name: t, exact: true }),
      ).toBeAttached();
    }
  });
});
