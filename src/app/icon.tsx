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
          borderRadius: 8,
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Document shape */}
        <div
          style={{
            width: 18,
            height: 22,
            background: "white",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "3px 3px",
            gap: 2,
            position: "relative",
          }}
        >
          {/* Folded corner */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 5,
              height: 5,
              background: "#c7d2fe",
              borderBottomLeftRadius: 2,
            }}
          />
          {/* Lines representing text */}
          <div style={{ width: 10, height: 1.5, background: "#4f46e5", borderRadius: 1, marginLeft: 2 }} />
          <div style={{ width: 8,  height: 1.5, background: "#c7d2fe", borderRadius: 1, marginLeft: 2 }} />
          <div style={{ width: 10, height: 1.5, background: "#c7d2fe", borderRadius: 1, marginLeft: 2 }} />
          <div style={{ width: 7,  height: 1.5, background: "#c7d2fe", borderRadius: 1, marginLeft: 2 }} />
          <div style={{ width: 9,  height: 1.5, background: "#c7d2fe", borderRadius: 1, marginLeft: 2 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
