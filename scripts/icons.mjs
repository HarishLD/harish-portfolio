// Renders src/app/icon.svg into the raster favicon set:
//   src/app/favicon.ico (16/32/48, PNG-in-ICO), src/app/apple-icon.png (180, full bleed),
//   public/icon-192.png, public/icon-512.png, public/icon-maskable-512.png (manifest).
// Run: node scripts/icons.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const svg = readFileSync("src/app/icon.svg", "utf8");
// Apple and maskable icons get a square, padded version (the OS applies its own mask).
const square = svg.replace('rx="14"', 'rx="0"');
const maskable = square
  .replace(/<g fill/, '<g transform="translate(6.4 6.4) scale(0.8)" fill')
  .replace('<circle cx="51" cy="13" r="5"', '<circle cx="47.2" cy="16.8" r="4"');

const browser = await chromium.launch();
const page = await browser.newPage();
async function render(markup, size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${markup.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`,
  );
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

const ico = [16, 32, 48];
const pngs = [];
for (const s of ico) pngs.push(await render(svg, s));
// ICO container with embedded PNGs.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(ico.length, 4);
let offset = 6 + 16 * ico.length;
const entries = ico.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
writeFileSync("src/app/favicon.ico", Buffer.concat([header, ...entries, ...pngs]));
writeFileSync("src/app/apple-icon.png", await render(square, 180));
writeFileSync("public/icon-192.png", await render(svg, 192));
writeFileSync("public/icon-512.png", await render(svg, 512));
writeFileSync("public/icon-maskable-512.png", await render(maskable, 512));
await browser.close();
console.log("icons written");
