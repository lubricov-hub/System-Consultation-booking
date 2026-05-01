import { useState } from "react";
import { COLORS, FONT, NAV_ITEMS } from "./constants";
import { MOCK_APPOINTMENTS } from "./mockData";

import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Appointments from "./pages/Appointments";
import Availability from "./pages/Availability";
import History from "./pages/History";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

import StudentModal from "./ui/StudentModal";

export default function TeacherModule() {
  const [page, setPage] = useState("dashboard");
  const [modal, setModal] = useState(null);

  return (
    <div style={{ fontFamily: FONT, display: "flex" }}>
      
      {/* Sidebar */}
      <div style={{ width: 240, background: COLORS.sidebar }}>
        {NAV_ITEMS.map(i => (
          <button key={i.id} onClick={() => setPage(i.id)}>
            {i.icon} {i.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 30 }}>
        {page === "dashboard" && <Dashboard onView={setModal} />}
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