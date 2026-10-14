import { cx } from "@/lib/cx";

type SignalLineProps = {
  tone: "paper" | "ink";
  /**
   * "start": begins at the dot (hero CTAs) and runs to the section bottom.
   * "through": runs the full height. "end": stops at the dot (the contact CTA).
   */
  variant?: "start" | "through" | "end";
  className?: string;
};

/**
 * One segment of the signal thread: a line in the left gutter with a dot at
 * its head. Segments in consecutive sections join into one thread from the
 * hero to the contact CTA. Fully drawn in the HTML; SignalThread animates
 * each segment in as its section arrives. Desktop gutter only (md and up).
 *
 * Signal is a light: lime on ink, an ink line with a ringed lime dot on paper.
 */
export function SignalLine({ tone, variant = "through", className }: SignalLineProps) {
  return (
    <span
      aria-hidden="true"
      data-signal-line={variant}
      className={cx(
        "pointer-events-none absolute hidden w-0 md:block",
        variant === "start" ? "bottom-0 h-(--signal-start,6rem)" : "top-0",
        "left-[calc(max(0px,(100%-var(--container-site))/2)+28px)]",
        variant === "through" && "bottom-0",
        variant === "end" && "h-34",
        className,
      )}
    >
      <span
        data-signal-stroke=""
        className={cx(
          "absolute inset-y-0 -left-px w-0.5 origin-top",
          tone === "ink" ? "bg-signal" : "bg-ink",
        )}
      />
      <span
        data-signal-head=""
        className={cx(
          "absolute -left-1.5 size-3 rounded-pill bg-signal",
          variant === "end" ? "bottom-0" : "top-0",
          tone === "paper" && "ring-2 ring-ink",
        )}
      />
    </span>
  );
}
