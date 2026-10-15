import type { Metadata } from "next";
import { Accent, ButtonLink, Container, Label, SignalDot } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** 404 for unmatched URLs and unknown case studies (the proxy rewrites those here). */
export default function NotFound() {
  return (
    <Container className="flex min-h-[calc(100svh-4rem)] flex-col justify-center gap-6 py-18 lg:min-h-[calc(100svh-5rem)]">
      <div className="flex items-center gap-3">
        <SignalDot />
        <Label className="text-muted">Error 404</Label>
      </div>
      <h1 className="font-display text-name leading-[0.82] uppercase">404</h1>
      <Accent as="p" className="text-[clamp(2rem,3.4vw,3rem)] leading-none">
        this page isn&rsquo;t on any layer.
      </Accent>
      <p className="max-w-[46ch] text-muted">
        The link may be out of date, or the page has moved. The work and everything else are one
        click away.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <ButtonLink href="/" size="lg">
          Back home
        </ButtonLink>
        <ButtonLink href="/#work" variant="secondary" size="lg">
          See the work
        </ButtonLink>
      </div>
    </Container>
  );
}
