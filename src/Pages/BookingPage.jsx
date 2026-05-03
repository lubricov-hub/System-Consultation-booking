import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, ChevronDown, Search, Mail, Hash, X } from "lucide-react";
import { db } from "../Firebase.js";
import { v4 as uuid } from "uuid";
import { ref, get, set } from "firebase/database";

/* ─── constants ─── */
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM",
];

const TOPICS = [
  "Academic Progress Review",
  "Assignment Help & Guidance",
  "Course Selection & Planning",
  "General Questions & Support",
];

const YEAR_LEVELS = ["First Year ", "Second Year", "Third Year", "Fourth Year"];

/* ─── helpers ─── */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

/* ─────────────────────────────────────────────────────────────────
   Fetch ALL users from Realtime DB at users/
   Structure: users/{userID}/{ firstName, lastName, role, email, ... }
   Then filter client-side to only keep role === "teacher"
───────────────────────────────────────────────────────────────── */
async function fetchAllUsersAndFilterTeachers() {
  // Read the entire users/ node
  const usersRef = ref(db, "users");
  const snapshot = await get(usersRef);

  if (!snapshot.exists()) return [];

  // Realtime DB returns an object keyed by userID
  const usersObj = snapshot.val(); // { uid1: { ...fields }, uid2: { ...fields }, ... }

  // Convert to array and inject the key as `id`
  const allUsers = Object.entries(usersObj).map(([id, data]) => ({
    id,   // the userID key becomes the id field
    ...data,
  }));

  // Client-side filter — only users whose role field equals "teacher"
  const teachersOnly = allUsers.filter((user) => user.role === "teacher");

  return teachersOnly;
}

