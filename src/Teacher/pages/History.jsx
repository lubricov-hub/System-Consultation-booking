import { Card } from "../ui/Card";
import { MOCK_APPOINTMENTS } from "../constants";

export default function History({ onView }) {
  const past = MOCK_APPOINTMENTS.filter(a => a.status === "completed");

  return (
    <div>
      <h1>History</h1>

      {past.map(a => (
        <Card key={a.id}>
          <div style={{ fontWeight: 700 }}>{a.student}</div>
          <div>{a.topic}</div>
          <button onClick={() => onView(a)}>View</button>
        </Card>
      ))}
    </div>
  );
}