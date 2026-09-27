import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social share image. Uses system serif fonts so it needs no network access at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf6f0",
          color: "#2a2623",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: "2px solid #e6ddd1",
            borderRadius: 24,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: "#a85d45", textTransform: "uppercase" }}>
          Made in India
        </div>
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 20, fontSize: 150, lineHeight: 1 }}>
          <span style={{ fontWeight: 700 }}>Lush</span>
          <span style={{ fontStyle: "italic", color: "#a85d45" }}>Aura</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 38, color: "#6f665e" }}>{siteConfig.tagline}</div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            gap: 20,
            fontSize: 22,
            color: "#2a2623",
            fontFamily: "sans-serif",
          }}
        >
          <span>Gift hampers</span>
          <span style={{ color: "#c98b7f" }}>·</span>
          <span>Personalised gifts</span>
          <span style={{ color: "#c98b7f" }}>·</span>
          <span>Clean beauty</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
