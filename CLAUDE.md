@AGENTS.md
@Summary.md

# Harish portfolio: project brief

Personal portfolio for Harish Doraiswamy. Read this file fully before any change. `Summary.md` (imported above) has the current state, code map, decisions and gotchas.
Source of truth for all claims: `docs/resume-facts.md` (from the resume). Never invent metrics, roles or features.

## Working agreement

- Build milestone by milestone. One branch per milestone (`m1-foundations`, ...), PR to `main`, Vercel preview for review.
- Stop at the end of each milestone and wait for Harish's approval before starting the next.
- Run `npm run check` (and `npm run e2e` when UI changes) before saying a milestone is done.
- No secrets in Git. Public env only (`NEXT_PUBLIC_SITE_URL`).
- Style for replies to Harish: direct, short, practical. No em dashes.

## Status

- [x] M0 Setup (Next.js 16, React 19, TS strict, Tailwind v4 tokens, self-hosted fonts, Vitest, Playwright + axe, Lighthouse CI, GitHub Actions)
- [x] M1 Foundations: primitives, typed content layer + zod schema, nav (top bar → floating dock on desktop, full-screen menu on mobile), motion provider with reduced-motion
- [x] M2 Hero: Name Wall static first (fast LCP), then fake-3D morph device + signal line on scroll (the morph moves to Layers in M4, see "M4 plan")
- [x] M3 Work: bento grid, layer filters, recreated screens, case studies (`/work/[slug]` pages + overlay)
- [x] M4 Layers device morph (pinned desktop, swipe mobile, see "M4 plan"), hero device back to a static phone, Path timeline, How I Work
- [x] M5 Contact, resume download, SEO (metadata, OG, JSON-LD, sitemap), switch robots to index
- [x] M6 QA and polish

## Housekeeping

- ESLint 10: `package.json` `overrides` force the eslint peer for `eslint-plugin-import`, `eslint-plugin-jsx-a11y` and `eslint-plugin-react` (via `eslint-config-next`). Remove those overrides once the plugins declare ESLint 10 support (check with `npm view <plugin> peerDependencies`).
- TypeScript stays on 5.x: TS 7 (native compiler) breaks typescript-eslint inside `eslint-config-next`. Dependabot ignores TS majors; lift that once typescript-eslint supports TS 7.
- `@types/node` follows the Node line in `.nvmrc` (22); Dependabot ignores its majors.
- CI runners are pinned to `ubuntu-24.04` (ubuntu-latest moves to 26.04 on 2026-10-19). Move deliberately once Playwright and Lighthouse are verified there.
- Unit tests never load real GSAP: `vitest.setup.ts` mocks the loaders with `src/test/gsap-mock.ts` and makes any real `gsap` import throw. Consume loaders only through `afterLoad` (cancel-safe) or `useLazyGsap`.
- `npm audit` shows a dev-only `braces` advisory (GHSA-vfj7-8cjw-p6xm) with no upstream fix; CI audits production deps only.

## Positioning

"Software Engineer" across mobile, web and backend. Not "mobile developer", not "AI engineer".
Location-neutral: no city on the site. Contact = email, LinkedIn, GitHub, resume download. No phone number anywhere (the public resume PDF must be a phone-free version).

## Design direction (locked)

Name: "Signal". Ink & Signal restraint + cinematic hero. Must not feel like a film template or generic dev portfolio. No film vocabulary (scene, take, REC).

- Hero "Name Wall": oversized HARISH (Anton), avatar standing in front of the letters, fake-3D device beside it, serif line "builds across every layer.", CTAs "See the work" (primary) + "Download resume". Name, role, CTA readable instantly.
- Morph: lives in the Layers section (from M4), not the hero. Device goes phone → browser → server rack across three pinned chapters. Fake 3D with CSS/SVG transforms first; true 3D only if this lacks impact (desktop only).
- Hero device: the recreated Pet Care booking phone beside the avatar, playing a CSS-only booking loop (~7s); desktop adds a cursor tilt (max 6deg, loaded after idle) and an idle float; it links to the Pet Care case study; reduced motion shows the confirmed still frame; hidden below md.
- Signal: the lime line/dot that threads sections and ends as the contact CTA.
- Nav: desktop top bar morphs into floating bottom dock (avatar head + links + "Let's talk"). Mobile: menu button → full-screen menu with huge Anton links.
- Projects: interactive bento, filters All/Mobile/Web/Backend, recreated screens, real metrics, expandable case studies.
- Avatar placement: bottom-anchored or seated on a line, overlapping type for depth. Missing poses render nothing (no placeholders in production).

