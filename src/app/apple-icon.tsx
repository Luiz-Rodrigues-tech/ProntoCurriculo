import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Document shape */}
        <div
          style={{
            width: 100,
            height: 124,
            background: "white",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "16px 14px",
            gap: 10,
            position: "relative",
          }}
        >
          {/* Folded corner */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 28,
              height: 28,
              background: "#c7d2fe",
              borderBottomLeftRadius: 10,
            }}
          />
          {/* Lines representing text */}
          <div style={{ width: 58, height: 8, background: "#4f46e5", borderRadius: 4, marginLeft: 4 }} />
          <div style={{ width: 48, height: 7, background: "#e0e7ff", borderRadius: 4, marginLeft: 4 }} />
          <div style={{ width: 58, height: 7, background: "#e0e7ff", borderRadius: 4, marginLeft: 4 }} />
          <div style={{ width: 42, height: 7, background: "#e0e7ff", borderRadius: 4, marginLeft: 4 }} />
          <div style={{ width: 54, height: 7, background: "#e0e7ff", borderRadius: 4, marginLeft: 4 }} />
          <div style={{ width: 36, height: 7, background: "#e0e7ff", borderRadius: 4, marginLeft: 4 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
