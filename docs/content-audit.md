# Content audit (M6)

Every claim the site makes, checked against `docs/resume-facts.md`. Line numbers refer to that file at the time of the audit (2026-10-15).

Automated guards (run in `npm run check`): metric values and Layers logo names must appear in resume-facts, no phone numbers, no city or "mobile developer"/"AI engineer" positioning, learning stack only in the "Currently learning" line, client projects use recreated screens and never link out, exactly one featured metric per project.

## Changed in this audit

| Where | Before | After | Why |
| --- | --- | --- | --- |
| Layers · Mobile | "profiled until they hold 60fps on real devices" | "profiled to sustain 60fps scrolling across mobile, tablet and desktop" | L57 says mobile, tablet, desktop; "real devices" wasn't stated |
| Layers · Backend | "WebSocket connections that recover on their own" | "…that reconnect with exponential backoff" | L55 wording |
| How I Work · Tested | "MVVM and Clean Architecture keep logic testable" | "on an MVVM and Clean Architecture codebase" | L17 states the architectures, not the outcome |

## Metrics (scope as shown on the site)

| Project | Value | Label | Scope | Source |
| --- | --- | --- | --- | --- |
| Pet Care | 100K+ | downloads | Platform | L51 |
| Pet Care | 5K | daily active users | Platform | L51 |
| Pet Care | 250+ | franchise locations | Platform | L51 |
| Pet Care | 50K+ / 70K+ | weekday / weekend bookings through the module I built | My work | L53 |
| Pet Care | ~2,000 | concurrent users at peak on booking | My work | L53 |
| Pet Care | <100 | CRM sync failures per day | My work | L53 |
| Pet Care | <0.1% | crash rate during the hyper-care I owned | My work | L59 (scope confirmed by Harish in M3 review) |
| Healthcare | 400+ | screens | Platform | L63 |
| Healthcare | 4.2s → 1.8s | load time | My work | L69 |
| Healthcare | <0.1% | crash incidents | Platform | L69 |
| Naming | 1,000+ | name suggestions in real time | My work | L42 |
| Notes | 113 | unit and integration tests | My work | L85 |
| Notes | 100 | Lighthouse accessibility | My work | L85 |
| Form + PDF | 4 days | from brief to shipped (featured) | My work | L45 to L46 |
| Form + PDF | 5 / 6 | step form / page PDF | My work | L46 |

Layers proof points reuse three of these (4.2s → 1.8s, 1,000+, 50K+), all "My work".

## Roles, dates, education

| Claim | Source |
| --- | --- |
| Software Engineering Analyst · zeb · Apr 2026 to Jun 2026 | L39 |
| Software Engineer · AVASOFT · Aug 2024 to Apr 2026 | L48 |
| Trainee Engineer, Mobility · AVASOFT · Feb 2024 to Aug 2024 | L71 |
| Promoted to L2 Technical Lead for the full Pet Care Platform | L52, L58 |
| B.E. Computer Science and Engineering · Rajalakshmi Institute of Technology · May 2020 to Jun 2024 · CGPA 8.0 | L89 |
| Full Stack Developer and AR/VR Engineer certifications (Naan Mudhalvan) | L93 |
| 5-day Android and Web Development workshop for 300+ students | L94 |
| Available to join in 5 to 10 days; open to remote and relocation | L13 (location-neutral) |

## Logos (Layers)

All names appear in resume-facts (skills L20 to L30, projects). React Native uses the React mark (simple-icons has no separate React Native mark); Salesforce and WebSockets are text labels (no simple-icons mark).

## Not claims (sample data)

Recreated screens (booking slots, schedule, records, naming list, notes, form) and the Layers server log use invented sample data and are labelled "Recreated UI · sample data" wherever they're presented as figures. The Layers device is decorative (`aria-hidden`).

## Open items for Harish

- `public/resume.pdf` added (2026-10-15): text checked, no phone number. Its header lists relocation cities (Bengaluru, Hyderabad); the site itself stays location-neutral.
- The footer's "Source on GitHub" link points to a private repo; make it public at launch or remove the link.
- Notes app screen is recreated; a real screenshot can replace it (the content rules allow real screenshots for Notes only).
