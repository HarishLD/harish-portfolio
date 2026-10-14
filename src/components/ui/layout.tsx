import type { ComponentPropsWithoutRef } from "react";
import { SignalLine } from "@/components/signal/signal-line";
import { cx } from "@/lib/cx";

/** Max-width wrapper with the site gutter (20 mobile / 56 desktop). */
export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cx("mx-auto w-full max-w-(--container-site) px-5 md:px-14", className)}
      {...props}
    />
  );
}

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  id: string;
  tone?: "paper" | "ink";
  /** Carry the signal thread through this section ("end" finishes it at the contact CTA). */
  signal?: "through" | "end";
};

/** Page section: 72px vertical padding on mobile, 120px on desktop. */
export function Section({ tone = "paper", signal, className, children, ...props }: SectionProps) {
  return (
    <section
      data-tone={tone}
      className={cx(
        "relative py-18 md:py-30",
        tone === "ink" ? "bg-ink text-paper" : "bg-paper text-ink",
        className,
      )}
      {...props}
    >
      {signal && <SignalLine tone={tone} variant={signal} />}
      <Container>{children}</Container>
    </section>
  );
}

type CardProps = ComponentPropsWithoutRef<"div"> & { tone?: "paper" | "ink" };

export function Card({ tone = "paper", className, ...props }: CardProps) {
  return (
    <div
      className={cx(
        "rounded-card p-6 md:p-8",
        tone === "ink" ? "bg-ink-2 text-paper" : "border border-line bg-paper-2 text-ink",
        className,
      )}
      {...props}
    />
  );
}
