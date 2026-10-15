import { Display, Label, Section } from "@/components/ui";
import { profile } from "@/content";

/** How I Work: practices as numbered cards, then the one "Currently learning" line. */
export function HowSection() {
  return (
    <Section
      id="how-i-work"
      signal="through"
      aria-labelledby="how-title"
      className="border-t border-line"
    >
      <Label className="text-muted">Practice</Label>
      <Display id="how-title" className="mt-4">
        How I work
      </Display>
      <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profile.howIWork.map((item, i) => (
          <li key={item.title} className="flex flex-col gap-4 rounded-card bg-paper-2 p-6 md:p-8">
            <Label as="span" className="text-muted">
              {String(i + 1).padStart(2, "0")}
            </Label>
            <h3 className="font-display text-3xl uppercase">{item.title}</h3>
            <p className="text-muted">{item.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-12 text-muted">
        <span className="font-mono text-label uppercase">Currently learning</span>{" "}
        {profile.currentlyLearning.join(", ")}.
      </p>
    </Section>
  );
}
