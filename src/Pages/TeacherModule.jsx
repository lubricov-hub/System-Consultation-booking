import { useState } from "react";

const COLORS = {
  bg: "#F7F8FC",
  sidebar: "#1A1D2E",
  sidebarHover: "#2A2D3E",
  accent: "#6C63FF",
  accentLight: "#EEF0FF",
  green: "#22C55E",
  greenLight: "#DCFCE7",
  red: "#EF4444",
  redLight: "#FEE2E2",
  yellow: "#F59E0B",
  yellowLight: "#FEF3C7",
  blue: "#3B82F6",
  blueLight: "#DBEAFE",
  text: "#1A1D2E",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  white: "#FFFFFF",
};

const FONT = "'DM Sans', 'Segoe UI', sans-serif";

const MOCK_APPOINTMENTS = [
  { id: 1, student: "Maria Santos", email: "maria@school.edu", phone: "+63 912 345 6789", topic: "Academic Progress Review", date: "2026-05-01", time: "09:00 AM", status: "upcoming", notes: "Wants to discuss quiz scores." },
  { id: 2, student: "Juan dela Cruz", email: "juan@school.edu", phone: "+63 917 654 3210", topic: "Assignment Help & Guidance", date: "2026-05-01", time: "10:30 AM", status: "upcoming", notes: "Struggling with calculus homework." },
  { id: 3, student: "Ana Reyes", email: "ana@school.edu", phone: "+63 905 111 2222", topic: "Course Selection & Planning", date: "2026-05-02", time: "01:00 PM", status: "upcoming", notes: "" },
  { id: 4, student: "Carlo Mendoza", email: "carlo@school.edu", phone: "", topic: "General Questions & Support", date: "2026-04-28", time: "02:00 PM", status: "completed", notes: "Discussed course load options." },
  { id: 5, student: "Liza Flores", email: "liza@school.edu", phone: "+63 918 777 8888", topic: "Academic Progress Review", date: "2026-04-25", time: "11:00 AM", status: "completed", notes: "" },
  { id: 6, student: "Ben Torres", email: "ben@school.edu", phone: "", topic: "Assignment Help & Guidance", date: "2026-05-03", time: "03:30 PM", status: "cancelled", notes: "Student cancelled." },
];

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const STATUS_COLORS = {
  upcoming: { bg: COLORS.blueLight, text: COLORS.blue },
  completed: { bg: COLORS.greenLight, text: COLORS.green },
  cancelled: { bg: COLORS.redLight, text: COLORS.red },
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "schedule", label: "My Schedule", icon: "📅" },
  { id: "appointments", label: "Appointments", icon: "📋" },
  { id: "availability", label: "Availability", icon: "⏰" },
  { id: "history", label: "History", icon: "🗂️" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "profile", label: "Profile & Settings", icon: "👤" },
];

// ─── Shared Components ───────────────────────────────────────────────────────

function Badge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.upcoming;
  return (
    <span style={{ background: c.bg, color: c.text, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
      {status}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24, ...style }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: color, marginTop: 2, fontWeight: 600 }}>{sub}</div>}
      </div>
    </div>
  );
}

