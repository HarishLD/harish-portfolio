"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

/**
 * The single GSAP entry point. Import gsap from here, never from "gsap" directly,
 * so plugins and the "signal" ease are registered exactly once.
 * Heavier plugins (ScrollTrigger, Flip, SplitText) are registered by the
 * islands that use them, keeping them out of pages that don't.
 */
gsap.registerPlugin(useGSAP, CustomEase);

/** cubic-bezier(.2,.8,.2,1): the entrance ease from the design spec. */
export const SIGNAL_EASE = "signal";
CustomEase.create(SIGNAL_EASE, "0.2,0.8,0.2,1");

export { gsap, useGSAP };
