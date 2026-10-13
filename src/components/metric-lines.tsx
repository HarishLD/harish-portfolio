import type { Metric } from "@/content";
import { Label } from "@/components/ui";

const scopeLabel = { platform: "Platform", own: "My work" } as const;

/**
 * Metrics grouped by scope, one line each, so platform reach is never read
 * as personal output: "Platform: 100K+ downloads · 5K daily active users".
 */
export function MetricLines({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="flex flex-col gap-2">
      {(["platform", "own"] as const).map((scope) => {
        const items = metrics.filter((m) => m.scope === scope);
        if (items.length === 0) return null;
        return (
          <div key={scope} className="flex flex-wrap items-baseline gap-x-2">
            <dt>
              <Label as="span" className="text-muted">
                {scopeLabel[scope]}:
              </Label>
            </dt>
            <dd>{items.map((m) => `${m.value} ${m.label}`).join(" · ")}</dd>
          </div>
        );
      })}
    </dl>
  );
}
