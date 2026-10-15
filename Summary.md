# Project summary: start here

Handoff for a new session (human or Claude Code). Read this first, then `CLAUDE.md` (the rules) and `docs/resume-facts.md` (the source of truth for every claim). Last updated 2026-10-15.

## Where things stand

- **Live:** https://harishdoraiswamy.vercel.app (Vercel, production). Indexable: `robots.txt` says `Allow: /`; sitemap, canonical URLs and OG images all use this domain.
- **Repo:** https://github.com/HarishLD/harish-portfolio (public). `main` is production; every change lands through a PR with green CI.
- **Milestones M0 to M6: all done and merged** (PRs #1, #10 to #17). No open PRs.
- **Vercel env:** `NEXT_PUBLIC_SITE_URL=https://harishdoraiswamy.vercel.app` (Production only). Previews are protected by Vercel Authentication and are `noindex`. Ignore `*-harishlds-projects.vercel.app` (protected alias) and `harish-portfolio-jade-zeta.vercel.app` (old domain). `harish-portfolio.vercel.app` is **someone else's site**: never link it.

## What the site is

Personal portfolio for Harish Doraiswamy, positioned as **Software Engineer across mobile, web and backend**. Design system "Signal": paper/ink with one lime accent (the signal), Anton display type.

Sections on `/` (in order):

1. **Hero (Name Wall)**: HARISH in Anton, avatar centred over the "I", role + "builds across every layer." + See the work / Download resume. Desktop phone plays a CSS-only booking demo (recreated UI, ~7s loop, links to the Pet Care case study); cursor tilt and off-screen pause load after idle. Hidden on phones.
2. **Work**: bento grid of 5 projects, filters All/Mobile/Web/Backend, recreated screens, each card opens a case study.
3. **Layers**: pinned on desktop (≥1024px, full motion). A device turns phone → browser → server rack across three chapters with tech logos popping out. Swipe cards below 1024px; static steps under reduced motion or without JS.
4. **Path**: role timeline (L2 Tech Lead promotion is the one lime moment), education, teaching.
5. **How I Work**: six practice cards + the single "Currently learning" line.
6. **Contact**: signal line lands in the lime "Email me →" CTA; email (copy button), LinkedIn, GitHub, resume download; footer.

Other routes: `/work/[slug]` (static case study pages; the same content opens as an overlay from the grid), designed 404, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, generated OG/Twitter images.

## Stack

Next.js 16.4 (App Router, Turbopack, `cacheComponents`, `partialPrefetching`) · React 19.3 · TypeScript 5 strict · Tailwind CSS v4 · GSAP 3.15 (lazy-loaded only) · zod 4 · Vitest 5 + Testing Library · Playwright + axe · Lighthouse CI · ESLint 10 · Node ≥ 22.22.2 (`.nvmrc` 22).

## Map of the code

```
src/app/                     routes: page.tsx (home), work/[slug], @modal/(.)work/[slug] (overlay),
                             not-found, robots, sitemap, manifest, opengraph/twitter images, icons
src/content/                 ALL copy and data, zod-validated at build: profile, projects, experience,
                             layers (chapters + logos), schema.ts, index.ts (parsed exports)
src/components/ui/           primitives (Section, Container, Card, Button/ButtonLink, Label, Display...)
src/components/hero/         hero.tsx, hero-phone (+ motion island), device.tsx (Layers device faces)
src/components/work/         bento grid (WorkGrid island: filters, Flip, spotlight), cards
src/components/case-study/   case study body + overlay shell (native <dialog>)
src/components/layers/       chapters, logos (inline simple-icons paths), pinned morph island
src/components/screens/      recreated client UIs (HTML/CSS, cqw-scaled frames, sample data)
src/components/motion/       GSAP loaders (loadGsap/loadFlip/loadScrollTrigger), afterLoad,
                             useLazyGsap, useMountedSignal, MotionProvider (reduced motion)
src/components/{nav,signal,path,how,contact}/
src/lib/                     site (URL, indexable), resume (PDF gate), json-ld, og/assets, cx
src/proxy.ts                 real 404 status for unknown /work slugs
src/assets/og/               Anton TTF + avatar + screen PNGs for OG images (keep < ~400KB)
public/                      avatars, resume.pdf (phone-free), manifest icons
scripts/                     js-budget.mjs, icons.mjs, og-screens.mjs
docs/                        resume-facts.md, content-audit.md, screenshots/
e2e/                         Playwright specs (a11y, keyboard, hero, layers, work, nav, contact-seo, home)
```

## How to work on it

```bash
npm ci
npm run dev                         # http://localhost:3000
npm run check                       # lint, typecheck, format, unit tests, build, JS budget
npm run e2e                         # Playwright against the production build (build first)
node scripts/icons.mjs              # regenerate favicon set from src/app/icon.svg
node scripts/og-screens.mjs         # regenerate OG screen PNGs (needs `npm run start -- --port 3100`)
```

Workflow: branch → PR to `main` → CI green (lint/types/unit/build/budget, e2e + axe on desktop and mobile, Lighthouse desktop + mobile on every page) → Vercel preview → merge. Replies to Harish: direct, short, no em dashes.

## Rules that matter (details in CLAUDE.md)

- Every claim must trace to `docs/resume-facts.md`; update `docs/content-audit.md` when content changes. Tests enforce: metric values exist in the resume, no phone numbers, no city on the site, learning stack only in "Currently learning", client projects use recreated screens and never link out, exactly one featured metric per project.
- Every metric declares scope: Platform vs My work. Pet Care crash rate is "My work" (hyper-care Harish owned); Healthcare's is Platform.
- Signal lime ≈ 5% of a view, never as text on paper; on paper, signal dots get an ink ring.
- Motion: GSAP only, transform/opacity only, never in the initial bundle (load via `src/components/motion`). Only Layers is pinned/scroll-driven. Reduced motion: no pin, no scrub, 150ms fades, static states.
- JS budget: framework + **50KB gz of our own code** per page (`npm run budget`). Currently ~18KB on `/`.
- Client islands receive content as props (lint blocks importing `@/content` in them; it would ship zod).

## Decisions worth knowing (and why)

- **Layers pins only when approached from above.** Switching to the pinned layout after a jump past it (dock link, hash) would insert the pin spacer above the reader and push the target off screen.
- **Overlay = native modal `<dialog>`** opened in a layout effect and closed in its cleanup, because Next 16 keeps visited routes in hidden `<Activity>`; without the cleanup the page stayed inert. The overlay restores focus to its opener. "Next project" inside the overlay replaces history so Close is one step from the page.
- **Real 404s via `src/proxy.ts`**: with Cache Components, `notFound()` in a streamed render keeps a 200.
- **OG images**: next/og can't read WOFF2, so Anton is vendored as TTF; asset reads use `"use cache"` so images prerender. Case-study OG images show PNG snapshots of the recreated UI (regenerate with `scripts/og-screens.mjs`).
- **inlineCss tried and reverted**: +140KB HTML per page, no LCP gain, loses CSS caching.
- **ESLint 10** needs `package.json` overrides for three plugins; remove when they support v10. **TypeScript stays 5.x** (TS 7 breaks typescript-eslint). `@types/node` follows Node 22. Dependabot ignores those majors.
- **CI runners pinned to `ubuntu-24.04`.**
- **Unit tests never load real GSAP**: `vitest.setup.ts` mocks the loaders (`src/test/gsap-mock.ts`) and makes real `gsap` imports throw.

## Gotchas we hit (save yourself the time)

- **Stale `next-server`**: `pkill -f "next start"` can leave `next-server` running; Playwright then reuses it and serves an old build. Use `pkill -f next-server` before rebuilding/e2e.
- **zsh**: `path` is tied to `$PATH` (don't use it as a loop variable); `$VAR` holding newline-separated lists isn't word-split (pipe through `xargs` instead).
- **Lighthouse locally**: use Playwright's `chromium-1248` as `CHROME_PATH`; older 1228 gives `NO_FCP`. Lighthouse won't audit non-200 pages (404). Local builds are noindex, so SEO scores ~66 unless built with `VERCEL_ENV=production`.
- **Playwright element screenshots** on this page can show fixed elements in the wrong place; use `page.screenshot({ fullPage: true, clip })` instead.
- **Absolutely positioned children escape `overflow` scrollers** unless the scroller is `relative` (this widened the phone page to 900px once).
- **Tailwind v4 layers**: utilities beat anything in `@layer components`; use `!important` there when overriding a utility (e.g. reduced-motion still frames).

## Quality snapshot (2026-10-15)

Lighthouse (production-flagged build): accessibility, best practices, SEO **100 on every page**, mobile and desktop; performance 100 desktop, 95 to 96 mobile (simulated LCP ~2.8s; 0.8s with DevTools throttling); CLS 0. Tests: 64 unit, 88 e2e passing (20 skipped by design: desktop-only/phone-only specs).

## Open items / ideas

- Resume PDF header lists relocation cities (Bengaluru, Hyderabad); the site itself is location-neutral. Harish's call.
- Notes app screen is recreated (live app is behind a login); a real screenshot is allowed for Notes if provided (`screens: "real"` in `src/content/projects.ts`).
- Optional custom domain later: add it in Vercel, update `NEXT_PUBLIC_SITE_URL`, redeploy (canonical, sitemap, OG follow automatically).
- Optional: submit the sitemap in Google Search Console.
- Optional avatar poses (layers-pointing, case-pointing, path-laptop, contact-wave) can be dropped in later; missing poses render nothing.
