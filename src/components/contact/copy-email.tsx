"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui";

/** Copies the email address; announces the result. Without JS the mailto link next to it still works. */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2500);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={state === "copied" ? "Email address copied" : "Copy email address"}
        className={buttonClasses({ variant: "ghost", size: "sm" })}
      >
        {state === "copied" ? "Copied" : "Copy"}
      </button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? "Email address copied"
          : state === "failed"
            ? "Copy failed, select the address instead"
            : ""}
      </span>
    </>
  );
}
