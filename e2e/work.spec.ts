import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const axe = (page: import("@playwright/test").Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();

test.describe("work", () => {
  test("filters the grid by layer", async ({ page }) => {
    await page.goto("/#work");
    const group = page.getByRole("group", { name: "Filter projects by layer" });
    await group.getByRole("button", { name: /^Mobile/ }).click();
    const cards = page.locator("#work li[data-flip-id]:visible");
    await expect(cards).toHaveCount(2);
    await group.getByRole("button", { name: /^All/ }).click();
    await expect(cards).toHaveCount(5);
  });

  test("a card opens the case study as an overlay; Escape returns to the page", async ({
    page,
  }) => {
    await page.goto("/#work");
    await page
      .locator("#work")
      .getByRole("link", { name: /Healthcare Records Platform/ })
      .click();
    await expect(page).toHaveURL(/\/work\/healthcare-records-platform$/);
    const dialog = page.getByRole("dialog", { name: "Healthcare Records Platform" });
    await expect(dialog).toBeVisible();
    // Let the entrance fade finish so axe measures final colors.
    await expect(dialog.locator("> div")).toHaveCSS("opacity", "1");
    expect((await axe(page)).violations).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/(#work)?$/);
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    // The page is interactive again (not left inert behind a hidden modal).
    await page
      .getByRole("group", { name: "Filter projects by layer" })
      .getByRole("button", { name: /^Web/ })
      .click();
    await expect(page.locator("#work li[data-flip-id]:visible")).toHaveCount(5);
  });

  test("next project inside the overlay keeps Close one step from the page", async ({ page }) => {
    await page.goto("/#work");
    await page
      .locator("#work")
      .getByRole("link", { name: /Healthcare Records Platform/ })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: /Next project/ })
      .click();
    await expect(page).toHaveURL(/enterprise-product-naming-platform$/);
    await page.getByRole("button", { name: /Close/ }).click();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(page).not.toHaveURL(/\/work\//);
  });

  test("a direct visit renders the full case study page", async ({ page }) => {
    await page.goto("/work/pet-care-platform");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pet Care Platform");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(page).toHaveTitle(/Pet Care Platform/);
    await expect(page.getByText(/Recreated UI · sample data/).first()).toBeVisible();
    expect((await axe(page)).violations).toEqual([]);
  });

  test("unknown case studies return a real 404", async ({ page }) => {
    const res = await page.goto("/work/not-a-project");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("This page could not be found.")).toBeVisible();
  });

  test("known case studies still return 200", async ({ request }) => {
    expect((await request.get("/work/notes-app")).status()).toBe(200);
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("cards are plain links to the full pages", async ({ page }) => {
      await page.goto("/");
      await page
        .locator("#work")
        .getByRole("link", { name: /Full Stack Notes App/ })
        .click();
      await expect(page).toHaveURL(/\/work\/notes-app$/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Full Stack Notes App");
    });
  });
});
