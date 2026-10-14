// Initial JS budget: framework + at most OWN_BUDGET_KB of our code (gzip -9), per prerendered page.
// "Framework" = the chunks Next loads for its built-in _global-error page, which renders
// none of our layout or components. Everything else a page loads up front is ours.
// Run after `next build`.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const OWN_BUDGET_KB = 50;
const APP_DIR = ".next/server/app";

const kb = (bytes) => bytes / 1024;
const chunksOf = (html) => [...new Set(html.match(/\/_next\/static\/chunks\/[^"]+\.js/g) ?? [])];
const gz = (chunk) =>
  gzipSync(readFileSync(join(".next", chunk.slice("/_next".length))), { level: 9 }).length;

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

const framework = new Set(chunksOf(readFileSync(join(APP_DIR, "_global-error.html"), "utf8")));
const frameworkKb = kb([...framework].reduce((sum, c) => sum + gz(c), 0));

let failed = false;
console.log(
  `Framework baseline: ${frameworkKb.toFixed(1)} KB gz · own-code budget: ${OWN_BUDGET_KB} KB gz\n`,
);
for (const file of htmlFiles(APP_DIR)) {
  const route =
    "/" +
    relative(APP_DIR, file)
      .replace(/(^|\/)?index\.html$/, "")
      .replace(/\.html$/, "");
  if (route.startsWith("/_global-error")) continue;
  const chunks = chunksOf(readFileSync(file, "utf8"));
  const ownKb = kb(chunks.filter((c) => !framework.has(c)).reduce((sum, c) => sum + gz(c), 0));
  const totalKb = kb(chunks.reduce((sum, c) => sum + gz(c), 0));
  const ok = ownKb <= OWN_BUDGET_KB;
  failed ||= !ok;
  console.log(
    `${ok ? "ok  " : "FAIL"} ${route.padEnd(28)} own ${ownKb.toFixed(1).padStart(5)} KB · total ${totalKb.toFixed(1)} KB`,
  );
}

if (failed) {
  console.error(
    `\nOwn initial JS exceeds ${OWN_BUDGET_KB} KB gz. Lazy-load it (see src/components/motion/gsap.ts).`,
  );
  process.exit(1);
}
