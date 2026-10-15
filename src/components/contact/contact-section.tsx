import { Display, Label } from "@/components/ui";
import { profile } from "@/content";
import { cx } from "@/lib/cx";
import { getResumeHref } from "@/lib/resume";
import { site } from "@/lib/site";
import { CopyEmail } from "./copy-email";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/**
 * Contact: where the signal thread ends. The gutter line runs down from the
 * section top and turns into the lime "Email me" CTA (md and up). Two columns
 * from lg (heading, availability, CTA | links); stacked below. The part
 * of the vertical line above the section is clipped by the section.
 */
export function ContactSection() {
  const resumeHref = getResumeHref();
  const rowLink =
    "group flex items-baseline justify-between gap-4 border-t border-ink-3 py-5 transition-colors hover:text-signal focus-visible:outline-paper";

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-ink py-18 text-paper md:py-30"
    >
      <div className="mx-auto w-full max-w-(--container-site) px-5 md:px-14">
        <div className="lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <Label className="text-fog">Contact</Label>
            <Display id="contact-title" size="xl" className="mt-4">
              Let&rsquo;s talk
            </Display>
            <p className="mt-6 max-w-[48ch] text-fog">{profile.availability}</p>

            <div className="relative mt-12">
              {/* Signal thread: down the gutter, then into the CTA. */}
              <span
                aria-hidden="true"
                data-signal-line="contact"
                className="absolute inset-0 hidden md:block"
              >
                <span
                  data-signal-stroke=""
                  className="absolute bottom-1/2 -left-[29px] h-[200vh] w-0.5 origin-top bg-signal"
                />
                <span
                  data-signal-head=""
                  className="absolute top-1/2 -left-[29px] h-0.5 w-[29px] origin-left -translate-y-1/2 bg-signal"
                />
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="relative inline-flex h-16 items-center gap-4 rounded-pill bg-signal pr-8 pl-6 font-display text-3xl text-ink uppercase transition-colors duration-(--duration-micro) hover:bg-paper md:h-20 md:text-4xl"
              >
                <span aria-hidden="true" className="size-3 rounded-pill bg-ink" />
                Email me
                <span aria-hidden="true" className="font-sans text-2xl md:text-3xl">
                  →
                </span>
                <span className="sr-only">: {profile.email}</span>
              </a>
            </div>
          </div>

          <ul className="mt-16 max-w-3xl border-b border-ink-3 text-lg md:text-xl lg:mt-0">
            <li className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-3 py-5">
              <span className="flex flex-col gap-1">
                <Label as="span" className="text-fog">
                  Email
                </Label>
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all hover:text-signal focus-visible:outline-paper"
                >
                  {profile.email}
                </a>
              </span>
              <CopyEmail email={profile.email} />
            </li>
            <li>
              <a href={profile.links.linkedin} {...external} className={rowLink}>
                <span className="flex flex-col gap-1">
                  <Label as="span" className="text-fog">
                    LinkedIn
                  </Label>
                  <span>linkedin.com/in/harish-ld-7194081b8</span>
                </span>
                <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.links.github} {...external} className={rowLink}>
                <span className="flex flex-col gap-1">
                  <Label as="span" className="text-fog">
                    GitHub
                  </Label>
                  <span>github.com/HarishLD</span>
                </span>
                <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            {resumeHref && (
              <li>
                <a href={resumeHref} download className={cx(rowLink)}>
                  <span className="flex flex-col gap-1">
                    <Label as="span" className="text-fog">
                      Resume
                    </Label>
                    <span>Download PDF</span>
                  </span>
                  <span aria-hidden="true">↓</span>
                </a>
              </li>
            )}
          </ul>
        </div>

        <footer className="mt-20 flex flex-col gap-3 border-t border-ink-3 pt-6 font-mono text-label text-fog uppercase md:flex-row md:justify-between">
          <p>© 2026 {profile.name}</p>
          <p>
            Built with Next.js ·{" "}
            <a
              href={site.repo}
              {...external}
              className="underline-offset-4 hover:text-paper hover:underline focus-visible:outline-paper"
            >
              Source on GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}
