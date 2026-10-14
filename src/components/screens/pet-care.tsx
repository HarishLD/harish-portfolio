import { cx } from "@/lib/cx";
import { BrowserFrame, PhoneFrame, T } from "./frames";

/** Recreated booking flow (mobile): pick a day, a service and a free slot. */
export function PetBookingPhone({ className }: { className?: string }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const slots = ["09:00", "09:30", "10:30", "11:00", "13:30", "14:00", "15:30", "16:00"];
  return (
    <PhoneFrame className={className}>
      <div className="flex flex-1 flex-col gap-[4cqw] px-[6cqw] pb-[6cqw]">
        <T s={6.5} className="font-display uppercase">
          Book a visit
        </T>
        <div className="flex gap-[2cqw]">
          {days.map((d, i) => (
            <span
              key={d}
              className={cx(
                "flex flex-1 flex-col items-center rounded-[4cqw] py-[2.5cqw]",
                i === 2 ? "bg-ink text-paper" : "bg-paper-2",
              )}
            >
              <T s={3.2}>{d}</T>
              <T s={5} className="font-medium">
                {12 + i}
              </T>
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-[4cqw] border border-line px-[4cqw] py-[3cqw]">
          <T s={4}>Grooming · 60 min</T>
          <T s={3.4} className="text-muted">
            Change
          </T>
        </div>
        <div className="grid grid-cols-2 gap-[2.5cqw]">
          {slots.map((t, i) => (
            <span
              key={t}
              className={cx(
                "relative flex items-center justify-center rounded-[3.5cqw] py-[3cqw]",
                i === 2 && "bg-ink text-paper",
                i === 4 && "bg-paper-2 text-muted line-through",
                i !== 2 && i !== 4 && "border border-line",
              )}
            >
              <T s={4}>{t}</T>
              {i === 2 && (
                <span className="absolute top-[1.8cqw] right-[2.2cqw] size-[2cqw] rounded-pill bg-signal" />
              )}
            </span>
          ))}
        </div>
        <span className="mt-auto flex items-center justify-center rounded-pill bg-ink py-[3.6cqw] text-paper">
          <T s={4.2}>Confirm 10:30</T>
        </span>
      </div>
    </PhoneFrame>
  );
}

/** Recreated location schedule (web): bookings on a day timeline with an overlap flagged. */
export function PetScheduleBrowser({ className }: { className?: string }) {
  const rows = [
    {
      room: "Room 1",
      items: [
        { from: 0, to: 2, label: "Bath · Max" },
        { from: 3, to: 5, label: "Groom · Luna" },
      ],
    },
    {
      room: "Room 2",
      items: [
        { from: 1, to: 3, label: "Groom · Bella" },
        { from: 2.5, to: 4, label: "Nails · Coco", clash: true },
      ],
    },
    {
      room: "Room 3",
      items: [
        { from: 0.5, to: 2.5, label: "Daycare · Milo" },
        { from: 4, to: 6, label: "Bath · Rocky" },
      ],
    },
  ];
  const hours = ["9", "10", "11", "12", "1", "2"];
  return (
    <BrowserFrame url="bookings / today" className={className}>
      <div className="flex size-full flex-col gap-[1.6cqw] p-[2.4cqw]">
        <div className="flex items-baseline justify-between">
          <T s={2.6} className="font-display uppercase">
            Today
          </T>
          <T s={1.5} className="font-mono text-muted uppercase">
            Synced with CRM · 2 min ago
          </T>
        </div>
        <div className="grid grid-cols-[10cqw_1fr] gap-y-[1.2cqw]">
          <span />
          <div className="grid grid-cols-6">
            {hours.map((h) => (
              <T key={h} s={1.4} className="font-mono text-muted">
                {h}
              </T>
            ))}
          </div>
          {rows.map((r) => (
            <div key={r.room} className="contents">
              <T s={1.6} className="self-center">
                {r.room}
              </T>
              <div className="relative h-[6cqw] rounded-[1cqw] bg-paper-2">
                {r.items.map((it) => (
                  <span
                    key={it.label}
                    className={cx(
                      "absolute inset-y-[0.6cqw] flex items-center rounded-[0.8cqw] px-[0.8cqw]",
                      it.clash ? "bg-paper ring-2 ring-ink" : "bg-ink text-paper",
                    )}
                    style={{
                      left: `${(it.from / 6) * 100}%`,
                      width: `${((it.to - it.from) / 6) * 100}%`,
                    }}
                  >
                    <T s={1.3} className="truncate">
                      {it.label}
                    </T>
                    {it.clash && (
                      <span className="ml-auto size-[1.1cqw] shrink-0 rounded-pill bg-signal ring-1 ring-ink" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-[1cqw] rounded-[1cqw] border border-line px-[1.6cqw] py-[1.2cqw]">
          <span className="size-[1.1cqw] rounded-pill bg-signal ring-1 ring-ink" />
          <T s={1.5}>Overlap detected in Room 2 · 11:30 to 12:00</T>
        </div>
      </div>
    </BrowserFrame>
  );
}
