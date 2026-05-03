import { useState } from "react";
import { COLORS, MOCK_APPOINTMENTS, DAYS, MONTHS } from "../constants";
import { Card } from "../components/Card";

export default function Schedule({ onView }) {
  const [month, setMonth] = useState(4); // May = index 4
  const [year] = useState(2026);
  const [selected, setSelected] = useState(1);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const dateStr = (d) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const apptForDay = (d) =>
    MOCK_APPOINTMENTS.filter((a) => a.date === dateStr(d) && a.status !== "cancelled");

  const selectedAppts = selected ? apptForDay(selected) : [];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>My Schedule</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }}>
        {/* Calendar */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button
              onClick={() => setMonth((m) => Math.max(0, m - 1))}
              style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}
            >
              ‹
            </button>
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={() => setMonth((m) => Math.min(11, m + 1))}
              style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}
            >
              ›
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 8 }}>
            {DAYS.map((d) => (
              <div
                key={d}
                style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, padding: "4px 0" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {rows.map((row, ri) => (
            <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 2 }}>
              {row.map((d, ci) => {
                const hasAppt = d && apptForDay(d).length > 0;
                const isSel = d === selected;
                return (
                  <div
                    key={ci}
                    onClick={() => d && setSelected(d)}
                    style={{
                      textAlign: "center",
                      padding: "8px 2px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: isSel ? 800 : 500,
                      background: isSel ? COLORS.accent : "transparent",
                      color: isSel ? "#fff" : d ? COLORS.text : "transparent",
                      cursor: d ? "pointer" : "default",
                      position: "relative",
                    }}
                  >
                    {d}
                    {hasAppt && !isSel && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 2,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: COLORS.accent,
                          display: "block",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </Card>

        {/* Appointments for selected day */}
        <Card>
          <h3 style={{ margin: "0 0 16px", fontWeight: 700 }}>
            {selected ? `Appointments — May ${selected}` : "Select a date"}
          </h3>

          {selectedAppts.length === 0 ? (
            <p style={{ color: COLORS.textMuted }}>No appointments on this day.</p>
          ) : (
            selectedAppts.map((a) => (
              <div
                key={a.id}
                style={{ background: COLORS.bg, borderRadius: 12, padding: 16, marginBottom: 12 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{a.student}</div>
                    <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{a.topic}</div>
                    <div style={{ fontSize: 13, color: COLORS.accent, marginTop: 4, fontWeight: 600 }}>{a.time}</div>
                  </div>
                  <button
                    onClick={() => onView(a)}
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
                    Details
                  </button>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
