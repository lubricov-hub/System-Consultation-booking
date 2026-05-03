import { useState } from "react";
import { COLORS } from "../constants";

const INITIAL_NOTIFS = [
  { id: 1, type: "new", icon: "📅", title: "New Booking", body: "Maria Santos booked a session on May 1 at 9:00 AM.", time: "2 mins ago", read: false },
  { id: 2, type: "reminder", icon: "⏰", title: "Upcoming Session", body: "Reminder: Juan dela Cruz at 10:30 AM today.", time: "1 hour ago", read: false },
  { id: 3, type: "cancel", icon: "❌", title: "Cancellation", body: "Ben Torres cancelled their May 3 appointment.", time: "Yesterday", read: true },
  { id: 4, type: "new", icon: "📅", title: "New Booking", body: "Ana Reyes booked a session on May 2 at 1:00 PM.", time: "2 days ago", read: true },
];

export default function Notifications() {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);

  const markAll = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const markOne = (id) =>
    setNotifs((prev) => prev.map((x) => (x.id === id ? { ...x, read: true } : x)));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Notifications</h1>
        <button
          onClick={markAll}
          style={{ background: "none", border: "none", color: COLORS.accent, fontWeight: 600, cursor: "pointer", fontSize: 14 }}
        >
          Mark all as read
        </button>
      </div>

      {notifs.map((n) => (
        <div
          key={n.id}
          onClick={() => markOne(n.id)}
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
            background: n.read ? COLORS.white : COLORS.accentLight,
            border: `1px solid ${n.read ? COLORS.border : COLORS.accent + "44"}`,
            borderRadius: 14,
            padding: 18,
            marginBottom: 12,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: n.read ? COLORS.bg : COLORS.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {n.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{n.title}</span>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>{n.time}</span>
            </div>
            <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>{n.body}</div>
          </div>
          {!n.read && (
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: COLORS.accent,
                marginTop: 6,
                flexShrink: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
