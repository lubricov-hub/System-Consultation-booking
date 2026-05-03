import { useEffect, useState } from "react";
import { COLORS, FONT, NAV_ITEMS } from "./constants";
import StudentModal from "./components/StudentModal";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Appointments from "./pages/Appointments";
import Availability from "./pages/Availability";
import History from "./pages/History";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import LogoutButton from "../components/Logout.jsx";
import {db} from "../Firebase.js";
import {ref, get} from "firebase/database";

export default function TeacherModule() {
  const [page, setPage] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const unread = 2;
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
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>
            🎓 TeacherHub
          </div>
          <div style={{ color: "#ffffff66", fontSize: 12, marginTop: 4 }}>Teacher Portal</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 12px" }}>
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
                position: "relative",
                fontFamily: FONT,
              }}
            >
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
              {id === "notifications" && unread > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: COLORS.red,
                    color: "#fff",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {unread}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="flex justify-between " style={{ padding: "16px 24px 28px", borderTop: "1px solid #ffffff22" }}>
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
              }}
            >
              {user?.DisplayName?.charAt(0)}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{user?.DisplayName}</div>
              <div style={{ color: "#ffffff66", fontSize: 11 }}>{user?.email}</div>
            </div>
          </div>
                    {/* Logout button */}
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
        {page === "dashboard"     && <Dashboard     onNav={setPage} onView={setModal} />}
        {page === "schedule"      && <Schedule       onView={setModal} />}
        {page === "appointments"  && <Appointments   onView={setModal} />}
        {page === "availability"  && <Availability />}
        {page === "history"       && <History        onView={setModal} />}
        {page === "notifications" && <Notifications />}
        {page === "profile"       && <Profile />}
      </div>

      {/* ── Modal ── */}
      <StudentModal appt={modal} onClose={() => setModal(null)} />
    </div>
  );
}
