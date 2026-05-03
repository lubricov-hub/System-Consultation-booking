import { COLORS, MOCK_APPOINTMENTS } from "../constants";
import { Card } from "../components/Card";
import Badge from "../components/Badge";

export default function History({ onView }) {
  const past = MOCK_APPOINTMENTS.filter((a) => a.status === "completed");

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Consultation History</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 28 }}>
        Archive of all completed consultations.
      </p>

      {past.length === 0 ? (
        <Card>
          <p style={{ color: COLORS.textMuted }}>No completed consultations yet.</p>
        </Card>
      ) : (
        past.map((a) => (
          <Card key={a.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: COLORS.greenLight,
                    color: COLORS.green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  {a.student[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{a.student}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted }}>{a.topic}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                    {a.date} · {a.time}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Badge status="completed" />
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
