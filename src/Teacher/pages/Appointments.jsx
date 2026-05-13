import { useState, useEffect } from "react";
import { COLORS } from "../constants";
import { Card } from "../components/Card";
import { db } from "../../Firebase.js";
import { ref, get } from "firebase/database";

async function fetchAppointmentsForTeacher() {
  const uid = localStorage.getItem("uid");
  if (!uid) return [];

  const snap = await get(ref(db, "appointments"));
  if (!snap.exists()) return [];

  return Object.entries(snap.val())
    .map(([id, data]) => ({ id, ...data }))
    .filter((a) => a.teacherId === uid);
}

const STATUS_FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function Appointments({ onView }) {
  const [filter, setFilter]           = useState("all");
  const [search, setSearch]           = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchAppointmentsForTeacher();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleStatusChange(id, newStatus) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  }

  const filtered = appointments.filter((a) => {
    const matchFilter = filter === "all" || a.status === filter;
    const matchSearch =
      (a.studentName || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.topic || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // badge helper
  function statusStyle(status) {
    switch (status) {
      case "confirmed":  return { bg: "#eff6ff", color: "#3b82f6" };
      case "completed":  return { bg: "#f0fdf4", color: "#16a34a" };
      case "cancelled":  return { bg: "#fef2f2", color: "#ef4444" };
      default:           return { bg: "#fffbeb", color: "#d97706" }; // pending
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
        Appointment Management
      </h1>

      {/* ── Filters ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student or topic..."
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: `1px solid ${COLORS.border}`,
            fontSize: 14,
            width: 260,
            outline: "none",
          }}
        />
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              border: `1px solid ${filter === f ? COLORS.accent : COLORS.border}`,
              background: filter === f ? COLORS.accent : COLORS.white,
              color: filter === f ? "#fff" : COLORS.text,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: COLORS.bg }}>
              {["Student", "Topic", "Date", "Time", "Status", "Action"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 32, textAlign: "center", color: COLORS.textMuted }}>
                  Loading appointments...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} style={{ padding: 32, textAlign: "center", color: "red" }}>
                  {error}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 32, textAlign: "center", color: COLORS.textMuted }}>
                  No appointments found.
                </td>
              </tr>
            ) : (
              filtered.map((a) => {
                const { bg, color } = statusStyle(a.status);
                return (
                  <tr
                    key={a.id}
                    style={{ borderBottom: `1px solid ${COLORS.border}` }}
                  >
                    {/* Student */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 36, height: 36,
                            borderRadius: "50%",
                            background: COLORS.accent,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 14,
                            flexShrink: 0,
                          }}
                        >
                          {(a.studentName || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>
                            {a.studentName}
                          </div>
                          <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                            {a.studentEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Topic */}
                    <td style={{ padding: "14px 16px", fontSize: 13, color: COLORS.text }}>
                      {a.topic}
                    </td>

                    {/* Date */}
                    <td style={{ padding: "14px 16px", fontSize: 13, color: COLORS.text }}>
                      {a.date}
                    </td>

                    {/* Time */}
                    <td style={{ padding: "14px 16px", fontSize: 13, color: COLORS.text }}>
                      {a.time}
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          background: bg,
                          color,
                          borderRadius: 20,
                          padding: "4px 12px",
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}
                      >
                        {a.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => onView(a, handleStatusChange)}
                        style={{
                          background: COLORS.accentLight,
                          color: COLORS.accent,
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 14px",
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}