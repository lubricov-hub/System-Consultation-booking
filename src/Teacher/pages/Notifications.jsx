import { useState } from "react";
import { Card } from "../ui/Card";

export default function Notifications() {
  const [list, setList] = useState([]);

  return (
    <div>
      <h1>Notifications</h1>

      {list.map(n => (
        <Card key={n.id}>{n.title}</Card>
      ))}
    </div>
  );
}