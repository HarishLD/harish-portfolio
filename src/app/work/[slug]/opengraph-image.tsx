import { ImageResponse } from "next/og";
import { getProject, profile, projects } from "@/content";
import { OG_COLORS as c, OG_SIZE, ogAssets } from "@/lib/og/assets";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Case study";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const layerLabel = { mobile: "MOBILE", web: "WEB", backend: "BACKEND" } as const;

/** Case study card: name, layers and the featured metric with its scope. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug) ?? projects[0]!;
  const metric = project.metrics.find((m) => m.featured);
  const { fonts } = await ogAssets();
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: c.paper,
        color: c.ink,
        fontFamily: "Anton",
        padding: 64,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 28,
          color: c.muted,
          letterSpacing: 2,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            background: c.signal,
            border: `3px solid ${c.ink}`,
          }}
        />
        CASE STUDY · {project.layers.map((l) => layerLabel[l]).join(" · ")}
      </div>
      <div style={{ display: "flex", fontSize: 100, lineHeight: 0.92, maxWidth: 1050 }}>
        {project.name.toUpperCase()}
      </div>
      {metric ? (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
          <div style={{ fontSize: 108, lineHeight: 0.9 }}>{metric.value}</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 28, color: c.muted }}>
            <div>{metric.short.toUpperCase()}</div>
            <div>{metric.scope === "own" ? "MY WORK" : "PLATFORM"}</div>
          </div>
        </div>
      ) : (
        <div />
      )}
      <div style={{ display: "flex", fontSize: 26, color: c.muted, letterSpacing: 2 }}>
        {profile.name.toUpperCase()} · {profile.role.toUpperCase()}
      </div>
    </div>,
    { ...size, fonts },
  );
}
