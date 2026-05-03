import { COLORS } from "../constants";

export function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon, color, sub }) {
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: color + "22",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: color, marginTop: 2, fontWeight: 600 }}>{sub}</div>}
      </div>
    </div>
  );
}
