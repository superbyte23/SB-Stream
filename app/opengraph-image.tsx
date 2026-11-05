import { ImageResponse } from "next/og";

export const alt = "SBS — Stream Movies & TV Shows";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px",
          background:
            "radial-gradient(circle at 78% 18%, #7a1d3a 0%, #1b2a5a 44%, #0b0b0c 78%)",
          color: "#f5f5f5",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 12,
              background: "#9333ea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "13px solid transparent",
                borderBottom: "13px solid transparent",
                borderLeft: "21px solid #ffffff",
                marginLeft: 7,
              }}
            />
          </div>
          <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1.5, color: "#9333ea" }}>
            SBS
          </div>
        </div>
        <div
          style={{
            fontSize: 74,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: -2.5,
            maxWidth: 900,
          }}
        >
          Movies and series, one click away.
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#b9b9bd",
            maxWidth: 780,
          }}
        >
          A fast, cinematic catalogue.
        </div>
      </div>
    ),
    size,
  );
}
