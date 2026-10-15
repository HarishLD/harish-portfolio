import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Assets for generated Open Graph images. next/og (Satori) needs TTF/OTF/WOFF,
 * not WOFF2, so Anton is vendored as TTF (OFL, see src/fonts/licenses).
 * Recreated screens are PNG snapshots (scripts/og-screens.mjs).
 * Each image's bundle must stay under 500KB.
 *
 * Reads are cached ("use cache") so the images prerender at build; otherwise
 * file reads are uncached I/O under Cache Components and render per request.
 */
const dir = join(process.cwd(), "src/assets/og");

async function readBase64(file: string) {
  "use cache";
  return (await readFile(join(dir, file))).toString("base64");
}

export async function ogFonts() {
  const anton = await readBase64("Anton-Regular.ttf");
  return [
    {
      name: "Anton",
      data: Buffer.from(anton, "base64"),
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}

export async function ogImage(file: string) {
  return `data:image/png;base64,${await readBase64(file)}`;
}

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  paper: "#EFEDE6",
  paper2: "#E4E1D8",
  line: "#CFCBC0",
  ink: "#0B0B0A",
  fog: "#B5B1A8",
  muted: "#4A4741",
  signal: "#C8FF2E",
};
