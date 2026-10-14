import { Display, Label, Section } from "@/components/ui";
import { projects } from "@/content";
import { WorkCard } from "./work-card";
import { WorkGrid } from "./work-grid";

/**
 * Bento placement by featured order (lg, 3 columns):
 *   Pet Care  Pet Care  Healthcare
 *   Pet Care  Pet Care  Naming
 *   Notes     Form+PDF  Form+PDF
 */
const placement: Record<string, string> = {
  "pet-care-platform": "md:col-span-2 lg:row-span-2",
  "dynamic-form-pdf-platform": "md:col-span-2",
};

export function WorkSection() {
  return (
    <Section id="work" signal="through" aria-labelledby="work-title">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Label className="text-muted">Selected work</Label>
          <Display id="work-title" className="mt-4">
            Work
          </Display>
        </div>
        <p className="max-w-[44ch] text-muted">
          Client products are shown with generic names and recreated screens. Every metric says
          whether it is the platform&rsquo;s reach or my own work.
        </p>
      </div>
      <div className="mt-12">
        <WorkGrid
          items={projects.map((p) => ({
            slug: p.slug,
            layers: p.layers,
            className: placement[p.slug] ?? "",
          }))}
        >
          {projects.map((p) => (
            <WorkCard key={p.slug} project={p} flagship={p.slug === "pet-care-platform"} />
          ))}
        </WorkGrid>
      </div>
    </Section>
  );
}
