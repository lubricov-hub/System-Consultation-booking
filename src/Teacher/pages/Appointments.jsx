import { useState } from "react";
import { COLORS, MOCK_APPOINTMENTS } from "../constants";
import { Card } from "../components/Card";
import AppointmentRow from "../components/AppointmentRow";

export default function Appointments({ onView }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_APPOINTMENTS.filter((a) => {
    const matchFilter = filter === "all" || a.status === filter;
    const matchSearch =
      a.student.toLowerCase().includes(search.toLowerCase()) ||
      a.topic.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Appointment Management</h1>

      {/* Filters */}
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
        {["all", "upcoming", "completed", "cancelled"].map((f) => (
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

      {/* Table */}
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 32, textAlign: "center", color: COLORS.textMuted }}>
                  No appointments found.
                </td>
              </tr>
            ) : (
              filtered.map((a) => <AppointmentRow key={a.id} appt={a} onView={onView} />)
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
