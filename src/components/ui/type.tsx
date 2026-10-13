import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cx } from "@/lib/cx";

type Polymorphic<T extends ElementType> = { as?: T } & Omit<ComponentPropsWithoutRef<T>, "as">;

/** JetBrains Mono caps label, 12 to 13px, +0.06em. */
export function Label<T extends ElementType = "p">({ as, className, ...props }: Polymorphic<T>) {
  const Tag: ElementType = as ?? "p";
  return (
    <Tag
      className={cx("font-mono text-label uppercase md:text-[0.8125rem]", className)}
      {...props}
    />
  );
}

const displaySizes = {
  name: "text-name",
  xl: "text-[clamp(4rem,11vw,10rem)] leading-[0.86]",
  lg: "text-[clamp(3rem,7vw,6rem)] leading-[0.9]",
  md: "text-[clamp(2rem,4vw,3.5rem)] leading-[0.95]",
} as const;

/** Anton caps for the name, section titles and metrics. */
export function Display<T extends ElementType = "h2">({
  as,
  size = "lg",
  className,
  ...props
}: Polymorphic<T> & { size?: keyof typeof displaySizes }) {
  const Tag: ElementType = as ?? "h2";
  return <Tag className={cx("font-display uppercase", displaySizes[size], className)} {...props} />;
}

/** Instrument Serif italic accent line. */
export function Accent<T extends ElementType = "span">({
  as,
  className,
  ...props
}: Polymorphic<T>) {
  const Tag: ElementType = as ?? "span";
  return <Tag className={cx("font-serif italic", className)} {...props} />;
}
