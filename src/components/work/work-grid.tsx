"use client";

import {
  Children,
  type PointerEvent,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { Layer } from "@/content";
import { type Flip, type Gsap, loadFlip, loadGsap, useMotion } from "@/components/motion";
import { cx } from "@/lib/cx";
import { FILTERS, type Filter, layerLabel, matches } from "./layers";

type Item = { slug: string; layers: Layer[]; className: string };

/**
 * Bento grid island. Cards arrive as server-rendered children (in `items`
 * order); this only adds the layer filter, the Flip re-layout and the
 * pointer spotlight. Without JS every card shows and links to its page.
 */
export function WorkGrid({ items, children }: { items: Item[]; children: ReactNode }) {
  const motion = useMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const listRef = useRef<HTMLUListElement>(null);
  const lib = useRef<{ gsap: Gsap; flip: Flip } | null>(null);
  const flipState = useRef<ReturnType<Flip["getState"]> | null>(null);
  const cards = Children.toArray(children);
  const count = items.filter((i) => matches(i.layers, filter)).length;

  // Flip is only needed once someone reaches for the filters.
  function preload() {
    if (lib.current || motion.reduced) return;
    void Promise.all([loadGsap(), loadFlip()]).then(([gsap, flip]) => {
      lib.current = { gsap, flip };
    });
  }

  function choose(next: Filter) {
    if (next === filter) return;
    if (lib.current && listRef.current && !motion.reduced) {
      flipState.current = lib.current.flip.getState(listRef.current.children);
    }
    setFilter(next);
  }

  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || !lib.current) return;
    const { flip, gsap } = lib.current;
    const tl = flip.from(state, {
      duration: motion.duration.ui,
      ease: motion.ease,
      nested: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: motion.duration.ui, ease: motion.ease },
        ),
    });
    return () => {
      tl.progress(1).kill();
    };
  }, [filter, motion]);

  function spotlight(e: PointerEvent<HTMLUListElement>) {
    if (motion.reduced || e.pointerType !== "mouse") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        role="group"
        aria-label="Filter projects by layer"
        className="flex flex-wrap gap-2"
        onPointerEnter={preload}
        onFocus={preload}
      >
        {FILTERS.map((f) => {
          const n = items.filter((i) => matches(i.layers, f)).length;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => choose(f)}
              className={cx(
                "inline-flex h-11 items-center gap-2 rounded-pill px-5 font-medium transition-colors duration-(--duration-micro)",
                filter === f ? "bg-ink text-paper" : "border border-ink/30 hover:border-ink",
              )}
            >
              {f === "all" ? "All" : layerLabel[f]}
              <span
                className={cx("font-mono text-label", filter === f ? "text-fog" : "text-muted")}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {`Showing ${count} ${count === 1 ? "project" : "projects"}${filter === "all" ? "" : ` with ${layerLabel[filter]}`}`}
      </p>

      <ul
        ref={listRef}
        className="grid grid-flow-row-dense gap-4 md:auto-rows-[34rem] md:grid-cols-2 lg:auto-rows-[36rem] lg:grid-cols-3 lg:gap-5"
        onPointerMove={spotlight}
      >
        {items.map((item, i) => (
          <li
            key={item.slug}
            data-flip-id={item.slug}
            hidden={!matches(item.layers, filter)}
            className={item.className}
          >
            {cards[i]}
          </li>
        ))}
      </ul>
    </div>
  );
}
