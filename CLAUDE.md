@AGENTS.md

# Harish portfolio: project brief

Personal portfolio for Harish Doraiswamy. Read this file fully before any change.
Source of truth for all claims: `docs/resume-facts.md` (from the resume). Never invent metrics, roles or features.

## Working agreement

- Build milestone by milestone. One branch per milestone (`m1-foundations`, ...), PR to `main`, Vercel preview for review.
- Stop at the end of each milestone and wait for Harish's approval before starting the next.
- Run `npm run check` (and `npm run e2e` when UI changes) before saying a milestone is done.
- No secrets in Git. Public env only (`NEXT_PUBLIC_SITE_URL`).
- Style for replies to Harish: direct, short, practical. No em dashes.

## Status

- [x] M0 Setup (Next.js 16, React 19, TS strict, Tailwind v4 tokens, self-hosted fonts, Vitest, Playwright + axe, Lighthouse CI, GitHub Actions)
- [ ] M1 Foundations: primitives, typed content layer + zod schema, nav (top bar → floating dock on desktop, full-screen menu on mobile), motion provider with reduced-motion
- [ ] M2 Hero: Name Wall static first (fast LCP), then fake-3D morph device + signal line on scroll
- [ ] M3 Work: bento grid, layer filters, recreated screens, case studies (`/work/[slug]` pages + overlay)
- [ ] M4 Layers (pinned desktop, swipe mobile), Path timeline, How I Work
- [ ] M5 Contact, resume download, SEO (metadata, OG, JSON-LD, sitemap), switch robots to index
- [ ] M6 QA and polish

## Positioning

"Software Engineer" across mobile, web and backend. Not "mobile developer", not "AI engineer".
Location-neutral: no city on the site. Contact = email, LinkedIn, GitHub, resume download. No phone number anywhere (the public resume PDF must be a phone-free version).

## Design direction (locked)

Name: "Signal". Ink & Signal restraint + cinematic hero. Must not feel like a film template or generic dev portfolio. No film vocabulary (scene, take, REC).

- Hero "Name Wall": oversized HARISH (Anton), avatar standing in front of the letters, fake-3D device beside it, serif line "builds across every layer.", CTAs "See the work" (primary) + "Download resume". Name, role, CTA readable instantly.
- Morph: device goes phone → browser → server on scroll. Fake 3D with CSS/SVG transforms first; true 3D only if this lacks impact (desktop only).
- Signal: the lime line/dot that threads sections and ends as the contact CTA.
- Nav: desktop top bar morphs into floating bottom dock (avatar head + links + "Let's talk"). Mobile: menu button → full-screen menu with huge Anton links.
- Projects: interactive bento, filters All/Mobile/Web/Backend, recreated screens, real metrics, expandable case studies.
- Avatar placement: bottom-anchored or seated on a line, overlapping type for depth. Missing poses render nothing (no placeholders in production).

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
- Only the hero morph and the Layers chapters are scroll-scrubbed; Layers is the only pinned section.
- Animate transform/opacity only. No CSS filters on scroll.
- Reduced motion: no scrub, no parallax, 150ms fades; morph becomes three tappable states. Content never waits on animation.
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

LCP < 2s (mid Android, 4G), CLS < 0.05, INP < 200ms, initial JS ~150KB gz. Server components by default, client islands only for hero, grid, nav. Avatar via next/image with priority.

## Assets

- `public/avatars/hero-main-outline.webp`: hero avatar, transparent, 2 to 3px paper edge baked in (no CSS filter)
- `public/avatars/hero-main.png`: transparent master without edge
- `public/avatars/avatar-head.webp`: dock head, circle crop
- Still missing (optional): layers-pointing, case-pointing, path-laptop, contact-wave
