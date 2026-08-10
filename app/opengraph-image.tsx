import { ImageResponse } from "next/og";

export const alt = "Santosh Kumar — Software Engineer focused on backend systems and applied AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: "#090A0C", color: "#F0EEE8", width: "100%", height: "100%", display: "flex", padding: "72px", flexDirection: "column", justifyContent: "space-between", fontFamily: "sans-serif", borderTop: "10px solid #E5B92F" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 18, letterSpacing: 3, color: "#E5B92F" }}><span>WAYNE ARCHIVE / SK-04</span><span>COIMBATORE · INDIA</span></div>
      <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: 96, fontWeight: 700, letterSpacing: -6, lineHeight: 0.92 }}>hi, santosh here.</span><span style={{ marginTop: 32, maxWidth: 900, fontSize: 34, lineHeight: 1.18, color: "#C5C2BA" }}>Software engineer building dependable backend and applied-AI products.</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "monospace", fontSize: 17, color: "#6FCF8C" }}><span style={{ width: 11, height: 11, borderRadius: 99, background: "#6FCF8C" }} /><span>OPEN TO WORK</span></div>
    </div>,
    size,
  );
}
