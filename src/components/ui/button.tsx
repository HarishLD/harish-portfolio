import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";

const variants = {
  /** Ink pill on paper. */
  primary: "bg-ink text-paper hover:bg-ink-3",
  /** Outline pill; works on paper. */
  secondary: "border border-ink/70 text-ink hover:bg-ink hover:text-paper",
  /** Lime pill for the one "Let's talk" action on ink. Never on paper. */
  signal: "bg-signal text-ink hover:bg-paper",
  /** Outline pill for use on ink. */
  ghost: "border border-fog/50 text-paper hover:border-paper",
} as const;

const sizes = {
  sm: "h-10 px-4 text-[0.9375rem]",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-[1.0625rem]",
} as const;

export type ButtonVariant = keyof typeof variants;

type Style = { variant?: ButtonVariant; size?: keyof typeof sizes };

export function buttonClasses({ variant = "primary", size = "md" }: Style = {}) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap",
    "transition-colors duration-(--duration-micro) ease-(--ease-out-signal)",
    variants[variant],
    sizes[size],
  );
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & Style;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cx(buttonClasses({ variant, size }), className)} {...props} />
  );
}

type ButtonLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> &
  Style & { href: string; children: ReactNode };

/**
 * Internal paths use next/link. External URLs open in a new tab;
 * mailto: and file downloads stay plain anchors.
 */
export function ButtonLink({ href, variant, size, className, ...props }: ButtonLinkProps) {
  const classes = cx(buttonClasses({ variant, size }), className);
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props} />
    );
  }
  if (href.startsWith("/") && !props.download) {
    return <Link href={href} className={classes} {...props} />;
  }
  return <a href={href} className={classes} {...props} />;
}
