import { expect, test } from "@playwright/test";

test.describe("hero", () => {
  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("name, role and CTA are readable instantly", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(/harish/i);
      await expect(page.getByText("Software Engineer", { exact: true }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: "See the work" })).toBeVisible();
      await expect(page.getByAltText(/avatar of harish/i)).toBeVisible();
      await expect(page.locator("[data-device-stage]")).toHaveAttribute("data-state", "mobile");
    });
  });

  test("the avatar is preloaded for LCP", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(1);
  });

  test("scrolling morphs the device phone → browser → server", async ({ page }) => {
    await page.goto("/");
    const stage = page.locator("[data-device-stage]");
    await expect(stage).toHaveAttribute("data-state", "mobile");
    // Wait for the idle-loaded ScrollTrigger before scrolling.
    await page.waitForFunction(() =>
      document.querySelector("[data-face=mobile]")?.getAttribute("style"),
    );
    await page.mouse.wheel(0, 900);
    await expect(stage).toHaveAttribute("data-state", "backend");
    await page.mouse.wheel(0, -2000);
    await expect(stage).toHaveAttribute("data-state", "mobile");
  });

  test("keeps layout stable while loading (CLS < 0.05)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const shift = entry as unknown as { value: number; hadRecentInput: boolean };
              if (!shift.hadRecentInput) total += shift.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          setTimeout(() => resolve(total), 500);
        }),
    );
    expect(cls).toBeLessThan(0.05);
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("the three states are tappable and scrolling does not morph", async ({ page }) => {
      await page.goto("/");
      const stage = page.locator("[data-device-stage]");
      const group = page.getByRole("group", { name: "Device layer" });
      await group.getByRole("button", { name: "Web" }).click();
      await expect(stage).toHaveAttribute("data-state", "web");
      await group.getByRole("button", { name: "Backend" }).click();
      await expect(stage).toHaveAttribute("data-state", "backend");

      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(400);
      await expect(stage).toHaveAttribute("data-state", "backend");
    });
  });
});
