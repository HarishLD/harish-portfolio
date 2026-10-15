import { Display, Label, Section } from "@/components/ui";
import { layerChapters } from "@/content";
import { ChapterText } from "./chapter-text";
import { LayersIsland } from "./layers-island";
import { LogoList, LogoOrbit } from "./logos";

/**
 * Layers: Mobile → Web → Backend. Chapter text and logos are rendered here on
 * the server (logo SVG paths ship as HTML, not JS) and handed to the island,
 * which arranges them as static steps, swipe cards or the pinned morph.
 */
export function LayersSection() {
  return (
    <Section id="layers" tone="ink" signal="through" aria-labelledby="layers-title">
      <Label className="text-fog">Mobile · Web · Backend</Label>
      <Display id="layers-title" className="mt-4">
        Layers
      </Display>
      <p className="mt-6 max-w-[52ch] text-fog">
        One engineer across the stack: the same product, seen from each layer I build.
      </p>
      <div className="mt-12 lg:mt-16">
        <LayersIsland
          skipTo="path"
          chapters={layerChapters.map((c, i) => ({
            id: c.id,
            title: c.title,
            text: <ChapterText chapter={c} index={i} />,
            logos: <LogoList chapter={c} className="flex flex-wrap justify-center gap-4" />,
            orbitLogos: <LogoOrbit chapter={c} />,
          }))}
        />
      </div>
    </Section>
  );
}
