import { useState } from "react";
import { COLORS, MOCK_TEACHERS, MOCK_APPOINTMENTS } from "../constants";
import { Card, StatCard, Badge } from "../components/AdminUI";
import AddTeacherModal from "../components/AddTeacherModal";

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [showModal, setShowModal] = useState(false);

  // ── Derived stats from mock data ──────────────────────────────────────────
  const total       = MOCK_APPOINTMENTS.length;
  const upcoming    = MOCK_APPOINTMENTS.filter(a => a.status === "upcoming").length;
  const completed   = MOCK_APPOINTMENTS.filter(a => a.status === "completed").length;
  const missedOrCancelled = MOCK_APPOINTMENTS.filter(
    a => a.status === "missed" || a.status === "cancelled"
  ).length;

  // ── When a new teacher is created from the modal, append to list ──────────
  const handleTeacherAdded = (newTeacher) => {
    setTeachers(prev => [
      {
        uid:         newTeacher.uid,
        displayName: newTeacher.displayName,
        email:       newTeacher.email,
        department:  "—",
        teacherID:   "Pending",
        role:        "teacher",
        createdAt:   new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: COLORS.text, margin: 0 }}>
            Admin Dashboard
          </h1>
          <p style={{ color: COLORS.textMuted, marginTop: 6, fontSize: 14 }}>
            Overview of all teachers, appointments, and activity.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: COLORS.accent,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "12px 22px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 4px 18px rgba(108,99,255,0.28)",
            fontFamily: "inherit",
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          Add Teacher
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard
          label="Total Teachers"
          value={teachers.length}
          icon="🎓"
          color={COLORS.accent}
          sub="Registered"
        />
        <StatCard
          label="Total Appointments"
          value={total}
          icon="📋"
          color={COLORS.blue}
        />
        <StatCard
          label="Upcoming"
          value={upcoming}
          icon="⏳"
          color={COLORS.blue}
          sub="Scheduled"
        />
        <StatCard
          label="Completed"
          value={completed}
          icon="✅"
          color={COLORS.green}
          sub="This month"
        />
        <StatCard
          label="Missed / Cancelled"
          value={missedOrCancelled}
          icon="❌"
          color={COLORS.red}
          sub="Needs attention"
        />
      </div>

      {/* ── Bottom grid: Teachers + Recent Appointments ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24 }}>

        {/* Teachers table */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: 16, color: COLORS.text }}>
              Registered Teachers
            </h3>
            <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>
              {teachers.length} total
            </span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.bg }}>
                {["Name", "Department", "Teacher ID", "Email"].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: COLORS.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, i) => {
                const initials = (
                  (t.displayName?.split(" ")[0]?.[0] ?? "") +
                  (t.displayName?.split(" ").at(-1)?.[0] ?? "")
                ).toUpperCase();

                return (
                  <tr
                    key={t.uid}
                    style={{
                      borderBottom: i < teachers.length - 1 ? `1px solid ${COLORS.border}` : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: COLORS.accent,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>
                          {t.displayName}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 13, color: COLORS.textMuted }}>
                      {t.department}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          background: COLORS.accentLight,
                          color: COLORS.accent,
                          borderRadius: 8,
                          padding: "3px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {t.teacherID}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: COLORS.textMuted }}>
                      {t.email}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Recent Appointments */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: 16, color: COLORS.text }}>
              Recent Appointments
            </h3>
            <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>
              {total} total
            </span>
          </div>
          <div style={{ padding: "8px 0" }}>
            {MOCK_APPOINTMENTS.slice(0, 7).map((a, i) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 24px",
                  borderBottom: i < 6 ? `1px solid ${COLORS.border}` : "none",
                  gap: 12,
                }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {a.student}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                    {a.teacher} · {a.date}
                  </div>
                </div>
                <Badge status={a.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Add Teacher Modal ── */}
      {showModal && (
        <AddTeacherModal
          onClose={() => setShowModal(false)}
          onSuccess={handleTeacherAdded}
        />
      )}
    </div>
  );
}
