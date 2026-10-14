import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Flat device frames for recreated screens. Everything inside scales with
 * container query units (cqw), so one screen design works at card size and
 * at case-study size.
 */

// The outer element is the size container; everything inside (including the
// frame's own radius and bezel) is sized in cqw relative to it.
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("@container", className)}>
      <div className="aspect-[9/19] rounded-[13cqw] bg-ink p-[3.2cqw] shadow-[0.6rem_0.7rem_0_var(--color-line)]">
        <div className="relative size-full overflow-hidden rounded-[10cqw] bg-paper text-ink">
          <span className="absolute top-[2.5cqw] left-1/2 h-[4cqw] w-[28cqw] -translate-x-1/2 rounded-pill bg-ink" />
          <div className="flex size-full flex-col pt-[10cqw]">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function BrowserFrame({
  children,
  url,
  className,
}: {
  children: ReactNode;
  url: string;
  className?: string;
}) {
  return (
    <div className={cx("@container", className)}>
      <div className="aspect-[16/10] rounded-[2.4cqw] bg-ink p-[0.9cqw] shadow-[0.6rem_0.7rem_0_var(--color-line)]">
        <div className="flex size-full flex-col overflow-hidden rounded-[1.6cqw] bg-paper text-ink">
          <div className="flex h-[6.5cqw] shrink-0 items-center gap-[0.9cqw] border-b border-line bg-paper-2 px-[1.8cqw]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-[1.2cqw] rounded-pill bg-line" />
            ))}
            <span className="ml-[2cqw] flex h-[3.6cqw] w-[40%] items-center rounded-pill bg-paper px-[1.6cqw] font-mono text-[1.5cqw] text-muted">
              {url}
            </span>
          </div>
          <div className="min-h-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Small text sized in container units. `s` is the size in cqw. */
export function T({
  s = 4,
  className,
  children,
}: {
  s?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cx("block leading-tight", className)} style={{ fontSize: `${s}cqw` }}>
      {children}
    </span>
  );
}
