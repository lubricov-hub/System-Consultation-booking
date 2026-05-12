import { useEffect, useState } from "react";
import { COLORS } from "../constants";
import { Card, StatCard } from "../components/Card";
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

export default function Dashboard({ onNav, onView }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Load user display name
    const uid = localStorage.getItem("uid");
    if (uid) {
      get(ref(db, `users/${uid}`)).then((snap) => {
        if (snap.exists()) setUserName(snap.val().DisplayName || "");
      });
    }

    // Load appointments
    fetchAppointmentsForTeacher()
      .then(setAppointments)
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // ── Derived counts ──
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const todayDateStr = new Date().toDateString();

  const todayAppts = appointments.filter((a) => {
    if (!a.dateISO) return false;
    return new Date(a.dateISO).toDateString() === todayDateStr;
  });

  const pendingAppts   = appointments.filter((a) => a.status === "pending");
  const confirmedAppts = appointments.filter((a) => a.status === "confirmed");
  const completedAppts = appointments.filter((a) => a.status === "completed");

  // Unique students helped (by studentID or studentEmail as fallback)
  const uniqueStudents = new Set(
    appointments
      .filter((a) => a.status === "completed")
      .map((a) => a.studentID || a.studentEmail)
  ).size;

  // Greeting based on time of day
  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        {getGreeting()}, {userName} 👋
      </h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 28, fontSize: 15 }}>
        {todayStr} — Here's what's on your plate today.
      </p>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard
          label="Today's Sessions"
          value={loading ? "—" : todayAppts.length}
          icon="📅"
          color={COLORS.accent}
        />
        <StatCard
          label="Pending"
          value={loading ? "—" : pendingAppts.length}
          icon="⏳"
          color={COLORS.yellow}
        />
        <StatCard
          label="Confirmed"
          value={loading ? "—" : confirmedAppts.length}
          icon="✅"
          color={COLORS.blue}
        />
        <StatCard
          label="Completed"
          value={loading ? "—" : completedAppts.length}
          icon="🎓"
          color={COLORS.green}
          sub="All time"
        />
      </div>

      {/* ── Bottom row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>

        {/* Today's Appointments */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontWeight: 700 }}>Today's Appointments</h3>
            <button
              onClick={() => onNav("appointments")}
              style={{ background: "none", border: "none", color: COLORS.accent, fontWeight: 600, cursor: "pointer", fontSize: 13 }}
            >
              View all →
            </button>
          </div>

          {loading ? (
            <p style={{ color: COLORS.textMuted }}>Loading...</p>
          ) : todayAppts.length === 0 ? (
            <p style={{ color: COLORS.textMuted }}>No appointments today.</p>
          ) : (
            todayAppts.map((a) => (
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
                {/* Avatar + info */}
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      width: 38, height: 38,
                      borderRadius: "50%",
                      background: COLORS.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 15,
                    }}
                  >
                    {(a.studentName || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.studentName}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>{a.topic}</div>
                  </div>
                </div>

                {/* Time + View button */}
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
            { label: "🗂️  View History",     page: "history" },
            { label: "🔔  Notifications",    page: "notifications" },
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