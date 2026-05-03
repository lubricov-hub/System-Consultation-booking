export const COLORS = {
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

export const FONT = "'DM Sans', 'Segoe UI', sans-serif";

export const MOCK_APPOINTMENTS = [
  { id: 1, student: "Maria Santos", email: "maria@school.edu", phone: "+63 912 345 6789", topic: "Academic Progress Review", date: "2026-05-01", time: "09:00 AM", status: "upcoming", notes: "Wants to discuss quiz scores." },
  { id: 2, student: "Juan dela Cruz", email: "juan@school.edu", phone: "+63 917 654 3210", topic: "Assignment Help & Guidance", date: "2026-05-01", time: "10:30 AM", status: "upcoming", notes: "Struggling with calculus homework." },
  { id: 3, student: "Ana Reyes", email: "ana@school.edu", phone: "+63 905 111 2222", topic: "Course Selection & Planning", date: "2026-05-02", time: "01:00 PM", status: "upcoming", notes: "" },
  { id: 4, student: "Carlo Mendoza", email: "carlo@school.edu", phone: "", topic: "General Questions & Support", date: "2026-04-28", time: "02:00 PM", status: "completed", notes: "Discussed course load options." },
  { id: 5, student: "Liza Flores", email: "liza@school.edu", phone: "+63 918 777 8888", topic: "Academic Progress Review", date: "2026-04-25", time: "11:00 AM", status: "completed", notes: "" },
  { id: 6, student: "Ben Torres", email: "ben@school.edu", phone: "", topic: "Assignment Help & Guidance", date: "2026-05-03", time: "03:30 PM", status: "cancelled", notes: "Student cancelled." },
];

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const STATUS_COLORS = {
  upcoming: { bg: "#DBEAFE", text: "#3B82F6" },
  completed: { bg: "#DCFCE7", text: "#22C55E" },
  cancelled: { bg: "#FEE2E2", text: "#EF4444" },
};

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "schedule", label: "My Schedule", icon: "📅" },
  { id: "appointments", label: "Appointments", icon: "📋" },
  { id: "availability", label: "Availability", icon: "⏰" },
  { id: "history", label: "History", icon: "🗂️" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "profile", label: "Profile & Settings", icon: "👤" },
];
