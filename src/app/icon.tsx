import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#141414",
          display: "flex",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: 3, top: 3, width: 11, height: 11, background: "#E8EBE6" }} />
        <div style={{ position: "absolute", left: 18, top: 3, width: 11, height: 11, background: "#E8EBE6" }} />
        <div style={{ position: "absolute", left: 3, top: 18, width: 11, height: 11, background: "#E8EBE6" }} />
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 16,
            width: 12,
            height: 12,
            background: "#F0C43C",
            transform: "rotate(45deg)",
          }}
        />
      </div>
    ),
    size,
  );
}
