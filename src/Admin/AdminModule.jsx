import { useState, useEffect } from "react";
import { COLORS, FONT } from "./constants";
import AdminDashboard from "./pages/AdminDashboard";
import {db} from "../Firebase.js";
import {ref, get} from "firebase/database";
import LogoutButton from "../components/Logout.jsx";

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",    icon: "⊞" },
  { id: "teachers",  label: "Teachers",     icon: "🎓" },
  { id: "students",  label: "Students",     icon: "🎒" },
  { id: "appointments", label: "Appointments", icon: "📋" },
  { id: "settings",  label: "Settings",     icon: "⚙️" },
];

// ── Placeholder page ──────────────────────────────────────────────────────────
function Placeholder({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <h2 style={{ color: COLORS.textMuted, fontWeight: 700, margin: 0 }}>{label} — Coming Soon</h2>
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function AdminModule() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);

  const userId = localStorage.getItem("uid");

  useEffect(() => {
    if(userId){
      const userRef = ref(db, `users/${userId}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUser(userData);
          console.log(userData);
        }
      });
    }
  }, []);


  return (
    <div style={{ fontFamily: FONT, background: COLORS.bg, minHeight: "100vh", display: "flex" }}>

      {/* ── Sidebar ── */}
      <div
        style={{
          width: 240,
          background: COLORS.sidebar,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "28px 24px 20px" }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>
            🛡️ Admin
          </div>
          <div style={{ color: "#ffffff55", fontSize: 12, marginTop: 4 }}>School Admin Portal</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 12px" }}  >
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: "none",
                background: page === id ? COLORS.accent : "transparent",
                color: page === id ? "#fff" : "#ffffffaa",
                fontWeight: page === id ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                marginBottom: 4,
                textAlign: "left",
                fontFamily: FONT,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (page !== id) e.currentTarget.style.background = "#ffffff11"; }}
              onMouseLeave={e => { if (page !== id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* Admin user footer */}
        <div  className="flex justify-between" style={{ padding: "16px 24px 28px", borderTop: "1px solid #ffffff18" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: COLORS.accent,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              {user?.DisplayName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{user?.DisplayName}</div>
              <div style={{ color: "#ffffff55", fontSize: 11 }}>{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div
        style={{
          marginLeft: 240,
          flex: 1,
          padding: "36px 40px",
          maxWidth: "calc(100vw - 240px)",
          boxSizing: "border-box",
        }}
      >
        {page === "dashboard"    && <AdminDashboard />}
        {page === "teachers"     && <Placeholder label="Teachers" />}
        {page === "students"     && <Placeholder label="Students" />}
        {page === "appointments" && <Placeholder label="Appointments" />}
        {page === "settings"     && <Placeholder label="Settings" />}
      </div>
    </div>
  );
}