## M4 plan: Layers device morph (recorded 2026-10-14)

Why: the hero morph finished within ~280px of scroll, too fast to notice. It moves to Layers, where it gets room.

- Hero: device stays a static tilted phone (desktop only, hidden below md). Remove the scroll morph, the ScrollTrigger load and the Mobile/Web/Backend chips from the hero.
- Layers (desktop): section pinned; the device stays centered while scrolling through three chapters, Mobile → Web → Backend. Beside it, the chapter text and one resume-backed proof point change per chapter, with a progress indicator (1/3, 2/3, 3/3) and a "Skip Layers" link that jumps past the pinned section.
- Morph: phone → browser → server rack. During each transition the device turns in 3D (a smooth turn, not a spin) and settles at a fixed angle per chapter. Each state holds while its chapter is on screen; scrolling back reverses cleanly (scrub with holds between transitions, no snapping jumps).
- Tech logos pop out of the device per chapter, from resume-facts.md only, max 5:
  - Mobile: React Native, TypeScript, Kotlin, Swift, Firebase
  - Web: React, Next.js, TypeScript, Redux
  - Backend: Node.js, PostgreSQL, Prisma, Salesforce, WebSockets
  Monochrome ink/paper marks; the current layer's own mark highlighted in signal lime (respect the ~5% signal rule). They float out around the device, stay while the chapter is active, and tuck back in when it changes. Inline simple-icons SVG paths (copied in, CC0), no icon library bundle. Check each exists in simple-icons first: there is no generic WebSockets mark, so use a small text-mark fallback for any missing one, never an invented logo.
- Performance: transform/opacity only; load GSAP + ScrollTrigger with the section (`useLazyGsap`, `load: "visible"`); stay within the 50KB own-JS budget.
- Mobile (below md): no pinning. Three swipeable chapter cards (scroll-snap), each showing its device state and its logos static.
- Reduced motion: no pin, no rotation, no pop-outs; three static steps with the logos shown in place.

Built in M4 (notes for later work):
- The pinned layout activates only when the section is approached from above (still below the viewport). After a jump past it (dock link, hash) it stays as static steps until the next approach, so a pin spacer never appears above the reader.
- React Native has no simple-icons mark; it uses the React atom (its actual logo) labelled "React Native". Salesforce and WebSockets are text labels.
- Breakpoint: pinned at lg (1024px) and up; swipe cards below lg (tablets included).

## M5 notes

