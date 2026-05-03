import { COLORS, FONT } from "../constants";
import Badge from "./Badge";

export default function AppointmentRow({ appt, onView }) {
  return (
    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <td style={{ padding: "14px 16px", fontWeight: 600, color: COLORS.text }}>{appt.student}</td>
      <td style={{ padding: "14px 16px", color: COLORS.textMuted, fontSize: 13 }}>{appt.topic}</td>
      <td style={{ padding: "14px 16px", color: COLORS.textMuted, fontSize: 13 }}>{appt.date}</td>
      <td style={{ padding: "14px 16px", color: COLORS.textMuted, fontSize: 13 }}>{appt.time}</td>
      <td style={{ padding: "14px 16px" }}>
        <Badge status={appt.status} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <button
          onClick={() => onView(appt)}
          style={{
            background: COLORS.accentLight,
            color: COLORS.accent,
            border: "none",
            borderRadius: 8,
            padding: "6px 14px",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          View
        </button>
      </td>
    </tr>
  );
}
