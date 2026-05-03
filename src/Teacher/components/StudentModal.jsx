import { COLORS } from "../constants";
import Badge from "./Badge";

export default function StudentModal({ appt, onClose }) {
  if (!appt) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: COLORS.white,
          borderRadius: 20,
          padding: 36,
          width: 480,
          maxWidth: "95vw",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Student Details</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: COLORS.textMuted }}
          >
            ×
          </button>
        </div>

        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: COLORS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            {appt.student[0]}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{appt.student}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{appt.email}</div>
          </div>
        </div>

        {/* Details */}
        {[
          ["📅 Date", appt.date],
          ["⏰ Time", appt.time],
          ["📌 Topic", appt.topic],
          ["📞 Phone", appt.phone || "—"],
          ["📝 Notes", appt.notes || "No notes provided."],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
            <span style={{ minWidth: 120, fontWeight: 600, fontSize: 13, color: COLORS.textMuted }}>{label}</span>
            <span style={{ fontSize: 14, color: COLORS.text }}>{val}</span>
          </div>
        ))}

        <div style={{ marginTop: 8 }}>
          <Badge status={appt.status} />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            style={{
              flex: 1,
              background: COLORS.greenLight,
              color: COLORS.green,
              border: "none",
              borderRadius: 10,
              padding: "11px 0",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ✔ Confirm
          </button>
          <button
            style={{
              flex: 1,
              background: COLORS.redLight,
              color: COLORS.red,
              border: "none",
              borderRadius: 10,
              padding: "11px 0",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
