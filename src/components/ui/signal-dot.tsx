import { cx } from "@/lib/cx";

type SignalDotProps = {
  /** On paper the dot gets an ink ring so lime never sits bare on a light ground. */
  tone?: "paper" | "ink";
  size?: "sm" | "md";
  className?: string;
};

/** The lime signal: light, not paint. Decorative only. */
export function SignalDot({ tone = "paper", size = "md", className }: SignalDotProps) {
  return (
    <span
      aria-hidden="true"
      data-signal-dot=""
      className={cx(
        "inline-block shrink-0 rounded-pill bg-signal",
        size === "sm" ? "size-2" : "size-3",
        tone === "paper" && "ring-2 ring-ink",
        className,
      )}
    />
  );
}
