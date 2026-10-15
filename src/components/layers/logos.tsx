import type { LayerChapter } from "@/content";
import { cx } from "@/lib/cx";
import { type IconSlug, iconPaths } from "./icon-paths";

type Logo = LayerChapter["logos"][number];

/**
 * One tech mark: an inline simple-icons path in a tile, or a text label when
 * simple-icons has no mark (Salesforce, WebSockets). Monochrome on ink; the
 * chapter's own layer mark (`highlight`) is the only lime one.
 */
export function LogoTile({ logo, highlight }: { logo: Logo; highlight?: boolean }) {
  const path = logo.icon ? iconPaths[logo.icon as IconSlug] : undefined;
  return (
    <span className="flex flex-col items-center gap-2">
      <span
        className={cx(
          "flex h-14 items-center justify-center rounded-inner border bg-ink-2",
          path ? "w-14" : "px-3",
          highlight ? "border-signal/60 text-signal" : "border-ink-3 text-paper",
        )}
      >
        {path ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 fill-current">
            <path d={path} />
          </svg>
        ) : (
          <span aria-hidden="true" className="font-mono text-[0.75rem] uppercase">
            {logo.name}
          </span>
        )}
      </span>
      <span className={cx("font-mono text-[0.6875rem] text-fog uppercase", !path && "sr-only")}>
        {logo.name}
      </span>
    </span>
  );
}

/**
 * Five slots around the device for the pinned layout, as % of an orbit box
 * that is ~1.76x the device: outside the device on every side.
 */
const ORBIT_SLOTS = [
  { left: "6%", top: "24%" },
  { left: "94%", top: "18%" },
  { left: "2%", top: "66%" },
  { left: "97%", top: "62%" },
  { left: "50%", top: "99%" },
];

export function LogoOrbit({ chapter }: { chapter: LayerChapter }) {
  return (
    <ul aria-label={`${chapter.title} stack`} className="relative size-full">
      {chapter.logos.map((logo, i) => (
        <li
          key={logo.name}
          data-logo=""
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={ORBIT_SLOTS[i]}
        >
          <LogoTile logo={logo} highlight={i === 0} />
        </li>
      ))}
    </ul>
  );
}

export function LogoList({ chapter, className }: { chapter: LayerChapter; className?: string }) {
  return (
    <ul aria-label={`${chapter.title} stack`} className={className}>
      {chapter.logos.map((logo, i) => (
        <li key={logo.name} data-logo="">
          <LogoTile logo={logo} highlight={i === 0} />
        </li>
      ))}
    </ul>
  );
}
