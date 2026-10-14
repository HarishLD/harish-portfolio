import { cx } from "@/lib/cx";
import { BrowserFrame, PhoneFrame, T } from "./frames";

/** Recreated records view (mobile): records, sharing with a caregiver, next appointment. */
export function HealthRecordsPhone({ className }: { className?: string }) {
  const records = [
    { name: "Blood panel", meta: "PDF · 2 pages", shared: true },
    { name: "Vaccination record", meta: "PDF · 1 page", shared: false },
    { name: "Physio notes", meta: "Note · Mar", shared: true },
  ];
  return (
    <PhoneFrame className={className}>
      <div className="flex flex-1 flex-col gap-[4cqw] px-[6cqw] pb-[6cqw]">
        <div className="flex items-center justify-between">
          <T s={6.5} className="font-display uppercase">
            Records
          </T>
          <span className="rounded-pill bg-paper-2 px-[3cqw] py-[1.2cqw]">
            <T s={3}>Caregiver view</T>
          </span>
        </div>
        <div className="flex gap-[2cqw]">
          {["Records", "Visits", "Wellness"].map((t, i) => (
            <span
              key={t}
              className={cx(
                "rounded-pill px-[3.5cqw] py-[1.8cqw]",
                i === 0 ? "bg-ink text-paper" : "border border-line",
              )}
            >
              <T s={3.4}>{t}</T>
            </span>
          ))}
        </div>
        {records.map((r) => (
          <div
            key={r.name}
            className="flex items-center gap-[3.5cqw] rounded-[4cqw] border border-line p-[3.5cqw]"
          >
            <span className="flex aspect-[3/4] w-[9cqw] items-end justify-center rounded-[1.6cqw] bg-paper-2 pb-[1cqw]">
              <span className="h-[1cqw] w-[5cqw] rounded-pill bg-line" />
            </span>
            <div className="flex-1">
              <T s={4}>{r.name}</T>
              <T s={3.2} className="text-muted">
                {r.meta}
              </T>
            </div>
            {r.shared && (
              <T s={3} className="text-muted">
                Shared
              </T>
            )}
          </div>
        ))}
        <div className="mt-auto rounded-[4cqw] bg-ink p-[4cqw] text-paper">
          <T s={3.2} className="text-fog">
            Next appointment
          </T>
          <div className="mt-[1.5cqw] flex items-center justify-between">
            <T s={4.4}>Thu 14 · 10:30</T>
            <span className="size-[2.4cqw] rounded-pill bg-signal" />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

/** Recreated naming workspace (web): filters on the left, a long virtualized list of suggestions. */
export function NamingBrowser({ className }: { className?: string }) {
  const names = [
    "Northline Pro",
    "Brightwell",
    "Trueform Max",
    "Clearpath One",
    "Evenkeel",
    "Stonebridge Lite",
    "Harborview",
    "Keystone Air",
  ];
  return (
    <BrowserFrame url="naming / workspace" className={className}>
      <div className="grid size-full grid-cols-[28%_1fr]">
        <div className="flex flex-col gap-[1.6cqw] border-r border-line p-[2cqw]">
          <T s={1.5} className="font-mono text-muted uppercase">
            Business type
          </T>
          <span className="rounded-[0.8cqw] border border-line px-[1.2cqw] py-[1cqw]">
            <T s={1.7}>Home appliances</T>
          </span>
          <T s={1.5} className="mt-[0.6cqw] font-mono text-muted uppercase">
            Attributes
          </T>
          <div className="flex flex-wrap gap-[0.8cqw]">
            {["compact", "smart", "quiet", "premium"].map((a, i) => (
              <span
                key={a}
                className={cx(
                  "rounded-pill px-[1.2cqw] py-[0.6cqw]",
                  i < 2 ? "bg-ink text-paper" : "border border-line",
                )}
              >
                <T s={1.5}>{a}</T>
              </span>
            ))}
          </div>
        </div>
        <div className="flex min-h-0 flex-col gap-[1.2cqw] p-[2cqw]">
          <div className="flex items-center gap-[1cqw] rounded-pill border border-line px-[1.6cqw] py-[0.9cqw]">
            <T s={1.7} className="text-muted">
              Filter suggestions…
            </T>
            <T s={1.5} className="ml-auto font-mono text-muted">
              1,000+
            </T>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {names.map((n, i) => (
              <div
                key={n}
                className="flex items-center justify-between border-b border-line py-[1cqw]"
              >
                <T s={1.9} className={i === 1 ? "font-medium" : undefined}>
                  {n}
                </T>
                <span className="flex items-center gap-[0.8cqw]">
                  {i === 1 && (
                    <span className="size-[1cqw] rounded-pill bg-signal ring-1 ring-ink" />
                  )}
                  <T s={1.4} className="font-mono text-muted">
                    {["smart", "compact", "quiet"][i % 3]}
                  </T>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/** Recreated notes app (web): tags, filtered search, note cards. */
export function NotesBrowser({ className }: { className?: string }) {
  const notes = [
    { title: "Sprint retro", body: "Keep PRs small, pair on the flaky test", tags: ["work"] },
    { title: "Prisma indexes", body: "Composite index for tag + updatedAt", tags: ["work", "db"] },
    { title: "Reading list", body: "Designing Data-Intensive Applications", tags: ["ideas"] },
    { title: "Release checklist", body: "Run Lighthouse, check a11y, tag", tags: ["work"] },
  ];
  return (
    <BrowserFrame url="notes / tag:work" className={className}>
      <div className="grid size-full grid-cols-[24%_1fr]">
        <div className="flex flex-col gap-[1.2cqw] border-r border-line p-[2cqw]">
          <T s={2.4} className="font-display uppercase">
            Notes
          </T>
          {["All notes", "#work", "#db", "#ideas"].map((t, i) => (
            <span
              key={t}
              className={cx(
                "rounded-[0.8cqw] px-[1.2cqw] py-[0.8cqw]",
                i === 1 && "bg-ink text-paper",
              )}
            >
              <T s={1.7}>{t}</T>
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-[1.4cqw] p-[2cqw]">
          <div className="flex items-center rounded-pill border border-line px-[1.6cqw] py-[0.9cqw]">
            <T s={1.7} className="text-muted">
              tag:work prisma
            </T>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-[1.4cqw]">
            {notes.map((n) => (
              <div
                key={n.title}
                className="flex flex-col gap-[0.8cqw] rounded-[1.2cqw] border border-line p-[1.6cqw]"
              >
                <T s={1.9} className="font-medium">
                  {n.title}
                </T>
                <T s={1.6} className="text-muted">
                  {n.body}
                </T>
                <div className="mt-auto flex gap-[0.6cqw]">
                  {n.tags.map((t) => (
                    <span key={t} className="rounded-pill bg-paper-2 px-[1cqw] py-[0.4cqw]">
                      <T s={1.4} className="font-mono">
                        #{t}
                      </T>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/** Recreated form + PDF engine (web): 5-step form with validation, live 6-page PDF preview. */
export function FormPdfBrowser({ className }: { className?: string }) {
  return (
    <BrowserFrame url="forms / new" className={className}>
      <div className="grid size-full grid-cols-[1fr_34%]">
        <div className="flex flex-col gap-[1.6cqw] p-[2.4cqw]">
          <div className="flex items-center gap-[0.8cqw]">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="flex flex-1 items-center gap-[0.8cqw]">
                <span
                  className={cx(
                    "flex size-[3.2cqw] shrink-0 items-center justify-center rounded-pill",
                    n < 3
                      ? "bg-ink text-paper"
                      : n === 3
                        ? "ring-2 ring-ink"
                        : "border border-line text-muted",
                  )}
                >
                  <T s={1.5}>{n}</T>
                </span>
                {n < 5 && <span className={cx("h-px flex-1", n < 3 ? "bg-ink" : "bg-line")} />}
              </span>
            ))}
          </div>
          <T s={2.4} className="font-display uppercase">
            Step 3 · Details
          </T>
          {[
            { label: "Full name", value: "Alex Morgan", ok: true },
            { label: "Reference number", value: "AB-20", error: "Use 6 characters, e.g. AB-204" },
            { label: "Start date", value: "14 / 10 / 2026", ok: true },
          ].map((f) => (
            <div key={f.label} className="flex flex-col gap-[0.5cqw]">
              <T s={1.5} className="text-muted">
                {f.label}
              </T>
              <span
                className={cx(
                  "rounded-[0.8cqw] px-[1.2cqw] py-[0.9cqw]",
                  f.error ? "ring-2 ring-ink" : "border border-line",
                )}
              >
                <T s={1.8}>{f.value}</T>
              </span>
              {f.error && (
                <T s={1.4} className="font-mono">
                  {f.error}
                </T>
              )}
            </div>
          ))}
          <span className="mt-auto self-end rounded-pill bg-ink px-[2.4cqw] py-[1cqw] text-paper">
            <T s={1.7}>Next step</T>
          </span>
        </div>
        <div className="flex flex-col gap-[1.2cqw] bg-paper-2 p-[2cqw]">
          <T s={1.5} className="font-mono text-muted uppercase">
            PDF preview · 6 pages
          </T>
          <div className="relative flex-1">
            {[2, 1, 0].map((i) => (
              <span
                key={i}
                className="absolute inset-x-[8%] flex flex-col gap-[0.8cqw] rounded-[0.6cqw] bg-paper p-[1.4cqw] shadow-[0.2rem_0.25rem_0_var(--color-line)]"
                style={{
                  top: `${i * 6}%`,
                  bottom: `${(2 - i) * 6}%`,
                  transform: `translateX(${i * 4}%)`,
                }}
              >
                <span className="h-[1.2cqw] w-[60%] rounded-pill bg-ink" />
                {[80, 70, 90, 55].map((w) => (
                  <span
                    key={w}
                    className="h-[0.7cqw] rounded-pill bg-line"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
