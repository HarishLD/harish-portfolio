// Captures each project's recreated screen as a PNG for the case-study OG images
// (src/assets/og/screens/<slug>.png). next/og can't render our Tailwind components,
// so these are snapshots. Re-run after changing a recreated screen:
//   npm run build && npm run start -- --port 3100 &   then   node scripts/og-screens.mjs
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
// Which figure to use per project: the phone where there is one, else the browser.
const SHOTS = {
  "pet-care-platform": 0,
  "healthcare-records-platform": 0,
  "enterprise-product-naming-platform": 0,
  "notes-app": 0,
  "dynamic-form-pdf-platform": 0,
};

mkdirSync("src/assets/og/screens", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 1000 },
  deviceScaleFactor: 1.5,
});
for (const [slug, index] of Object.entries(SHOTS)) {
  await page.goto(`${BASE}/work/${slug}`);
  await page.evaluate(() => document.fonts.ready);
  const node = page.locator('figure [role="img"] > div').nth(index);
  // Phones render narrow; browsers are capped so the PNG stays small.
  await node.evaluate((el) => {
    const isPhone = !!el.querySelector(".aspect-\\[9\\/19\\]");
    el.style.width = isPhone ? "300px" : "560px";
    el.style.paddingRight = "16px";
    el.style.paddingBottom = "18px";
  });
  await node.screenshot({ path: `src/assets/og/screens/${slug}.png`, omitBackground: true });
  console.log("captured", slug);
}
await browser.close();