/* ─── Step indicator ─── */
function StepIndicator({ step }) {
  const steps = ["Teacher", "Date", "Time", "Details"];
  return (
    <div className="flex items-center gap-1 mb-8 flex-wrap">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${done ? "bg-green-500 text-white" : active ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-500"}
            `}>
              {done ? <Check className="w-4 h-4" /> : idx}
            </div>
            <span className={`text-sm font-medium ${active ? "text-slate-800" : "text-slate-400"}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <ArrowRight className="w-3 h-3 text-slate-300 mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Step 1: Teacher Search ─── */
function StepTeacher({ selectedTeacher, onSelect, onContinue }) {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTeachers() {
      try {
        setLoading(true);
        // Fetch all users from Realtime DB, then filter to teachers client-side
        const teacherList = await fetchAllUsersAndFilterTeachers();
        setTeachers(teacherList);
      } catch (err) {
        setError("Failed to load teachers. Please try again.");
        console.error("loadTeachers error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);

  // Client-side search across firstName, lastName, full name, teacherID, email
  const filtered = teachers.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (t.firstName || "").toLowerCase().includes(q) ||
      (t.lastName || "").toLowerCase().includes(q) ||
      (`${t.firstName || ""} ${t.lastName || ""}`).toLowerCase().includes(q) ||
      (t.teacherID || "").toLowerCase().includes(q) ||
      (t.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
      <h2 className="font-bold text-slate-800 text-lg mb-1">Find a Teacher</h2>
      <p className="text-slate-400 text-sm mb-6">Search by name, teacher ID, or email</p>

      {/* Search input */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g. John Smith, T-1042, teacher@school.edu"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {loading && (
          <div className="py-10 text-center text-slate-400 text-sm">Loading teachers...</div>
        )}
        {!loading && error && (
          <div className="py-6 text-center text-red-400 text-sm">{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="py-10 text-center text-slate-400 text-sm">
            No teachers found matching your search.
          </div>
        )}
        {!loading && !error && filtered.map((teacher) => {
          const isSelected = selectedTeacher?.id === teacher.id;
          return (
            <button
              key={teacher.id}
              onClick={() => onSelect(teacher)}
              className={`
                w-full text-left px-4 py-3.5 rounded-xl border transition-all flex items-center gap-4
                ${isSelected
                  ? "border-slate-800 bg-slate-900 text-white"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}
              `}
            >
              {/* Initials avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                ${isSelected ? "bg-white text-slate-900" : "bg-slate-100 text-slate-600"}`}>
                {(teacher.firstName?.[0] || "").toUpperCase()}
                {(teacher.lastName?.[0] || "").toUpperCase()}
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${isSelected ? "text-white" : "text-slate-800"}`}>
                  {teacher.firstName} {teacher.lastName}
                </p>
                <div className={`flex items-center gap-3 mt-0.5 text-xs flex-wrap
                  ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                  {teacher.teacherID && (
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3" /> {teacher.teacherID}
                    </span>
                  )}
                  {teacher.email && (
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3" /> {teacher.email}
                    </span>
                  )}
                </div>
              </div>

              {isSelected && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Selected teacher pill */}
      {selectedTeacher && (
        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
            {(selectedTeacher.firstName?.[0] || "").toUpperCase()}
            {(selectedTeacher.lastName?.[0] || "").toUpperCase()}
          </div>
          <p className="text-sm text-slate-700">
            Booking with{" "}
            <span className="font-semibold">
              {selectedTeacher.firstName} {selectedTeacher.lastName}
            </span>
          </p>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={onContinue}
          disabled={!selectedTeacher}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all
            ${selectedTeacher
              ? "bg-slate-800 text-white hover:bg-slate-700 hover:-translate-y-0.5 shadow-md"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"}
          `}
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 2: Calendar ─── */
function StepDate({ selectedDate, onSelect, onBack, onContinue }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  function isSelected(day) {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear
    );
  }
  function isToday(day) {
    return today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
  }
  function isPast(day) {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  }

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const prevDaysInMonth = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);
  const prevTail = blanks.map((_, i) => prevDaysInMonth - firstDay + 1 + i);
  const totalCells = blanks.length + days.length;
  const nextDays = totalCells % 7 === 0
    ? []
    : Array.from({ length: 7 - (totalCells % 7) }, (_, i) => i + 1);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
      <h2 className="font-bold text-slate-800 text-lg mb-1">Select a Date</h2>
      <p className="text-slate-400 text-sm mb-8">Choose your preferred consultation date</p>

      <div className="max-w-xs mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>
          <span className="font-semibold text-slate-800 text-sm">{MONTHS[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {prevTail.map((d) => (
            <div key={`p-${d}`} className="text-center py-2 text-xs text-slate-300">{d}</div>
          ))}
          {days.map((day) => (
            <button
              key={day}
              disabled={isPast(day)}
              onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
              className={`
                text-center py-2 text-sm rounded-full mx-0.5 my-0.5 transition-all font-medium
                ${isSelected(day) ? "bg-slate-800 text-white" : ""}
                ${isToday(day) && !isSelected(day) ? "bg-slate-100 text-slate-800 font-bold" : ""}
                ${!isSelected(day) && !isToday(day) && !isPast(day) ? "hover:bg-slate-100 text-slate-700" : ""}
                ${isPast(day) ? "text-slate-300 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {day}
            </button>
          ))}
          {nextDays.map((d) => (
            <div key={`n-${d}`} className="text-center py-2 text-xs text-slate-300">{d}</div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button onClick={onBack} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onContinue}
          disabled={!selectedDate}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all
            ${selectedDate
              ? "bg-slate-800 text-white hover:bg-slate-700 hover:-translate-y-0.5 shadow-md"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"}
          `}
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 3: Time Slots ─── */
function StepTime({ selectedDate, selectedTime, onSelect, onBack, onContinue }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
      <h2 className="font-bold text-slate-800 text-lg mb-1">Select a Time Slot</h2>
      <p className="text-slate-400 text-sm mb-8">Available times for {formatDate(selectedDate)}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelect(slot)}
            className={`
              py-3 px-2 rounded-xl text-sm font-medium border transition-all
              ${selectedTime === slot
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50"}
            `}
          >
            {slot}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8">
        <button onClick={onBack} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onContinue}
          disabled={!selectedTime}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all
            ${selectedTime
              ? "bg-slate-900 text-white hover:bg-slate-700 hover:-translate-y-0.5 shadow-md"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"}
          `}
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 4: Details ─── */
function StepDetails({ selectedDate, selectedTime, selectedTeacher, onBack, onConfirm }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    studentID: "",
    yearLevel: "",
    section: "",
    topic: "",
    notes: "",
  });
  const [topicOpen, setTopicOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function update(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.studentID.trim()) e.studentID = "Student ID is required";
    if (!form.yearLevel) e.yearLevel = "Please select your year level";
    if (!form.section.trim()) e.section = "Section is required";
    if (!form.topic) e.topic = "Please select a topic";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleConfirm() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const appointmentId = uuid();

      // Read logged-in user's UID from localStorage
      const appointerId = localStorage.getItem("uid") || null;

      const appointmentData = {
        // Student / appointer info
        appointerId,                                          // UID from localStorage
        studentName:  form.name,
        studentEmail: form.email,
        studentID:    form.studentID,
        yearLevel:    form.yearLevel,
        section:      form.section,

        // Teacher info (stored at time of booking)
        teacherId:    selectedTeacher.id,                    // Realtime DB key (userID)
        teacherName:  `${selectedTeacher.firstName} ${selectedTeacher.lastName}`,
        teacherEmail: selectedTeacher.email     || "",
        teacherUID:   selectedTeacher.teacherID || "",

        // Schedule
        date:         formatDate(selectedDate),
        dateISO:      selectedDate.toISOString(),
        time:         selectedTime,

        // Consultation
        topic:        form.topic,
        notes:        form.notes,

        // Meta
        status:       "pending",
        createdAt:    new Date().toISOString(),
      };

      // Write to Realtime DB: appointments/{appointmentId}
      const appointmentRef = ref(db, `appointments/${appointmentId}`);
      await set(appointmentRef, appointmentData);

      onConfirm({ ...form, appointmentId });
    } catch (err) {
      console.error("Failed to save appointment:", err);
      setErrors((e) => ({ ...e, submit: "Failed to submit. Please try again." }));
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = (field) => `
    w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-800
    placeholder:text-slate-400 outline-none transition-all
    focus:ring-2 focus:ring-blue-200 focus:border-blue-400
    ${errors[field] ? "border-red-300 bg-red-50" : "border-slate-200"}
  `;

  function DropdownField({ field, label, value, options, open, setOpen, required }) {
    return (
      <div className="relative">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`
            w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between
            outline-none transition-all hover:border-slate-300
            ${errors[field] ? "border-red-300" : "border-slate-200"}
            ${value ? "text-slate-800" : "text-slate-400"}
          `}
        >
          {value || `Select ${label.toLowerCase()}`}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { update(field, opt); setOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
      <h2 className="font-bold text-slate-800 text-lg mb-1">Your Information</h2>
      <p className="text-slate-400 text-sm mb-6">Please provide your student details for the consultation</p>

      {/* Teacher chip */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
          {(selectedTeacher?.firstName?.[0] || "").toUpperCase()}
          {(selectedTeacher?.lastName?.[0] || "").toUpperCase()}
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Booking with</p>
          <p className="text-sm font-semibold text-slate-800">
            {selectedTeacher?.firstName} {selectedTeacher?.lastName}
          </p>
        </div>
      </div>

      {/* Full Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputCls("name")}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            placeholder="john@school.edu"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputCls("email")}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Student ID */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Student ID <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. S-20241234"
          value={form.studentID}
          onChange={(e) => update("studentID", e.target.value)}
          className={inputCls("studentID")}
        />
        {errors.studentID && <p className="text-red-400 text-xs mt-1">{errors.studentID}</p>}
      </div>

      {/* Year Level + Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <DropdownField
          field="yearLevel"
          label="Year Level"
          value={form.yearLevel}
          options={YEAR_LEVELS}
          open={yearOpen}
          setOpen={setYearOpen}
          required
        />
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Section <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Rizal, Section A"
            value={form.section}
            onChange={(e) => update("section", e.target.value)}
            className={inputCls("section")}
          />
          {errors.section && <p className="text-red-400 text-xs mt-1">{errors.section}</p>}
        </div>
      </div>

      {/* Consultation Topic */}
      <div className="mb-4">
        <DropdownField
          field="topic"
          label="Consultation Topic"
          value={form.topic}
          options={TOPICS}
          open={topicOpen}
          setOpen={setTopicOpen}
          required
        />
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Additional Notes{" "}
          <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Tell us what you'd like to discuss..."
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
        />
      </div>

      {/* Appointment Summary */}
      <div className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-100">
        <h3 className="font-bold text-slate-800 text-base mb-3">Appointment Summary</h3>
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Teacher:</span>{" "}
          {selectedTeacher?.firstName} {selectedTeacher?.lastName}
        </p>
        <p className="text-sm text-slate-600 mt-1">
          <span className="font-semibold">Date:</span> {formatDate(selectedDate)}
        </p>
        <p className="text-sm text-slate-600 mt-1">
          <span className="font-semibold">Time:</span> {selectedTime}
        </p>
      </div>

      {errors.submit && (
        <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {errors.submit}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className={`inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5
            ${submitting
              ? "bg-slate-400 text-white cursor-not-allowed"
              : "bg-slate-800 hover:bg-slate-700 text-white"}`}
        >
          {submitting ? "Submitting..." : (<>Confirm Appointment <ArrowRight className="w-4 h-4" /></>)}
        </button>
      </div>
    </div>
  );
}

/* ─── Confirmation screen ─── */
function Confirmed({ selectedDate, selectedTime, selectedTeacher, form, onReset }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-10 shadow-sm text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <Check className="w-8 h-8 text-green-500" strokeWidth={2.5} />
      </div>
      <h2 className="font-black text-2xl text-slate-900 mb-2">Booking Confirmed!</h2>
      <p className="text-slate-500 text-sm mb-1">
        A confirmation has been sent to{" "}
        <span className="font-semibold text-slate-700">{form.email}</span>
      </p>
      <p className="text-slate-400 text-xs mb-8">
        Appointment ID:{" "}
        <span className="font-mono text-slate-600">{form.appointmentId}</span>
      </p>

      <div className="bg-blue-50 rounded-xl p-5 text-left border border-blue-100 mb-8 max-w-sm mx-auto space-y-1.5">
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Student:</span> {form.name}
        </p>
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Student ID:</span> {form.studentID}
        </p>
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Year & Section:</span> {form.yearLevel} – {form.section}
        </p>
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Teacher:</span>{" "}
          {selectedTeacher?.firstName} {selectedTeacher?.lastName}
        </p>
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Date:</span> {formatDate(selectedDate)}
        </p>
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Time:</span> {selectedTime}
        </p>
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Topic:</span> {form.topic}
        </p>
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Status:</span>{" "}
          <span className="text-amber-600 font-semibold">Pending</span>
        </p>
      </div>

      <button
        onClick={onReset}
        className="bg-slate-900 text-white font-semibold text-sm px-7 py-3 rounded-xl hover:bg-slate-700 transition-all"
      >
        Book Another Consultation
      </button>
    </div>
  );
}

/* ─── Main Page ─── */
export default function BookingPage() {
  const [step, setStep] = useState(1);   // 1=teacher  2=date  3=time  4=details
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmedForm, setConfirmedForm] = useState(null);

  function reset() {
    setStep(1);
    setSelectedTeacher(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setConfirmedForm(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {!confirmedForm && (
          <button
            onClick={() => step > 1 ? setStep((s) => s - 1) : window.history.back()}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        {!confirmedForm && (
          <>
            <h1
              className="text-4xl font-black text-slate-900 mb-6 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Book Your Consultation
            </h1>
            <StepIndicator step={step} />
          </>
        )}

        {!confirmedForm && step === 1 && (
          <StepTeacher
            selectedTeacher={selectedTeacher}
            onSelect={setSelectedTeacher}
            onContinue={() => setStep(2)}
          />
        )}
        {!confirmedForm && step === 2 && (
          <StepDate
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        )}
        {!confirmedForm && step === 3 && (
          <StepTime
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
            onBack={() => setStep(2)}
            onContinue={() => setStep(4)}
          />
        )}
        {!confirmedForm && step === 4 && (
          <StepDetails
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedTeacher={selectedTeacher}
            onBack={() => setStep(3)}
            onConfirm={(form) => setConfirmedForm(form)}
          />
        )}

        {confirmedForm && (
          <Confirmed
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedTeacher={selectedTeacher}
            form={confirmedForm}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}