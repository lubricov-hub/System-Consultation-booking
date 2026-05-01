import { useState } from "react";
import { Card } from "../ui/Card";
import { COLORS } from "../constants";

export default function Availability() {
  const [enabled, setEnabled] = useState({ Mon: true, Tue: true });

  return (
    <div>
      <h1>Availability</h1>

      <Card>
        {Object.keys(enabled).map(day => (
          <div
            key={day}
            onClick={() =>
              setEnabled(prev => ({ ...prev, [day]: !prev[day] }))
            }
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>{day}</span>
            <span>{enabled[day] ? "ON" : "OFF"}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}