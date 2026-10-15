import { ImageResponse } from "next/og";
import { profile } from "@/content";
import { OG_COLORS as c, OG_SIZE, ogAssets } from "@/lib/og/assets";

export const alt = `${profile.name}, ${profile.role}: mobile, web and backend`;
export const size = OG_SIZE;
export const contentType = "image/png";

/** Home card: the Name Wall in miniature (ink, HARISH, avatar, one lime dot). */
export default async function Image() {
  const { fonts, avatarSrc } = await ogAssets();
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        background: c.ink,
        color: c.paper,
        fontFamily: "Anton",
        padding: 64,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 30,
          color: c.fog,
          letterSpacing: 2,
        }}
      >
        <div style={{ width: 18, height: 18, borderRadius: 999, background: c.signal }} />
        SOFTWARE ENGINEER · MOBILE · WEB · BACKEND
      </div>
      <div
        style={{
          position: "absolute",
          left: 56,
          bottom: 36,
          fontSize: 300,
          lineHeight: 0.82,
          letterSpacing: -2,
        }}
      >
        HARISH
      </div>
      <img
        src={avatarSrc}
        alt=""
        width={321}
        height={460}
        style={{ position: "absolute", right: 72, bottom: 0 }}
      />
    </div>,
    { ...size, fonts },
  );
}
