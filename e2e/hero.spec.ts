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
      await expect(page.locator("[data-hero] [data-device-stage]")).toHaveAttribute(
        "data-state",
        "mobile",
      );
    });
  });

  test("composition follows the hero rules", async ({ page, viewport }) => {
    const desktop = (viewport?.width ?? 0) >= 1280;
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const geo = await page.evaluate(() => {
      const R = (el: Element | Range) => el.getBoundingClientRect();
      const h1 = document.querySelector("h1")!;
      const text = h1.firstChild!;
      const range = document.createRange();
      range.selectNodeContents(h1);
      const run = R(range);
      range.setStart(text, 3);
      range.setEnd(text, 4);
      const letterI = R(range);
      const avatar = R(document.querySelector('img[alt^="Illustrated"]')!);
      const deviceEl = document.querySelector("[data-hero] [data-device-stage]")!.parentElement!;
      const device = R(deviceEl);
      const hero = R(document.querySelector("[data-hero]")!);
      return {
        avatarCenter: avatar.left + avatar.width / 2,
        iCenter: letterI.left + letterI.width / 2,
        avatarTop: avatar.top,
        avatarRight: avatar.right,
        avatarBottom: avatar.bottom,
        lettersTop: R(h1).top,
        lettersBottom: R(h1).bottom,
        lettersRight: run.right,
        deviceLeft: device.left,
        deviceTop: device.top,
        heroBottom: hero.bottom,
        deviceVisible: getComputedStyle(deviceEl).display !== "none",
      };
    });
    // Head over the upper half of the letters; avatar bottom-anchored.
    expect(geo.avatarTop).toBeLessThan(geo.lettersTop + (geo.lettersBottom - geo.lettersTop) / 2);
    expect(geo.avatarBottom).toBeLessThanOrEqual(geo.heroBottom + 1);
    // Centered over the "I" at every size, so the R stays visible.
    expect(Math.abs(geo.avatarCenter - geo.iCenter)).toBeLessThan(8);
    if (desktop) {
      expect(geo.deviceLeft).toBeGreaterThan(geo.lettersRight);
    } else if (geo.deviceVisible) {
      // Tablet: small device under the letters, beside (not over) the avatar.
      expect(geo.deviceTop).toBeGreaterThanOrEqual(geo.lettersBottom);
      expect(geo.deviceLeft).toBeGreaterThanOrEqual(geo.avatarRight);
    }
  });

  test("phones hide the hero device", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) >= 768, "phones only");
    await page.goto("/");
    await expect(page.locator("[data-hero] [data-device-stage]")).toBeHidden();
  });

  test("the avatar is preloaded for LCP", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(1);
  });

  test("the hero device stays a static phone while scrolling", async ({ page }) => {
    await page.goto("/");
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(600);
    await expect(page.locator("[data-hero] [data-device-stage]")).toHaveAttribute(
      "data-state",
      "mobile",
    );
    await expect(page.locator("[data-hero]").getByRole("button")).toHaveCount(0);
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
});
