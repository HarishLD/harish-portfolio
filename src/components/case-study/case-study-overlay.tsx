"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { loadGsap, useMotion } from "@/components/motion";
import { buttonClasses } from "@/components/ui";

/**
 * Overlay shell for an intercepted case study. A native modal <dialog> gives
 * focus trapping, Escape and an inert page behind it. Closing goes back in
 * history, so the URL returns to where the visitor was. On a direct visit or
 * refresh the full page renders instead (no interception).
 */
export function CaseStudyOverlay({ children, titleId }: { children: ReactNode; titleId: string }) {
  const router = useRouter();
  const motion = useMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Layout effect: open before paint. Next keeps visited routes alive inside a
  // hidden <Activity>; its cleanup runs when this overlay is hidden (Back,
  // Escape, a link elsewhere), so the modal closes and the page stops being inert.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    let cancelled = false;
    void loadGsap().then((gsap) => {
      if (cancelled || !panelRef.current) return;
      gsap.fromTo(panelRef.current, motion.reduced ? { opacity: 0 } : { opacity: 0, y: 48 }, {
        opacity: 1,
        y: 0,
        duration: motion.duration.ui,
        ease: motion.ease,
      });
    });
    return () => {
      cancelled = true;
      if (dialog.open) dialog.close();
    };
  }, [children, motion]);

  function close() {
    router.back();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        // A click on the dialog itself (not the panel) is a click on the backdrop area.
        if (e.target === dialogRef.current) close();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-ink/70 p-0 backdrop:bg-transparent md:px-6 md:pt-10"
    >
      <div
        ref={panelRef}
        className="relative mx-auto min-h-full w-full max-w-(--container-site) rounded-t-card bg-paper px-5 pt-20 pb-16 md:px-14 md:pt-24"
      >
        <button
          type="button"
          onClick={close}
          className={`${buttonClasses({ variant: "secondary", size: "sm" })} absolute top-5 right-5 md:top-8 md:right-8`}
        >
          Close<span className="sr-only"> case study</span>
        </button>
        {children}
      </div>
    </dialog>
  );
}
