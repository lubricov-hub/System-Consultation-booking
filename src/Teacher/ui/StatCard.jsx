import { COLORS } from "../constants";

export default function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{
      background: COLORS.white,
      borderRadius: 16,
      border: `1px solid ${COLORS.border}`,
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: 16
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: color + "22",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24
      }}>
        {icon}
      </div>

      <div>
        <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
        <div style={{ fontSize: 13, color: "#6B7280" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color }}>{sub}</div>}
      </div>
    </div>
  );
}