function AppointmentRow({ appt, onView }) {
  return (
    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <td style={{ padding: "14px 16px", fontWeight: 600, color: COLORS.text }}>{appt.student}</td>
      <td style={{ padding: "14px 16px", color: COLORS.textMuted, fontSize: 13 }}>{appt.topic}</td>
      <td style={{ padding: "14px 16px", color: COLORS.textMuted, fontSize: 13 }}>{appt.date}</td>
      <td style={{ padding: "14px 16px", color: COLORS.textMuted, fontSize: 13 }}>{appt.time}</td>
      <td style={{ padding: "14px 16px" }}><Badge status={appt.status} /></td>
      <td style={{ padding: "14px 16px" }}>
        <button onClick={() => onView(appt)} style={{ background: COLORS.accentLight, color: COLORS.accent, border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>View</button>
      </td>
    </tr>
  );
}

// ─── Student Detail Modal ────────────────────────────────────────────────────

function StudentModal({ appt, onClose }) {
  if (!appt) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: COLORS.white, borderRadius: 20, padding: 36, width: 480, maxWidth: "95vw", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Student Details</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: COLORS.textMuted }}>×</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 800 }}>
            {appt.student[0]}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{appt.student}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{appt.email}</div>
          </div>
        </div>
        {[
          ["📅 Date", appt.date],
          ["⏰ Time", appt.time],
          ["📌 Topic", appt.topic],
          ["📞 Phone", appt.phone || "—"],
          ["📝 Notes", appt.notes || "No notes provided."],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
            <span style={{ minWidth: 120, fontWeight: 600, fontSize: 13, color: COLORS.textMuted }}>{label}</span>
            <span style={{ fontSize: 14, color: COLORS.text }}>{val}</span>
          </div>
        ))}
        <div style={{ marginTop: 8 }}><Badge status={appt.status} /></div>
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button style={{ flex: 1, background: COLORS.greenLight, color: COLORS.green, border: "none", borderRadius: 10, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>✔ Confirm</button>
          <button style={{ flex: 1, background: COLORS.redLight, color: COLORS.red, border: "none", borderRadius: 10, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>✕ Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function Dashboard({ onNav, onView }) {
  const today = MOCK_APPOINTMENTS.filter(a => a.date === "2026-05-01" && a.status === "upcoming");
  const upcoming = MOCK_APPOINTMENTS.filter(a => a.status === "upcoming");
  const completed = MOCK_APPOINTMENTS.filter(a => a.status === "completed");
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Good morning, Ms. Garcia 👋</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 28, fontSize: 15 }}>Thursday, April 30, 2026 — Here's what's on your plate today.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Today's Sessions" value={today.length} icon="📅" color={COLORS.accent} sub="+2 from yesterday" />
        <StatCard label="Upcoming" value={upcoming.length} icon="⏳" color={COLORS.blue} />
        <StatCard label="Completed" value={completed.length} icon="✅" color={COLORS.green} sub="This month" />
        <StatCard label="Students Helped" value={12} icon="🎓" color={COLORS.yellow} sub="This week" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontWeight: 700 }}>Today's Appointments</h3>
            <button onClick={() => onNav("schedule")} style={{ background: "none", border: "none", color: COLORS.accent, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>View all →</button>
          </div>
          {today.length === 0 ? <p style={{ color: COLORS.textMuted }}>No appointments today.</p> : today.map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: COLORS.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{a.student[0]}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{a.student}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>{a.topic}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: COLORS.textMuted }}>{a.time}</span>
                <button onClick={() => onView(a)} style={{ background: COLORS.accentLight, color: COLORS.accent, border: "none", borderRadius: 8, padding: "5px 12px", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>View</button>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 16px", fontWeight: 700 }}>Quick Actions</h3>
          {[
            { label: "📅  Set Availability", page: "availability" },
            { label: "📋  All Appointments", page: "appointments" },
            { label: "🗂️  View History", page: "history" },
            { label: "🔔  Notifications", page: "notifications" },
          ].map(({ label, page }) => (
            <button key={page} onClick={() => onNav(page)} style={{ display: "block", width: "100%", textAlign: "left", background: COLORS.bg, border: "none", borderRadius: 10, padding: "12px 16px", marginBottom: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", color: COLORS.text }}>
              {label}
            </button>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Schedule({ onView }) {
  const [month, setMonth] = useState(4); // May = 4
  const [year] = useState(2026);
  const [selected, setSelected] = useState(1);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const dateStr = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const apptForDay = (d) => MOCK_APPOINTMENTS.filter(a => a.date === dateStr(d) && a.status !== "cancelled");
  const selectedAppts = selected ? apptForDay(selected) : [];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>My Schedule</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button onClick={() => setMonth(m => Math.max(0, m - 1))} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>‹</button>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{MONTHS[month]} {year}</span>
            <button onClick={() => setMonth(m => Math.min(11, m + 1))} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>›</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 8 }}>
            {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, padding: "4px 0" }}>{d}</div>)}
          </div>
          {rows.map((row, ri) => (
            <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 2 }}>
              {row.map((d, ci) => {
                const hasAppt = d && apptForDay(d).length > 0;
                const isSel = d === selected;
                return (
                  <div key={ci} onClick={() => d && setSelected(d)} style={{ textAlign: "center", padding: "8px 2px", borderRadius: 8, fontSize: 14, fontWeight: isSel ? 800 : 500, background: isSel ? COLORS.accent : "transparent", color: isSel ? "#fff" : d ? COLORS.text : "transparent", cursor: d ? "pointer" : "default", position: "relative" }}>
                    {d}
                    {hasAppt && !isSel && <span style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: 5, height: 5, borderRadius: "50%", background: COLORS.accent, display: "block" }} />}
                  </div>
                );
              })}
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 16px", fontWeight: 700 }}>
            {selected ? `Appointments — May ${selected}` : "Select a date"}
          </h3>
          {selectedAppts.length === 0 ? (
            <p style={{ color: COLORS.textMuted }}>No appointments on this day.</p>
          ) : selectedAppts.map(a => (
            <div key={a.id} style={{ background: COLORS.bg, borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{a.student}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{a.topic}</div>
                  <div style={{ fontSize: 13, color: COLORS.accent, marginTop: 4, fontWeight: 600 }}>{a.time}</div>
                </div>
                <button onClick={() => onView(a)} style={{ background: COLORS.accentLight, color: COLORS.accent, border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Details</button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Appointments({ onView }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = MOCK_APPOINTMENTS.filter(a => {
    const matchFilter = filter === "all" || a.status === filter;
    const matchSearch = a.student.toLowerCase().includes(search.toLowerCase()) || a.topic.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Appointment Management</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or topic..." style={{ padding: "10px 16px", borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14, width: 260, outline: "none" }} />
        {["all","upcoming","completed","cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "9px 18px", borderRadius: 10, border: `1px solid ${filter === f ? COLORS.accent : COLORS.border}`, background: filter === f ? COLORS.accent : COLORS.white, color: filter === f ? "#fff" : COLORS.text, fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>{f}</button>
        ))}
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT }}>
          <thead>
            <tr style={{ background: COLORS.bg }}>
              {["Student","Topic","Date","Time","Status","Action"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: COLORS.textMuted }}>No appointments found.</td></tr>
            ) : filtered.map(a => <AppointmentRow key={a.id} appt={a} onView={onView} />)}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Availability() {
  const SLOTS = ["08:00 AM","08:30 AM","09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM"];
  const [enabledDays, setEnabledDays] = useState({ Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false });
  const [enabledSlots, setEnabledSlots] = useState(() => Object.fromEntries(SLOTS.map(s => [s, s >= "09:00 AM" && s <= "05:00 PM"])));
  const [saved, setSaved] = useState(false);

  const toggleDay = d => setEnabledDays(prev => ({ ...prev, [d]: !prev[d] }));
  const toggleSlot = s => setEnabledSlots(prev => ({ ...prev, [s]: !prev[s] }));

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Availability Settings</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 28 }}>Configure which days and time slots students can book consultations with you.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        <Card>
          <h3 style={{ margin: "0 0 16px", fontWeight: 700 }}>Available Days</h3>
          {Object.entries(enabledDays).map(([day, on]) => (
            <div key={day} onClick={() => toggleDay(day)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" }}>
              <span style={{ fontWeight: 600 }}>{day}</span>
              <div style={{ width: 44, height: 24, borderRadius: 12, background: on ? COLORS.accent : COLORS.border, position: "relative", transition: "background 0.2s" }}>
                <div style={{ position: "absolute", top: 3, left: on ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 16px", fontWeight: 700 }}>Available Time Slots</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {SLOTS.map(s => (
              <button key={s} onClick={() => toggleSlot(s)} style={{ padding: "10px 0", borderRadius: 10, border: `2px solid ${enabledSlots[s] ? COLORS.accent : COLORS.border}`, background: enabledSlots[s] ? COLORS.accentLight : COLORS.white, color: enabledSlots[s] ? COLORS.accent : COLORS.textMuted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                {s}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} style={{ background: COLORS.accent, color: "#fff", border: "none", borderRadius: 12, padding: "12px 32px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              {saved ? "✔ Saved!" : "Save Availability"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function History({ onView }) {
  const past = MOCK_APPOINTMENTS.filter(a => a.status === "completed");
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Consultation History</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 28 }}>Archive of all completed consultations.</p>
      {past.length === 0 ? <Card><p style={{ color: COLORS.textMuted }}>No completed consultations yet.</p></Card> : past.map(a => (
        <Card key={a.id} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: COLORS.greenLight, color: COLORS.green, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>{a.student[0]}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{a.student}</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted }}>{a.topic}</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted }}>{a.date} · {a.time}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Badge status="completed" />
              <button onClick={() => onView(a)} style={{ background: COLORS.accentLight, color: COLORS.accent, border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>View Notes</button>
            </div>
          </div>
          {a.notes && <div style={{ marginTop: 12, background: COLORS.bg, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: COLORS.textMuted }}>📝 {a.notes}</div>}
        </Card>
      ))}
    </div>
  );
}

function Notifications() {
  const NOTIFS = [
    { id: 1, type: "new", icon: "📅", title: "New Booking", body: "Maria Santos booked a session on May 1 at 9:00 AM.", time: "2 mins ago", read: false },
    { id: 2, type: "reminder", icon: "⏰", title: "Upcoming Session", body: "Reminder: Juan dela Cruz at 10:30 AM today.", time: "1 hour ago", read: false },
    { id: 3, type: "cancel", icon: "❌", title: "Cancellation", body: "Ben Torres cancelled their May 3 appointment.", time: "Yesterday", read: true },
    { id: 4, type: "new", icon: "📅", title: "New Booking", body: "Ana Reyes booked a session on May 2 at 1:00 PM.", time: "2 days ago", read: true },
  ];
  const [notifs, setNotifs] = useState(NOTIFS);
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Notifications</h1>
        <button onClick={markAll} style={{ background: "none", border: "none", color: COLORS.accent, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Mark all as read</button>
      </div>
      {notifs.map(n => (
        <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: n.read ? COLORS.white : COLORS.accentLight, border: `1px solid ${n.read ? COLORS.border : COLORS.accent + "44"}`, borderRadius: 14, padding: 18, marginBottom: 12, cursor: "pointer" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: n.read ? COLORS.bg : COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{n.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{n.title}</span>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>{n.time}</span>
            </div>
            <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>{n.body}</div>
          </div>
          {!n.read && <div style={{ width: 9, height: 9, borderRadius: "50%", background: COLORS.accent, marginTop: 6, flexShrink: 0 }} />}
        </div>
      ))}
    </div>
  );
}

function Profile() {
  const [form, setForm] = useState({ name: "Ms. Maria Garcia", email: "m.garcia@school.edu", phone: "+63 912 000 1111", dept: "Mathematics", office: "Room 204, Main Building", meetLink: "https://meet.google.com/abc-xyz", bio: "Passionate math teacher with 8 years of experience.", notifEmail: true, notifSMS: false, notif24h: true });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Profile & Settings</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <h3 style={{ margin: "0 0 20px", fontWeight: 700 }}>Personal Information</h3>
          {[["Full Name", "name", "text"], ["Email", "email", "email"], ["Phone Number", "phone", "text"], ["Department", "dept", "text"], ["Office Location", "office", "text"], ["Virtual Meeting Link", "meetLink", "url"]].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Bio</label>
            <textarea value={form.bio} onChange={e => set("bio", e.target.value)} rows={3} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
          </div>
        </Card>
        <div>
          <Card style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 20px", fontWeight: 700 }}>Notification Preferences</h3>
            {[["Email Notifications", "notifEmail"], ["SMS Notifications", "notifSMS"], ["24-Hour Reminders", "notif24h"]].map(([label, key]) => (
              <div key={key} onClick={() => set(key, !form[key])} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" }}>
                <span style={{ fontWeight: 500 }}>{label}</span>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: form[key] ? COLORS.accent : COLORS.border, position: "relative", transition: "background 0.2s" }}>
                  <div style={{ position: "absolute", top: 3, left: form[key] ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{ margin: "0 0 12px", fontWeight: 700 }}>Preview</h3>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 }}>{form.name[0]}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{form.name}</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted }}>{form.dept}</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted }}>{form.office}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} style={{ background: COLORS.accent, color: "#fff", border: "none", borderRadius: 12, padding: "13px 36px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          {saved ? "✔ Changes Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function TeacherModule() {
  const [page, setPage] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const unread = 2;

  return (
    <div style={{ fontFamily: FONT, background: COLORS.bg, minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: COLORS.sidebar, minHeight: "100vh", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0 }}>
        <div style={{ padding: "28px 24px 20px" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>🎓 TeacherHub</div>
          <div style={{ color: "#ffffff66", fontSize: 12, marginTop: 4 }}>Teacher Portal</div>
        </div>
        <nav style={{ flex: 1, padding: "0 12px" }}>
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setPage(id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", borderRadius: 10, border: "none", background: page === id ? COLORS.accent : "transparent", color: page === id ? "#fff" : "#ffffffaa", fontWeight: page === id ? 700 : 500, fontSize: 14, cursor: "pointer", marginBottom: 4, textAlign: "left", position: "relative" }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
              {id === "notifications" && unread > 0 && (
                <span style={{ marginLeft: "auto", background: COLORS.red, color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{unread}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 24px 28px", borderTop: "1px solid #ffffff22" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>M</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>Ms. Garcia</div>
              <div style={{ color: "#ffffff66", fontSize: 11 }}>Mathematics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 240, flex: 1, padding: "36px 40px", maxWidth: "calc(100vw - 240px)", boxSizing: "border-box" }}>
        {page === "dashboard" && <Dashboard onNav={setPage} onView={setModal} />}
        {page === "schedule" && <Schedule onView={setModal} />}
        {page === "appointments" && <Appointments onView={setModal} />}
        {page === "availability" && <Availability />}
        {page === "history" && <History onView={setModal} />}
        {page === "notifications" && <Notifications />}
        {page === "profile" && <Profile />}
      </div>

      <StudentModal appt={modal} onClose={() => setModal(null)} />
    </div>
  );
}