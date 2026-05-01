import { useState } from "react";
import { Card } from "../ui/Card";
import { COLORS, DAYS, MONTHS, MOCK_APPOINTMENTS } from "../constants";

export default function Schedule({ onView }) {
  const [month, setMonth] = useState(4);
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

  const dateStr = d =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(
      2,
      "0"
    )}`;

  const apptForDay = d =>
    MOCK_APPOINTMENTS.filter(a => a.date === dateStr(d));

  const selectedAppts = selected ? apptForDay(selected) : [];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>My Schedule</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setMonth(m => m - 1)}>‹</button>
            <strong>{MONTHS[month]} {year}</strong>
            <button onClick={() => setMonth(m => m + 1)}>›</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 12 }}>
                {d}
              </div>
            ))}
          </div>

          {rows.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
              {row.map((d, idx) => (
                <div
                  key={idx}
                  onClick={() => d && setSelected(d)}
                  style={{
                    textAlign: "center",
                    padding: 8,
                    cursor: d ? "pointer" : "default",
                    background: selected === d ? COLORS.accent : "transparent",
                    color: selected === d ? "#fff" : COLORS.text,
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          ))}
        </Card>

        <Card>
          <h3>Appointments</h3>

          {selectedAppts.map(a => (
            <div key={a.id} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>{a.student}</div>
              <div style={{ fontSize: 13 }}>{a.topic}</div>

              <button onClick={() => onView(a)}>Details</button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}