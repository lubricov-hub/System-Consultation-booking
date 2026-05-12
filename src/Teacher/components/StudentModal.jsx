import { useState } from "react";
import { COLORS } from "../constants";
import Badge from "./Badge";
import { db } from "../../Firebase.js";
import { ref, update } from "firebase/database";

export default function StudentModal({ appt, onClose, onStatusChange }) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  if (!appt) return null;

  async function handleStatusUpdate(newStatus) {
    setUpdating(true);
    setError("");
    try {
      await update(ref(db, `appointments/${appt.id}`), { status: newStatus });
      onStatusChange?.(appt.id, newStatus);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  const isPending   = appt.status === "pending";
  const isConfirmed = appt.status === "confirmed";
  const isCancelled = appt.status === "cancelled";
  const isCompleted = appt.status === "completed";

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
              width: 56, height: 56,
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
            {(appt.studentName || "?")[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{appt.studentName}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{appt.studentEmail}</div>
          </div>
        </div>

        {/* Details */}
        {[
          ["📅 Date",       appt.date],
          ["⏰ Time",       appt.time],
          ["📌 Topic",      appt.topic],
          ["🪪 Student ID", appt.studentID || "—"],
          ["🎓 Year",       appt.yearLevel || "—"],
          ["🏫 Section",    appt.section   || "—"],
          ["📝 Notes",      appt.notes     || "No notes provided."],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
            <span style={{ minWidth: 120, fontWeight: 600, fontSize: 13, color: COLORS.textMuted }}>{label}</span>
            <span style={{ fontSize: 14, color: COLORS.text }}>{val}</span>
          </div>
        ))}

        <div style={{ marginTop: 8 }}>
          <Badge status={appt.status} />
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: "red", fontSize: 13, marginTop: 12 }}>{error}</p>
        )}

        {/* ── Actions ── */}

        {/* CANCELLED — read-only banner */}
        {isCancelled && (
          <div
            style={{
              marginTop: 24,
              background: COLORS.redLight,
              borderRadius: 10,
              padding: "12px 0",
              textAlign: "center",
              color: COLORS.red,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            This appointment has been cancelled.
          </div>
        )}

        {/* COMPLETED — read-only banner */}
        {isCompleted && (
          <div
            style={{
              marginTop: 24,
              background: COLORS.greenLight,
              borderRadius: 10,
              padding: "12px 0",
              textAlign: "center",
              color: COLORS.green,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            ✔ This appointment has been completed.
          </div>
        )}

        {/* PENDING — Confirm + Cancel */}
        {isPending && (
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button
              disabled={updating}
              onClick={() => handleStatusUpdate("confirmed")}
              style={{
                flex: 1,
                background: updating ? "#e2e8f0" : COLORS.greenLight,
                color: updating ? COLORS.textMuted : COLORS.green,
                border: "none",
                borderRadius: 10,
                padding: "11px 0",
                fontWeight: 700,
                fontSize: 14,
                cursor: updating ? "not-allowed" : "pointer",
              }}
            >
              {updating ? "Updating..." : "✔ Confirm"}
            </button>
            <button
              disabled={updating}
              onClick={() => handleStatusUpdate("cancelled")}
              style={{
                flex: 1,
                background: updating ? "#e2e8f0" : COLORS.redLight,
                color: updating ? COLORS.textMuted : COLORS.red,
                border: "none",
                borderRadius: 10,
                padding: "11px 0",
                fontWeight: 700,
                fontSize: 14,
                cursor: updating ? "not-allowed" : "pointer",
              }}
            >
              {updating ? "Updating..." : "✕ Cancel"}
            </button>
          </div>
        )}

        {/* CONFIRMED — Mark Completed + Cancel */}
        {isConfirmed && (
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button
              disabled={updating}
              onClick={() => handleStatusUpdate("completed")}
              style={{
                flex: 1,
                background: updating ? "#e2e8f0" : "#eff6ff",
                color: updating ? COLORS.textMuted : "#3b82f6",
                border: "none",
                borderRadius: 10,
                padding: "11px 0",
                fontWeight: 700,
                fontSize: 14,
                cursor: updating ? "not-allowed" : "pointer",
              }}
            >
              {updating ? "Updating..." : "✔ Mark as Completed"}
            </button>
            <button
              disabled={updating}
              onClick={() => handleStatusUpdate("cancelled")}
              style={{
                flex: 1,
                background: updating ? "#e2e8f0" : COLORS.redLight,
                color: updating ? COLORS.textMuted : COLORS.red,
                border: "none",
                borderRadius: 10,
                padding: "11px 0",
                fontWeight: 700,
                fontSize: 14,
                cursor: updating ? "not-allowed" : "pointer",
              }}
            >
              {updating ? "Updating..." : "✕ Cancel"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}