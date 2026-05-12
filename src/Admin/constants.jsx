export const COLORS = {
  bg:           "#F7F8FC",
  sidebar:      "#1A1D2E",
  accent:       "#6C63FF",
  accentLight:  "#EEF0FF",
  accentDark:   "#5148d4",
  gold:         "#F59E0B",
  goldLight:    "#FEF3C7",
  green:        "#22C55E",
  greenLight:   "#DCFCE7",
  red:          "#EF4444",
  redLight:     "#FEE2E2",
  blue:         "#3B82F6",
  blueLight:    "#DBEAFE",
  text:         "#0F1117",
  textMuted:    "#6B7280",
  border:       "#E5E7EB",
  white:        "#FFFFFF",
};

export const FONT = "'DM Sans', 'Segoe UI', sans-serif";

// ── Mock Data ─────────────────────────────────────────────────────────────────

export const MOCK_TEACHERS = [
  { uid: "t1", displayName: "Ms. Maria Garcia",   email: "m.garcia@school.edu",   department: "Mathematics",  teacherID: "TCH-001", role: "teacher", createdAt: "2025-08-01" },
  { uid: "t2", displayName: "Mr. Jose Reyes",      email: "j.reyes@school.edu",    department: "Science",      teacherID: "TCH-002", role: "teacher", createdAt: "2025-08-10" },
  { uid: "t3", displayName: "Ms. Ana Santos",      email: "a.santos@school.edu",   department: "English",      teacherID: "TCH-003", role: "teacher", createdAt: "2025-09-01" },
  { uid: "t4", displayName: "Mr. Carlo Mendoza",   email: "c.mendoza@school.edu",  department: "History",      teacherID: "TCH-004", role: "teacher", createdAt: "2025-09-15" },
  { uid: "t5", displayName: "Ms. Liza Torres",     email: "l.torres@school.edu",   department: "Filipino",     teacherID: "TCH-005", role: "teacher", createdAt: "2025-10-01" },
];

export const MOCK_APPOINTMENTS = [
  { id: "a1", student: "Juan dela Cruz",  teacher: "Ms. Maria Garcia",  topic: "Academic Progress Review",    date: "2026-05-01", time: "09:00 AM", status: "upcoming"   },
  { id: "a2", student: "Maria Santos",    teacher: "Mr. Jose Reyes",    topic: "Assignment Help & Guidance",  date: "2026-05-01", time: "10:30 AM", status: "upcoming"   },
  { id: "a3", student: "Ana Reyes",       teacher: "Ms. Ana Santos",    topic: "Course Selection & Planning", date: "2026-05-02", time: "01:00 PM", status: "upcoming"   },
  { id: "a4", student: "Carlo Flores",    teacher: "Ms. Maria Garcia",  topic: "General Questions & Support", date: "2026-04-28", time: "02:00 PM", status: "completed"  },
  { id: "a5", student: "Liza Torres",     teacher: "Mr. Carlo Mendoza", topic: "Academic Progress Review",    date: "2026-04-25", time: "11:00 AM", status: "completed"  },
  { id: "a6", student: "Ben Torres",      teacher: "Ms. Liza Torres",   topic: "Assignment Help & Guidance",  date: "2026-05-03", time: "03:30 PM", status: "cancelled"  },
  { id: "a7", student: "Gina Ramos",      teacher: "Mr. Jose Reyes",    topic: "Academic Progress Review",    date: "2026-04-20", time: "09:00 AM", status: "missed"     },
  { id: "a8", student: "Pedro Villanueva",teacher: "Ms. Ana Santos",    topic: "Course Selection & Planning", date: "2026-04-18", time: "02:00 PM", status: "completed"  },
];
