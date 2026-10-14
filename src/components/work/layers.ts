import type { Layer } from "@/content";

export const layerLabel: Record<Layer, string> = {
  mobile: "Mobile",
  web: "Web",
  backend: "Backend",
};

export const FILTERS = ["all", "mobile", "web", "backend"] as const;
export type Filter = (typeof FILTERS)[number];

export function matches(layers: readonly Layer[], filter: Filter) {
  return filter === "all" || layers.includes(filter);
}
