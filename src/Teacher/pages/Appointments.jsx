import { useState } from "react";
import { Card } from "../ui/Card";
import { MOCK_APPOINTMENTS } from "../constants";

export default function Appointments({ onView }) {
  const [filter, setFilter] = useState("all");

  const filtered = MOCK_APPOINTMENTS.filter(a =>
    filter === "all" ? true : a.status === filter
  );

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Appointments</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["all", "upcoming", "completed", "cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <Card>
        {filtered.map(a => (
          <div
            key={a.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 12,
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <strong>{a.student}</strong>
              <div>{a.topic}</div>
            </div>

            <button onClick={() => onView(a)}>View</button>
          </div>
        ))}
      </Card>
    </div>
  );
}