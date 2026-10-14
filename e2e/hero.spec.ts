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
      const device = R(document.querySelector("[data-device-stage]")!.parentElement!);
      const hero = R(document.querySelector("[data-hero]")!);
      return {
        avatarCenter: avatar.left + avatar.width / 2,
        iCenter: letterI.left + letterI.width / 2,
        avatarCenterPct: ((avatar.left + avatar.width / 2 - run.left) / run.width) * 100,
        avatarTop: avatar.top,
        avatarRight: avatar.right,
        avatarBottom: avatar.bottom,
        lettersTop: R(h1).top,
        lettersBottom: R(h1).bottom,
        lettersRight: run.right,
        deviceLeft: device.left,
        deviceTop: device.top,
        heroBottom: hero.bottom,
      };
    });
    // Head over the upper half of the letters; avatar bottom-anchored.
    expect(geo.avatarTop).toBeLessThan(geo.lettersTop + (geo.lettersBottom - geo.lettersTop) / 2);
    expect(geo.avatarBottom).toBeLessThanOrEqual(geo.heroBottom + 1);
    if (desktop) {
      // Centered over the "I"; device past the end of the name.
      expect(Math.abs(geo.avatarCenter - geo.iCenter)).toBeLessThan(8);
      expect(geo.deviceLeft).toBeGreaterThan(geo.lettersRight);
    } else {
      expect(geo.avatarCenterPct).toBeGreaterThan(40);
      expect(geo.avatarCenterPct).toBeLessThan(60);
      // Small device under the letters, beside (not over) the avatar.
      expect(geo.deviceTop).toBeGreaterThanOrEqual(geo.lettersBottom);
      expect(geo.deviceLeft).toBeGreaterThanOrEqual(geo.avatarRight);
    }
  });

  test("mode chips are hidden in full motion on phones", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) >= 1280, "phones and tablets only");
    await page.goto("/");
    await expect(page.getByText("Backend", { exact: true })).toHaveCount(2);
    await expect(page.getByText("Backend", { exact: true }).first()).toBeHidden();
    await expect(page.getByText("Backend", { exact: true }).last()).toBeHidden();
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

    test("the three states are tappable and scrolling does not morph", async ({
      page,
      viewport,
    }) => {
      await page.goto("/");
      if ((viewport?.width ?? 0) < 1280) {
        // On phones the chips sit below the hero rule, never over the avatar.
        const chips = await page.getByRole("group", { name: "Device layer" }).boundingBox();
        const avatar = await page.getByAltText(/avatar of harish/i).boundingBox();
        expect(chips!.y).toBeGreaterThanOrEqual(avatar!.y + avatar!.height);
      }

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
