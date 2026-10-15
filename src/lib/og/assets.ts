import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Assets for generated Open Graph images. next/og (Satori) needs TTF/OTF/WOFF,
 * not WOFF2, so Anton is vendored as TTF (OFL, see src/fonts/licenses).
 * The whole image bundle must stay under 500KB.
 */
const dir = join(process.cwd(), "src/assets/og");

// Cached so the images prerender at build (file reads are otherwise uncached I/O
// under Cache Components, which would make every image render on request).
async function readAssets() {
  "use cache";
  const [anton, avatar] = await Promise.all([
    readFile(join(dir, "Anton-Regular.ttf")),
    readFile(join(dir, "avatar.png")),
  ]);
  return { anton: anton.toString("base64"), avatar: avatar.toString("base64") };
}

export async function ogAssets() {
  const { anton, avatar } = await readAssets();
  return {
    fonts: [
      {
        name: "Anton",
        data: Buffer.from(anton, "base64"),
        style: "normal" as const,
        weight: 400 as const,
      },
    ],
    avatarSrc: `data:image/png;base64,${avatar}`,
  };
}

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  paper: "#EFEDE6",
  paper2: "#E4E1D8",
  ink: "#0B0B0A",
  fog: "#B5B1A8",
  muted: "#4A4741",
  signal: "#C8FF2E",
};
