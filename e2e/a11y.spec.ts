import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/work/pet-care-platform",
  "/work/healthcare-records-platform",
  "/work/enterprise-product-naming-platform",
  "/work/notes-app",
  "/work/dynamic-form-pdf-platform",
  "/work/not-a-project",
];

async function axe(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  return violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

test.describe("axe on every page", () => {
  for (const route of ROUTES) {
    test(route, async ({ page }) => {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(await axe(page)).toEqual([]);
    });
  }
});

test("axe on the case study overlay", async ({ page }) => {
  await page.goto("/#work");
  await page
    .locator("#work")
    .getByRole("link", { name: /Pet Care Platform/ })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("> div")).toHaveCSS("opacity", "1");
  expect(await axe(page)).toEqual([]);
});

test("axe on the pinned Layers state", async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 1024, "pinned layout is desktop only");
  await page.goto("/");
  await page.evaluate(() =>
    window.scrollTo(0, document.querySelector<HTMLElement>("#layers")!.offsetTop - innerHeight),
  );
  await expect(page.locator("#layers .pin-spacer")).toHaveCount(1);
  await page.evaluate(() => window.scrollBy(0, innerHeight * 2));
  await page.waitForTimeout(800);
  expect(await axe(page)).toEqual([]);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("axe on the home page", async ({ page }) => {
    await page.goto("/");
    expect(await axe(page)).toEqual([]);
  });
});
