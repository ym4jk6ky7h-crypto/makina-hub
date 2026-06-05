import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background:
            "linear-gradient(135deg, #0a0a12 0%, #1a1028 40%, #0f0f18 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
              background: "linear-gradient(135deg, #ff2d6a, #8b5cf6, #22d3ee)",
            }}
          >
            MH
          </div>
          <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: -2 }}>
            {SITE_NAME}
          </span>
        </div>
        <p style={{ fontSize: 32, color: "rgba(255,255,255,0.75)", maxWidth: 900 }}>
          {SITE_TAGLINE}
        </p>
      </div>
    ),
    { ...size }
  );
}
