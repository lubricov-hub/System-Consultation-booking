import { COLORS } from "../constants";

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 18,
        border: `1px solid ${COLORS.border}`,
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color, sub }) {
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 18,
        border: `1px solid ${COLORS.border}`,
        padding: "22px 24px",
        display: "flex",
        alignItems: "center",
        gap: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 14,
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.text, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{label}</div>
        {sub && (
          <div style={{ fontSize: 12, color: color, marginTop: 2, fontWeight: 600 }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
const STATUS_MAP = {
  upcoming:  { bg: "#DBEAFE", text: "#3B82F6" },
  completed: { bg: "#DCFCE7", text: "#22C55E" },
  cancelled: { bg: "#FEE2E2", text: "#EF4444" },
  missed:    { bg: "#FEF3C7", text: "#F59E0B" },
};

export function Badge({ status }) {
  const c = STATUS_MAP[status] || STATUS_MAP.upcoming;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        padding: "3px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}