- Resume: `getResumeHref()` (src/lib/resume.ts) checks `public/resume.pdf` at build; the hero and contact download buttons render only when it exists. The PDF must be the phone-free version.
- Indexing: `indexable` (src/lib/site.ts) is true only when `VERCEL_ENV=production`; it drives `robots.ts` and the page robots meta. Previews, local and CI builds stay noindex.
- OG images use next/og with Anton vendored as TTF in `src/assets/og` (Satori can't read WOFF2); asset reads are `"use cache"` so the images prerender. Keep that folder under ~400KB (500KB bundle limit).

## M6 notes

- Lighthouse CI runs every page twice: `lighthouserc.json` (desktop) and `lighthouserc.mobile.json`. `is-crawlable` is off in CI because previews are noindex by design.
- QA specs: `e2e/a11y.spec.ts` (axe on every page, the overlay, pinned Layers, reduced motion) and `e2e/keyboard.spec.ts` (full Tab walkthrough, overlay focus).
- Generated assets: `node scripts/icons.mjs` (favicon set from `src/app/icon.svg`), `node scripts/og-screens.mjs` (OG screen snapshots, needs a running build). Re-run after changing the mark or a recreated screen.
- `docs/content-audit.md` maps every claim to resume-facts.md; update it when content changes.

## Tokens (in `src/app/globals.css`)

paper #EFEDE6 · paper-2 #E4E1D8 · line #CFCBC0 · muted #4A4741 (text on paper) · ink #0B0B0A · ink-2 #1E1E1C · ink-3 #2B2A27 · fog #B5B1A8 (text on ink) · signal #C8FF2E
Signal is a light, not paint: max ~5% of a view, never as text on paper; on paper give signal dots an ink ring.
Type: Anton caps (name/display/metrics), Instrument Serif italic (accent lines), Schibsted Grotesk (body 17 to 19 / 1.55), JetBrains Mono (labels 12 to 13, caps, +0.06em).
Name size clamp(128px, 27vw, 390px). Spacing 4px base: 4 8 16 24 32 48 64 96 120. Gutter 56 desktop / 20 mobile. Section padding 120 / 72. Radii pill 999, card 26, inner 14, device 34.
Device: matte ink body, 9px bezel, tilt rotateY(-24deg) rotateX(8deg), hard offset shadow + one soft shadow on paper.
Avatar sizes: hero 72vh (max 680), section 470, case study 200, dock 44 circle.

## Motion

- One animation system: GSAP (+ ScrollTrigger, Flip, SplitText). No Motion/Framer, no Lenis, no smooth-scroll hijacking.
- Durations: micro 200ms, UI 450ms, section 800ms. Ease cubic-bezier(.2,.8,.2,1) for entrances.
- Only the Layers chapters are scroll-driven; Layers is the only pinned section (desktop only). The hero has no scroll animation (from M4).
- Animate transform/opacity only. No CSS filters on scroll.
- Reduced motion: no scrub, no pin, no parallax, 150ms fades; Layers becomes three static steps. Content never waits on animation.
- React Bits pieces (copy in and trim, GSAP variants only): SplitText, CountUp, SpotlightCard, Magnet, DecryptedText (labels only).

## Content rules

- Every metric declares scope: platform-wide vs Harish's own work. Show platform reach on its own line ("Platform: 100K+ downloads · 5K DAU · 250+ locations").
- Client products use generic names (Pet Care Platform, Healthcare Records Platform) and RECREATED UI screens, labelled as such. Only the Notes app may use real screenshots.
- Learning stack (Python, FastAPI, AWS, Docker, Terraform, Java, Spring Boot) appears only in one "Currently learning" line.

## Featured projects (order)

1. Pet Care Platform (flagship, mobile + web + backend, L2 Tech Lead)
2. Healthcare Records Platform
3. Enterprise Product Naming Platform
4. Full Stack Notes App (personal, live)
5. Dynamic Form + PDF Platform
Internal AI tools / Claude Code usage goes in "How I Work", not a project card.

## Performance budget

LCP < 2s (mid Android, 4G), CLS < 0.05, INP < 200ms.
Initial JS: framework + at most 50KB gz of our own code, per page. `npm run budget` (in `npm run check` and CI) measures it after a build; "framework" is what Next loads for its built-in `_global-error` page (~171KB gz on Next 16.4 / React 19.3).
GSAP is never in the initial bundle: load it through `src/components/motion` (`useLazyGsap` with `load: "visible"` below the fold, `"idle"` above it; nav loads on idle/intent). Content never waits on it.
Server components by default, client islands only for hero, grid, nav. Client islands get content as props (lint blocks importing `@/content` there, which would ship zod). Avatar via next/image with `preload` (Next 16 replaced `priority`).

## Assets

- `public/avatars/hero-main-outline.webp`: hero avatar, transparent, 2 to 3px paper edge baked in (no CSS filter)
- `public/avatars/hero-main.png`: transparent master without edge
- `public/avatars/avatar-head.webp`: dock head, circle crop
- Still missing (optional): layers-pointing, case-pointing, path-laptop, contact-wave
