import Badge from "./Badge";
import { COLORS } from "../constants";

export default function AppointmentRow({ appt, onView }) {
  return (
    <tr>
      <td style={{ padding: 14 }}>{appt.student}</td>
      <td style={{ padding: 14 }}>{appt.topic}</td>
      <td style={{ padding: 14 }}>{appt.date}</td>
      <td style={{ padding: 14 }}>{appt.time}</td>
      <td style={{ padding: 14 }}><Badge status={appt.status} /></td>
      <td style={{ padding: 14 }}>
        <button
          onClick={() => onView(appt)}
          style={{
            background: COLORS.accentLight,
            color: COLORS.accent,
            border: "none",
            padding: "6px 12px",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          View
        </button>
      </td>
    </tr>
  );
}