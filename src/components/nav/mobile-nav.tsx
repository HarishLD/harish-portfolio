"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { type Gsap, loadGsap, useMotion } from "@/components/motion";
import { buttonClasses } from "@/components/ui";
import type { NavData } from "./types";

/**
 * Mobile and tablet navigation (below lg): a slim top bar with a menu button
 * that opens a full-screen menu. Uses a native modal <dialog> for focus
 * trapping, Escape, inert background and focus return.
 * GSAP loads on intent (pointer down or focus on the button). If it hasn't
 * arrived by the time of the click, the menu simply opens without animation.
 */
export function MobileNav({ data }: { data: NavData }) {
  const motion = useMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const gsapRef = useRef<Gsap | null>(null);
  const [open, setOpen] = useState(false);

  function preload() {
    if (gsapRef.current) return;
    void loadGsap().then((gsap) => {
      gsapRef.current = gsap;
    });
  }

  function openMenu() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    preload();
    dialog.showModal();
    setOpen(true);
    const gsap = gsapRef.current;
    if (!gsap) return;
    gsap.fromTo(
      dialog,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: motion.duration.ui, ease: motion.ease },
    );
    if (!motion.reduced) {
      gsap.fromTo(
        dialog.querySelectorAll("[data-menu-item]"),
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: motion.duration.section,
          ease: motion.ease,
          stagger: 0.05,
          delay: 0.05,
        },
      );
    }
  }

  function closeMenu() {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    const gsap = gsapRef.current;
    if (!gsap) {
      dialog.close();
      return;
    }
    gsap.to(dialog, {
      autoAlpha: 0,
      duration: motion.reduced ? motion.duration.ui : motion.duration.micro,
      ease: motion.ease,
      onComplete: () => {
        dialog.close();
        gsap.set(dialog, { clearProps: "opacity,visibility" });
      },
    });
  }

  return (
    <div className="lg:hidden">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-paper px-5">
        <Link href="/#top" className="font-display text-2xl uppercase">
          {data.name}
        </Link>
        <button
          type="button"
          onClick={openMenu}
          onPointerDown={preload}
          onFocus={preload}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="site-menu"
          className={buttonClasses({ variant: "primary", size: "sm" })}
        >
          Menu
        </button>
      </header>

      <dialog
        ref={dialogRef}
        id="site-menu"
        aria-label="Menu"
        onCancel={(e) => {
          e.preventDefault();
          closeMenu();
        }}
        onClose={() => setOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 text-paper backdrop:bg-ink"
      >
        <div className="flex min-h-full flex-col px-5 pb-8">
          <div className="flex h-16 items-center justify-between">
            <span className="font-display text-2xl uppercase">{data.name}</span>
            <button
              type="button"
              onClick={closeMenu}
              className={buttonClasses({ variant: "ghost", size: "sm" })}
            >
              Close
            </button>
          </div>

          <nav aria-label="Menu" className="flex flex-1 flex-col justify-center py-10">
            <ul className="flex flex-col gap-1">
              {data.items.map((item) => (
                <li key={item.href} data-menu-item="">
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block font-display text-[clamp(3.25rem,15vw,6rem)] leading-[1.02] uppercase hover:text-signal focus-visible:text-signal focus-visible:outline-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div data-menu-item="" className="flex flex-col gap-6">
            <Link
              href={data.contactHref}
              onClick={closeMenu}
              className={buttonClasses({ variant: "signal", size: "lg" })}
            >
              Let&rsquo;s talk
            </Link>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-label text-fog uppercase">
              <li>
                <a
                  href={`mailto:${data.email}`}
                  className="hover:text-paper focus-visible:outline-paper"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paper focus-visible:outline-paper"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paper focus-visible:outline-paper"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </dialog>
    </div>
  );
}
