import { Label } from "@/components/ui";
import type { LayerChapter } from "@/content";

export function ChapterText({ chapter, index }: { chapter: LayerChapter; index: number }) {
  return (
    <div className="flex flex-col gap-4">
      <Label as="p" className="text-fog">
        {String(index + 1).padStart(2, "0")} / 03
      </Label>
      <h3 className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] uppercase">
        {chapter.title}
      </h3>
      <p className="max-w-[38ch] text-fog">{chapter.body}</p>
      <p className="mt-2 flex flex-col gap-1 border-t border-ink-3 pt-4">
        <span className="mb-1 font-mono text-label text-fog uppercase">
          {chapter.proof.scope === "own" ? "My work" : "Platform"}
        </span>
        <span className="font-display text-[clamp(2.25rem,4vw,3.25rem)] leading-none">
          {chapter.proof.value}
        </span>
        <span className="max-w-[34ch]">{chapter.proof.label}</span>
      </p>
    </div>
  );
}
