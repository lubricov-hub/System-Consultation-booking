import { STATUS_COLORS } from "../constants";

export default function Badge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.upcoming;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}
