import { Card } from "../ui/Card";
import { StatCard } from "../ui/StatCard";
import { COLORS, MOCK_APPOINTMENTS } from "../constants";

export default function Dashboard({ onNav, onView }) {
  const today = MOCK_APPOINTMENTS.filter(
    a => a.date === "2026-05-01" && a.status === "upcoming"
  );

  const upcoming = MOCK_APPOINTMENTS.filter(a => a.status === "upcoming");
  const completed = MOCK_APPOINTMENTS.filter(a => a.status === "completed");

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        Good morning, Ms. Garcia 👋
      </h1>

      <p style={{ color: COLORS.textMuted, marginBottom: 28 }}>
        Thursday, April 30, 2026 — Here's what's on your plate today.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard label="Today's Sessions" value={today.length} icon="📅" color={COLORS.accent} />
        <StatCard label="Upcoming" value={upcoming.length} icon="⏳" color={COLORS.blue} />
        <StatCard label="Completed" value={completed.length} icon="✅" color={COLORS.green} />
        <StatCard label="Students Helped" value={12} icon="🎓" color={COLORS.yellow} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ marginBottom: 18 }}>Today's Appointments</h3>

          {today.map(a => (
            <div
              key={a.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{a.student}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{a.topic}</div>
              </div>

              <button
                onClick={() => onView(a)}
                style={{
                  background: COLORS.accentLight,
                  color: COLORS.accent,
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                View
              </button>
            </div>
          ))}
        </Card>

        <Card>
          <h3>Quick Actions</h3>

          {[
            ["📅 Set Availability", "availability"],
            ["📋 Appointments", "appointments"],
            ["🗂️ History", "history"],
            ["🔔 Notifications", "notifications"],
          ].map(([label, page]) => (
            <button
              key={page}
              onClick={() => onNav(page)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: 10,
                borderRadius: 10,
                border: "none",
                background: "#F7F8FC",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </Card>
      </div>
    </div>
  );
}