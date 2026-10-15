import { ImageResponse } from "next/og";
import { getProject, profile, projects } from "@/content";
import { OG_COLORS as c, OG_SIZE, ogFonts, ogImage } from "@/lib/og/assets";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Case study";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const layerLabel = { mobile: "MOBILE", web: "WEB", backend: "BACKEND" } as const;

/** Snapshot sizes (scripts/og-screens.mjs): phones 450x927, browsers 840x539. */
const PHONES = new Set(["pet-care-platform", "healthcare-records-platform"]);

/**
 * Case study card. Left: name, layers, featured metric with its scope (and
 * supporting note). Right: the project's recreated UI, labelled as such.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug) ?? projects[0]!;
  const metric = project.metrics.find((m) => m.featured);
  const phone = PHONES.has(project.slug);
  const [fonts, screen] = await Promise.all([ogFonts(), ogImage(`screens/${project.slug}.png`)]);
  const img = phone ? { width: 232, height: 478 } : { width: 470, height: 302 };

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: c.paper,
        color: c.ink,
        fontFamily: "Anton",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 640,
          padding: "56px 40px 56px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 24,
            color: c.muted,
            letterSpacing: 2,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: c.signal,
              border: `3px solid ${c.ink}`,
            }}
          />
          CASE STUDY · {project.layers.map((l) => layerLabel[l]).join(" · ")}
        </div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 0.94 }}>
          {project.name.toUpperCase()}
        </div>
        {metric ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
              <div style={{ fontSize: 92, lineHeight: 0.9 }}>{metric.value}</div>
              <div
                style={{ display: "flex", flexDirection: "column", fontSize: 24, color: c.muted }}
              >
                <div>{metric.short.toUpperCase()}</div>
                <div>{metric.scope === "own" ? "MY WORK" : "PLATFORM"}</div>
              </div>
            </div>
            {project.featuredNote ? (
              <div style={{ display: "flex", fontSize: 26, color: c.muted }}>
                {project.featuredNote.toUpperCase()}
              </div>
            ) : null}
          </div>
        ) : (
          <div />
        )}
        <div style={{ display: "flex", fontSize: 22, color: c.muted, letterSpacing: 2 }}>
          {profile.name.toUpperCase()} · {profile.role.toUpperCase()}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          width: 560,
          margin: "28px 28px 28px 0",
          borderRadius: 26,
          background: c.paper2,
          border: `2px solid ${c.line}`,
        }}
      >
        <div style={{ display: "flex", fontSize: 20, color: c.muted, letterSpacing: 3 }}>
          RECREATED UI
        </div>
        <img src={screen} alt="" width={img.width} height={img.height} />
      </div>
    </div>,
    { ...size, fonts },
  );
}
