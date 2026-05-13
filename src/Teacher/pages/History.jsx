import { useState, useEffect } from "react";
import { COLORS } from "../constants";
import { Card } from "../components/Card";
import { db } from "../../Firebase.js";
import { ref, get } from "firebase/database";

async function fetchCompletedAppointmentsForTeacher() {
  const uid = localStorage.getItem("uid");
  if (!uid) return [];

  const snap = await get(ref(db, "appointments"));
  if (!snap.exists()) return [];

  return Object.entries(snap.val())
    .map(([id, data]) => ({ id, ...data }))
    .filter((a) => a.teacherId === uid && a.status === "completed");
}

export default function History({ onView }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [search, setSearch]             = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchCompletedAppointmentsForTeacher();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load consultation history.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    return (
      (a.studentName || "").toLowerCase().includes(q) ||
      (a.topic || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        Consultation History
      </h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 24 }}>
        Archive of all completed consultations.
      </p>

      {/* ── Search ── */}
      <div style={{ marginBottom: 20 }}>
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
      </div>

      {/* ── States ── */}
      {loading ? (
        <Card>
          <p style={{ color: COLORS.textMuted, textAlign: "center", padding: 16 }}>
            Loading history...
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p style={{ color: "red", textAlign: "center", padding: 16 }}>{error}</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <p style={{ color: COLORS.textMuted, textAlign: "center", padding: 16 }}>
            No completed consultations found.
          </p>
        </Card>
      ) : (
        filtered.map((a) => (
          <Card key={a.id} style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {/* ── Left: Avatar + Info ── */}
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: COLORS.accent,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {(a.studentName || "?")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>
                    {a.studentName}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                    {a.studentEmail}
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
                    {a.topic}
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                    {a.date} · {a.time}
                  </div>
                </div>
              </div>

              {/* ── Right: Badge + Button ── */}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span
                  style={{
                    background: "#f0fdf4",
                    color: "#16a34a",
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                >
                  completed
                </span>
                <button
                  onClick={() => onView(a)}
                  style={{
                    background: COLORS.accentLight,
                    color: COLORS.accent,
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  View Notes
                </button>
              </div>
            </div>

            {/* ── Notes preview ── */}
            {a.notes && (
              <div
                style={{
                  marginTop: 12,
                  background: COLORS.bg,
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: COLORS.textMuted,
                }}
              >
                📝 {a.notes}
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}