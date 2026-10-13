import { site } from "@/lib/site";

const swatches = [
  { name: "paper", className: "bg-paper border border-line" },
  { name: "ink", className: "bg-ink" },
  { name: "signal", className: "bg-signal" },
] as const;

/**
 * M0 placeholder: proves fonts, tokens and the toolchain work end to end.
 * Replaced by the real home page from M1 onwards.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-(--container-site) flex-col justify-between gap-16 px-5 py-10 md:px-14 md:py-14">
      <p className="font-mono text-xs tracking-[0.06em] text-muted uppercase">
        {site.role} · setup preview (M0)
      </p>

      <div className="flex flex-col gap-6">
        <h1 className="font-display text-[clamp(6rem,27vw,24rem)] leading-[0.82] uppercase">
          {site.shortName}
        </h1>
        <p className="font-serif text-[clamp(2rem,3.8vw,3.4rem)] leading-none italic">
          builds across every layer.
        </p>
      </div>

      <ul className="flex gap-3" aria-label="Color tokens">
        {swatches.map((s) => (
          <li key={s.name} className="flex flex-col gap-2">
            <span className={`block size-14 rounded-inner ${s.className}`} aria-hidden="true" />
            <span className="font-mono text-xs text-muted">{s.name}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
