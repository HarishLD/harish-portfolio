import { contactHref, nav, profile } from "@/content";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import type { NavData } from "./types";

const data: NavData = {
  items: nav,
  contactHref,
  name: profile.shortName,
  email: profile.email,
  linkedin: profile.links.linkedin,
  github: profile.links.github,
};

/** Site navigation. Each variant hides itself outside its breakpoint (lg = 1024px). */
export function SiteNav() {
  return (
    <>
      <DesktopNav data={data} />
      <MobileNav data={data} />
    </>
  );
}
