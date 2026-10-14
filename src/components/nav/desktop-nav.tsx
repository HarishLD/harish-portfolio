"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { type Flip, type Gsap, loadFlip, loadGsap, onIdle, useMotion } from "@/components/motion";
import { buttonClasses } from "@/components/ui";
import { cx } from "@/lib/cx";
import type { NavData } from "./types";

/**
 * Desktop navigation (lg and up). A top bar that morphs into a floating dock
 * once the first half-screen has scrolled past, and back again.
 * The morph is a GSAP Flip over transform/opacity: the ink plate behind the
 * dock and each link fly from their bar positions to their dock positions.
 * GSAP and Flip load on idle, so they never block first paint or hydration.
 */
export function DesktopNav({ data }: { data: NavData }) {
  const motion = useMotion();
  const navRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lib = useRef<{ gsap: Gsap; flip: Flip } | null>(null);
  const flipState = useRef<ReturnType<Flip["getState"]> | null>(null);
  const [docked, setDocked] = useState(false);
  const dockedRef = useRef(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    let cancelled = false;
    const load = async () => {
      lib.current ??= { gsap: await loadGsap(), flip: await loadFlip() };
      return lib.current;
    };
    const io = new IntersectionObserver(async ([entry]) => {
      // Below lg the sentinel is display:none (no offsetParent): the mobile nav is in charge.
      if (!entry || sentinel.offsetParent === null) return;
      const next = !entry.isIntersecting;
      if (next === dockedRef.current) return;
      dockedRef.current = next;
      const { flip } = await load();
      if (cancelled || !navRef.current) return;
      // Capture the current layout before React swaps bar/dock classes.
      flipState.current = flip.getState(navRef.current.querySelectorAll("[data-flip-id]"), {
        props: "opacity,color,backgroundColor",
      });
      setDocked(dockedRef.current);
    });
    io.observe(sentinel);
    const cancelIdle = onIdle(() => {
      if (sentinel.offsetParent !== null) void load();
    });
    return () => {
      cancelled = true;
      cancelIdle();
      io.disconnect();
    };
  }, []);

  // Layout effect: animate from the captured state before the browser paints the new layout.
  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    const nav = navRef.current;
    if (!state || !nav || !lib.current) return;
    const { gsap, flip } = lib.current;

    if (motion.reduced) {
      const tween = gsap.fromTo(
        nav,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: motion.duration.ui },
      );
      return () => {
        tween.progress(1).kill();
      };
    }
    const timeline = flip.from(state, {
      duration: motion.duration.ui,
      ease: motion.ease,
      prune: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: motion.duration.ui, ease: motion.ease },
        ),
    });
    return () => {
      timeline.progress(1).kill();
    };
  }, [docked, motion]);

  return (
    <div className="hidden lg:block">
      {/* Docks once this leaves the viewport. */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[50vh]"
      />
      <nav
        ref={navRef}
        aria-label="Primary"
        data-docked={docked}
        className={cx(
          "fixed inset-x-0 z-40",
          docked
            ? "pointer-events-none bottom-6 flex justify-center"
            : "top-0 border-b border-line bg-paper",
        )}
      >
        <div
          className={cx(
            "relative isolate flex items-center",
            docked
              ? "pointer-events-auto gap-1 p-2"
              : "mx-auto h-20 w-full max-w-(--container-site) gap-10 px-14",
          )}
        >
          <span
            aria-hidden="true"
            data-flip-id="plate"
            className={cx(
              "absolute inset-0 -z-10 rounded-pill bg-ink shadow-[0_12px_32px_-12px_rgb(11_11_10/0.45)]",
              docked ? "opacity-100" : "opacity-0",
            )}
          />

          {docked ? (
            <Link
              href="/#top"
              data-flip-id="avatar"
              aria-label="Back to top"
              className="mr-2 block size-11 overflow-hidden rounded-pill ring-1 ring-ink-3"
            >
              <Image
                src="/avatars/avatar-head.webp"
                alt=""
                width={44}
                height={44}
                className="size-11"
              />
            </Link>
          ) : (
            <Link href="/#top" data-flip-id="brand" className="font-display text-2xl uppercase">
              {data.name}
            </Link>
          )}

          <ul className={cx("flex items-center", docked ? "gap-1" : "ml-auto gap-2")}>
            {data.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-flip-id={`link-${item.href}`}
                  className={cx(
                    "inline-flex h-11 items-center rounded-pill px-4 font-medium transition-colors duration-(--duration-micro)",
                    docked ? "text-paper hover:bg-ink-3" : "text-ink hover:bg-paper-2",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={data.contactHref}
            data-flip-id="cta"
            className={cx(
              buttonClasses({ variant: docked ? "signal" : "primary", size: "sm" }),
              docked && "ml-1",
            )}
          >
            Let&rsquo;s talk
          </Link>
        </div>
      </nav>
    </div>
  );
}
