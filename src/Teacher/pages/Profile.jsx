import { useState } from "react";
import { Card } from "../ui/Card";

export default function Profile() {
  const [form, setForm] = useState({
    name: "Ms. Garcia",
    email: "",
  });

  return (
    <div>
      <h1>Profile</h1>

      <Card>
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      </Card>
    </div>
  );
}