# Resume facts (source of truth)

Extracted from Harish's resume. Anything shown on the site must trace back to a line here.
Phone number intentionally omitted: never publish it.

## Identity

- Harish Doraiswamy · Software Engineer
- Headline stack: React Native · React · TypeScript · Node.js · SQL
- Email: harishdoraiswamy1411@gmail.com
- LinkedIn: linkedin.com/in/harish-ld-7194081b8
- GitHub: github.com/HarishLD
- Available to join in 5 to 10 days; open to relocation and remote (site stays location-neutral)

## Summary

2.5 years building production React Native and React.js apps backed by Node.js REST APIs and SQL. Promoted to L2 Technical Lead for the full platform (technical delivery, code reviews, mentoring, post-launch hyper-care). Tests with Jest and React Testing Library; MVVM and Clean Architecture.

## Skills

- Languages: JavaScript (ES2020+), TypeScript, SQL, HTML5, CSS3
- Mobile & frontend: React Native, native modules (Kotlin, Swift), React.js, Next.js (App Router), Hooks, Redux, Redux-Saga, Material UI, responsive/mobile-first, WebView hybrid apps, accessibility
- Backend & APIs: Node.js, REST API design and integration, JWT, RBAC, API error handling
- Databases: PostgreSQL, SQL, Prisma, SQLite, Firebase, relational modelling, query optimization
- Integrations: Salesforce CRM, Stripe, App Store and Google Play IAP, WebSockets, video streaming
- Architecture: MVVM, Clean Architecture, repository pattern, DI, multi-tier, real-time data sync
- Performance: profiling, memoization, list virtualization, debouncing/throttling, exponential backoff
- Testing: Jest, RTL, Vitest, TDD, unit/component/integration, Lighthouse
- Security: HIPAA, encryption at rest and in transit, audit logging
- Monitoring: Sentry, Firebase Crashlytics, Firebase Analytics, Meta Ad Tracking
- Delivery: Git branching, CI/CD, Jira (Scrum, Kanban), Agile
- AI-assisted development: Claude Code, OpenAI GPT LLM integration
- Currently learning (not production): Python, FastAPI, AWS, Docker, Terraform, Java, Spring Boot

## Experience

AVASOFT Group, Feb 2024 to Jun 2026 (AVASOFT and zeb are entities of the same group serving different clients)

### Software Engineering Analyst · zeb · Apr 2026 to Jun 2026

**Enterprise Product Naming Platform** · React.js · client project, 2-week delivery
- Built an AI-assisted naming platform end to end: classifies products by business type and attributes (string tokenization, whitespace pattern segmentation), generating 1,000+ context-aware name suggestions in real time.
- Delivered UI, reusable component architecture, state management, REST integration; debounced filtering and list virtualization for large result lists.

**Dynamic Form and Document Generation Platform** · React.js · client project, 4-day delivery
- 5-step form workflow with field-level validation and a 6-page dynamic PDF generation engine, shipped in 4 days, on reusable form components and a templated HTML/CSS rendering layer.

### Software Engineer · AVASOFT · Aug 2024 to Apr 2026

**Pet Care and Wellness Platform** · React Native, React.js, Node.js, SQL, Salesforce
- Platform reach: 100K+ downloads, 5K DAU, 250+ franchise locations across the US and Canada. React Native apps + mobile-first React.js web version in WebView hybrid apps.
- Progressed from Phase 1 contributor to Phase 2 L2 Technical Lead for the entire platform.
- Built the booking and scheduling module end to end (mobile + web clients, Node.js REST APIs, SQL, Salesforce CRM) with interval overlap detection and real-time CRM sync: 50K+ weekday and 70K+ weekend bookings, ~2,000 concurrent peak users, under 100 sync failures per day.
- Node.js REST services and SQL for booking and payments; root-cause analysis, slow-query tuning, improved API error handling.
- Real-time video streaming and in-app payments: WebSocket connection management, exponential-backoff reconnection, adaptive bitrate for variable mobile networks.
- Standardized data fetching, retry and error recovery with reusable components, custom Hooks, Redux/Redux-Saga (MVVM).
- Sustained 60fps scrolling across mobile, tablet, desktop (profiling, leak detection, memoization, virtualization); led production cutover from the legacy app.
- As L2 Tech Lead: owned technical delivery with UX, Cloud, CRM, Security teams; code reviews, design discussions, mentoring.
- 2 months post-launch hyper-care: Sentry triage, 13 client user stories in one 4-week sprint, crash rate under 0.1%.
- Branch-based CI/CD (feature, release, hotfix) across dev, QA, integration, production; Jest and RTL tests on booking and payment flows.
- UML activity/class/sequence diagrams, functional requirements documents, cloud cost estimates, production readiness checklists; sprint planning with US and Canada stakeholders on Jira.

**Healthcare Records Platform** · React Native, React.js, REST APIs, Stripe, HIPAA · 400+ screens, launched May 2026
- Core engineer on a 5-member Agile team; React Native apps + React.js web version in WebView hybrid apps; MVVM, Clean Architecture, repository pattern, DI.
- Modules: medical records, appointment tracking, wellness logs, caregiver document sharing.
- RBAC for patients, caregivers, providers; JWT; encryption at rest; TLS in transit; audit logging.
- Stripe + App Store and Google Play IAP: subscription tiers, renewal tracking, grace periods.
- Native Kotlin and Swift calendar integrations; Firebase Analytics; Meta Ad Tracking.
- Cut load time from 4.2s to 1.8s (profiling, performance testing); crash incidents under 0.1% (Sentry, Crashlytics).

### Trainee Engineer, Mobility · AVASOFT · Feb 2024 to Aug 2024

- React Native and React.js screens and reusable components from requirements and designs (TypeScript, Redux, REST, Firebase, Git, Agile/Scrum).
- Debugged issues across development and staging under code-review practices.

### Internal AI Tools · AVASOFT and zeb

- Integrated OpenAI GPT responses into React.js interfaces for internal real-time tools; used Claude Code for code generation, test scaffolding, debugging, refactoring, reviewing every change before merge.

## Personal project

**Full Stack Notes App** · Next.js, React, TypeScript, PostgreSQL
- Live: notes-app-v19s-three.vercel.app · Source: github.com/HarishLD/notes_app
- Next.js App Router, strict TypeScript, JWT auth, tagging, filtered search on PostgreSQL via Prisma.
- TDD: 113 unit and integration tests (Vitest), Lighthouse accessibility 100, trade-offs documented in DECISIONS.md.

## Education

B.E. Computer Science and Engineering · Rajalakshmi Institute of Technology · May 2020 to Jun 2024 · CGPA 8.0

## Certifications and learning

- Full Stack Developer and AR/VR Engineer certifications (Naan Mudhalvan)
- Ran a 5-day Android and Web Development workshop for 300+ students
- In progress: Cloud and DevOps roadmap; Backend roadmap
