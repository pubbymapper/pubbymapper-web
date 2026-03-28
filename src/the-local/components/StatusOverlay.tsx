import type { FC } from "react";

interface StatusOverlayProps {
  loading: boolean;
  error: string | null;
  count: number;
}

const StatusOverlay: FC<StatusOverlayProps> = ({ loading, error, count }) => (
  <div
    style={{
      position: "absolute",
      bottom: 12,
      left: 12,
      zIndex: 1000,
      background: "rgba(255, 249, 229, 0.92)",
      backdropFilter: "blur(4px)",
      border: "1px solid #e2d9b8",
      borderRadius: 8,
      padding: "6px 14px",
      fontSize: 13,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#333",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    {loading && (
      <span
        className="the-local-spinner"
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: "50%",
          border: "2px solid #0d9488",
          borderTopColor: "transparent",
        }}
      />
    )}
    {error ? (
      <span style={{ color: "#b91c1c" }}>Error: {error}</span>
    ) : (
      <span>
        <strong>{count}</strong> pub{count !== 1 ? "s" : ""} in view
      </span>
    )}
  </div>
);

export default StatusOverlay;
