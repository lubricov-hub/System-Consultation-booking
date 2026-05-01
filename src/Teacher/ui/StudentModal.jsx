import Badge from "./Badge";
import { COLORS } from "../constants";

export default function StudentModal({ appt, onClose }) {
  if (!appt) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff",
        padding: 30,
        borderRadius: 16,
        width: 480
      }}>
        <h2>Student Details</h2>
        <p>{appt.student}</p>
        <p>{appt.email}</p>
        <Badge status={appt.status} />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}