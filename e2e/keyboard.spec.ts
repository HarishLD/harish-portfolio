import { expect, test } from "@playwright/test";

test.describe("keyboard only", () => {
  test.beforeEach(({ viewport }) =>
    test.skip((viewport?.width ?? 0) < 1024, "desktop walkthrough"),
  );

  test("the whole page is reachable, every stop visible with a focus indicator, no traps", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();

    const seen: string[] = [];
    let reachedFooter = false;
    for (let i = 0; i < 120; i++) {
      await page.keyboard.press("Tab");
      const stop = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const ring =
          (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) ||
          cs.boxShadow !== "none" ||
          // Cards and the hero phone draw their ring on a wrapper or sibling.
          !!el.closest("article")?.matches(":focus-within") ||
          !!el.closest("[data-hero-phone]");
        return {
          name: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40),
          visible: r.width > 0 && r.height > 0 && cs.visibility !== "hidden",
          ring,
        };
      });
      if (!stop) break;
      expect(stop.visible, `hidden focus stop: ${stop.name}`).toBe(true);
      expect(stop.ring, `no focus indicator: ${stop.name}`).toBe(true);
      seen.push(stop.name);
      if (/source on github/i.test(stop.name)) {
        reachedFooter = true;
        break;
      }
    }
    expect(reachedFooter, `stops: ${seen.join(" | ")}`).toBe(true);
    // "Skip Layers" exists only while the pinned layout is active (nothing to skip otherwise).
    const pinned = (await page.locator("#layers .pin-spacer").count()) > 0;
    const required = [
      "See the work",
      "All",
      "Email me",
      "Copy email",
      ...(pinned ? ["Skip Layers"] : []),
    ];
    for (const expected of required) {
      expect(
        seen.some((s) => s.startsWith(expected)),
        `${expected} not reached`,
      ).toBe(true);
    }
  });

  test("open a case study with Enter, stay inside it, Escape returns focus", async ({ page }) => {
    await page.goto("/#work");
    const card = page.locator("#work").getByRole("link", { name: /Notes App/ });
    await card.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    // Native modal dialog: focus cycles through its controls, with one stop on the
    // browser chrome (document.body here), and never reaches the page behind it.
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      const where = await dialog.evaluate((d) =>
        d.contains(document.activeElement)
          ? "dialog"
          : document.activeElement === document.body
            ? "chrome"
            : "page",
      );
      expect(where).not.toBe("page");
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(card).toBeFocused();
  });
});
