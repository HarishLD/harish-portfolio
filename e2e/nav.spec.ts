import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const isDesktop = (width: number | undefined) => (width ?? 0) >= 1024;

test.describe("desktop nav", () => {
  test.beforeEach(({ viewport }) => {
    test.skip(!isDesktop(viewport?.width), "desktop only");
  });

  test("morphs the top bar into a bottom dock on scroll and back", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toHaveAttribute("data-docked", "false");

    await page.mouse.wheel(0, 900);
    await expect(nav).toHaveAttribute("data-docked", "true");
    await expect(nav.getByRole("link", { name: "Back to top" })).toBeVisible();
    const cta = nav.getByRole("link", { name: /let.s talk/i });
    // Settles at the bottom once the Flip animation finishes.
    await expect
      .poll(async () => (await cta.boundingBox())?.y ?? 0)
      .toBeGreaterThan(page.viewportSize()!.height / 2);

    await page.mouse.wheel(0, -5000);
    await expect(nav).toHaveAttribute("data-docked", "false");
  });

  test("dock links jump to their section", async ({ page }) => {
    await page.goto("/");
    await page.mouse.wheel(0, 900);
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: "Path" }).click();
    await expect(page).toHaveURL(/#path$/);
    await expect(page.getByRole("heading", { name: "Path" })).toBeInViewport();
  });
});

test.describe("mobile menu", () => {
  test.beforeEach(({ viewport }) => {
    test.skip(isDesktop(viewport?.width), "mobile only");
  });

  test("opens full screen, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    await button.click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("menu links close the menu and land on the section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Layers" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page).toHaveURL(/#layers$/);
    await expect(page.getByRole("heading", { name: "Layers" })).toBeInViewport();
  });

  test("open menu has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.waitForTimeout(1000);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("navigation still works without transforms", async ({ page, viewport }) => {
    await page.goto("/");
    if (isDesktop(viewport?.width)) {
      await page.mouse.wheel(0, 900);
      await expect(page.getByRole("navigation", { name: "Primary" })).toHaveAttribute(
        "data-docked",
        "true",
      );
    } else {
      await page.getByRole("button", { name: "Menu" }).click();
      const firstLink = page.getByRole("dialog").getByRole("link", { name: "Work", exact: true });
      await expect(firstLink).toBeVisible();
      const transform = await firstLink.evaluate(
        (el) => getComputedStyle(el.parentElement!).transform,
      );
      expect(transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
    }
  });
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});
