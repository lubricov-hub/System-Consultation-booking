import { useState, useEffect } from "react";
import { COLORS, DAYS, MONTHS } from "../constants";
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
    .filter((a) => a.teacherId === uid && a.status !== "cancelled");
}

export default function Schedule({ onView }) {
  const today = new Date();

  const [month, setMonth]           = useState(today.getMonth());
  const [year, setYear]             = useState(today.getFullYear());
  const [selected, setSelected]     = useState(today.getDate());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchAppointmentsForTeacher();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load schedule.");
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

  // Build calendar grid
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  // Match appointment dateISO against the viewed month/day
  function apptForDay(d) {
    return appointments.filter((a) => {
      if (!a.dateISO) return false;
      const apptDate = new Date(a.dateISO);
      return (
        apptDate.getFullYear() === year &&
        apptDate.getMonth()    === month &&
        apptDate.getDate()     === d
      );
    });
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelected(null);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelected(null);
  }

  const selectedAppts = selected ? apptForDay(selected) : [];

  // status badge colors
  function statusStyle(status) {
    switch (status) {
      case "confirmed":  return { bg: "#eff6ff", color: "#3b82f6" };
      case "completed":  return { bg: "#f0fdf4", color: "#16a34a" };
      default:           return { bg: "#fffbeb", color: "#d97706" }; // pending
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>My Schedule</h1>

      {error && (
        <p style={{ color: "red", marginBottom: 16 }}>{error}</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }}>

        {/* ── Calendar ── */}
        <Card>
          {/* Month nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button
              onClick={prevMonth}
              style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 16 }}
            >
              ‹
            </button>
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 16 }}
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
          {loading ? (
            <p style={{ textAlign: "center", color: COLORS.textMuted, padding: "24px 0" }}>
              Loading...
            </p>
          ) : (
            rows.map((row, ri) => (
              <div
                key={ri}
                style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 2 }}
              >
                {row.map((d, ci) => {
                  const hasAppt  = d && apptForDay(d).length > 0;
                  const isSel    = d === selected;
                  const isToday  =
                    d === today.getDate() &&
                    month === today.getMonth() &&
                    year  === today.getFullYear();

                  return (
                    <div
                      key={ci}
                      onClick={() => d && setSelected(d)}
                      style={{
                        textAlign: "center",
                        padding: "8px 2px",
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: isSel ? 800 : isToday ? 700 : 500,
                        background: isSel
                          ? COLORS.accent
                          : isToday
                          ? COLORS.accentLight
                          : "transparent",
                        color: isSel
                          ? "#fff"
                          : d
                          ? COLORS.text
                          : "transparent",
                        cursor: d ? "pointer" : "default",
                        position: "relative",
                        outline: isToday && !isSel ? `2px solid ${COLORS.accent}` : "none",
                      }}
                    >
                      {d}
                      {/* dot indicator for days with appointments */}
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
            ))
          )}

          {/* Legend */}
          {!loading && (
            <div style={{ display: "flex", gap: 16, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.textMuted }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, display: "inline-block" }} />
                Has appointments
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.textMuted }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: COLORS.accentLight, border: `2px solid ${COLORS.accent}`, display: "inline-block" }} />
                Today
              </div>
            </div>
          )}
        </Card>

        {/* ── Appointments for selected day ── */}
        <Card>
          <h3 style={{ margin: "0 0 4px", fontWeight: 700 }}>
            {selected
              ? `${MONTHS[month]} ${selected}, ${year}`
              : "Select a date"}
          </h3>
          <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16 }}>
            {selected
              ? selectedAppts.length === 0
                ? "No appointments on this day."
                : `${selectedAppts.length} appointment${selectedAppts.length > 1 ? "s" : ""} scheduled`
              : "Click a day on the calendar to see appointments."}
          </p>

          {loading ? (
            <p style={{ color: COLORS.textMuted }}>Loading...</p>
          ) : selectedAppts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: COLORS.textMuted,
                background: COLORS.bg,
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
              <p style={{ margin: 0, fontSize: 14 }}>No appointments on this day.</p>
            </div>
          ) : (
            selectedAppts.map((a) => {
              const { bg, color } = statusStyle(a.status);
              return (
                <div
                  key={a.id}
                  style={{
                    background: COLORS.bg,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      {/* Avatar */}
                      <div
                        style={{
                          width: 40, height: 40,
                          borderRadius: "50%",
                          background: COLORS.accent,
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 15,
                          flexShrink: 0,
                        }}
                      >
                        {(a.studentName || "?")[0].toUpperCase()}
                      </div>

                      {/* Info */}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{a.studentName}</div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{a.topic}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                          <span style={{ fontSize: 13, color: COLORS.accent, fontWeight: 600 }}>
                            ⏰ {a.time}
                          </span>
                          <span
                            style={{
                              background: bg,
                              color,
                              borderRadius: 20,
                              padding: "2px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "capitalize",
                            }}
                          >
                            {a.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details button */}
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
                        flexShrink: 0,
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </div>
  );
}