import type { NavItem } from "@/content";

/**
 * Serializable nav data passed from the server. Client islands take this as a
 * prop instead of importing @/content, which would ship zod to the browser.
 */
export type NavData = {
  items: NavItem[];
  contactHref: string;
  name: string;
  email: string;
  linkedin: string;
  github: string;
};
