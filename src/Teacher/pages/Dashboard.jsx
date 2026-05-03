import { COLORS, MOCK_APPOINTMENTS } from "../constants";
import { Card, StatCard } from "../components/Card";

export default function Dashboard({ onNav, onView }) {
  const today = MOCK_APPOINTMENTS.filter(
    (a) => a.date === "2026-05-01" && a.status === "upcoming"
  );
  const upcoming = MOCK_APPOINTMENTS.filter((a) => a.status === "upcoming");
  const completed = MOCK_APPOINTMENTS.filter((a) => a.status === "completed");

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        Good morning, Ms. Garcia 👋
      </h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 28, fontSize: 15 }}>
        Thursday, April 30, 2026 — Here's what's on your plate today.
      </p>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Today's Sessions" value={today.length} icon="📅" color={COLORS.accent} sub="+2 from yesterday" />
        <StatCard label="Upcoming" value={upcoming.length} icon="⏳" color={COLORS.blue} />
        <StatCard label="Completed" value={completed.length} icon="✅" color={COLORS.green} sub="This month" />
        <StatCard label="Students Helped" value={12} icon="🎓" color={COLORS.yellow} sub="This week" />
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Today's appointments */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontWeight: 700 }}>Today's Appointments</h3>
            <button
              onClick={() => onNav("schedule")}
              style={{ background: "none", border: "none", color: COLORS.accent, fontWeight: 600, cursor: "pointer", fontSize: 13 }}
            >
              View all →
            </button>
          </div>

          {today.length === 0 ? (
            <p style={{ color: COLORS.textMuted }}>No appointments today.</p>
          ) : (
            today.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: COLORS.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}
                  >
                    {a.student[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.student}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>{a.topic}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: COLORS.textMuted }}>{a.time}</span>
                  <button
                    onClick={() => onView(a)}
                    style={{
                      background: COLORS.accentLight,
                      color: COLORS.accent,
                      border: "none",
                      borderRadius: 8,
                      padding: "5px 12px",
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 style={{ margin: "0 0 16px", fontWeight: 700 }}>Quick Actions</h3>
          {[
            { label: "📅  Set Availability", page: "availability" },
            { label: "📋  All Appointments", page: "appointments" },
            { label: "🗂️  View History", page: "history" },
            { label: "🔔  Notifications", page: "notifications" },
          ].map(({ label, page }) => (
            <button
              key={page}
              onClick={() => onNav(page)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: COLORS.bg,
                border: "none",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 10,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                color: COLORS.text,
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
