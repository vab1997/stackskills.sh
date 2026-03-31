import { getBaseURL } from "@/lib/get-base-url";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "StackSkills — Agent Skills for Your Stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const fontData = await fetch(
    new URL("/fonts/jersey-25.woff", getBaseURL()),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        background: "#000",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "80px",
      }}
    >
      <div style={{ position: "relative", display: "flex" }}>
        <div
          style={{
            position: "absolute",
            top: 10,
            fontSize: 140,
            fontWeight: 400,
            fontFamily: "Jersey 25",
            color: "rgba(0,0,0,0.6)",
            WebkitTextStroke: "1px rgba(255,255,255,0.7)",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          StackSkills
        </div>
        <div
          style={{
            position: "relative",
            fontSize: 140,
            fontWeight: 400,
            fontFamily: "Jersey 25",
            color: "#fff",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          StackSkills
        </div>
      </div>
      <div
        style={{
          fontSize: 42,
          color: "rgba(255,255,255,0.55)",
          fontFamily: "monospace",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Agent skills for your exact stack
      </div>
    </div>,

    {
      ...size,
      fonts: [
        {
          name: "Jersey 25",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
