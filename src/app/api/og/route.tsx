import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Kuber Property";
  const subtitle = searchParams.get("subtitle") || "Luxury Real Estate in Vadodara";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%)",
        }}
      >
        <div style={{ fontSize: 28, color: "#c9a227", marginBottom: 16 }}>KUBER PROPERTY</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "white", lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.7)", marginTop: 24 }}>{subtitle}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
