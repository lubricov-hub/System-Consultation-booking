import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

/* ─── constants ─── */
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","12:30 PM",
  "01:00 PM","01:30 PM","02:00 PM","02:30 PM",
  "03:00 PM","03:30 PM","04:00 PM","04:30 PM",
  "05:00 PM","05:30 PM",
];

const TOPICS = [
  "Academic Progress Review",
  "Assignment Help & Guidance",
  "Course Selection & Planning",
  "General Questions & Support",
];

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

/* ─── Step indicator ─── */
function StepIndicator({ step }) {
  const steps = ["Date", "Time", "Details"];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${done ? "bg-green-500 text-white" : active ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}
            `}>
              {done ? <Check className="w-4 h-4" /> : idx}
            </div>
            <span className={`text-sm font-medium ${active ? "text-slate-800" : "text-slate-400"}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-slate-300 mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Step 1: Calendar ─── */
function StepDate({ selectedDate, onSelect, onContinue }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function isSelected(day) {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear
    );
  }
  function isToday(day) {
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    );
  }
  function isPast(day) {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  }

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Previous month tail days
  const prevDaysInMonth = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);
  const prevTail = blanks.map((_, i) => prevDaysInMonth - firstDay + 1 + i);

  // Next month head days
  const totalCells = blanks.length + days.length;
  const nextDays = totalCells % 7 === 0 ? [] : Array.from({ length: 7 - (totalCells % 7) }, (_, i) => i + 1);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
      <h2 className="font-bold text-slate-800 text-lg mb-1">Select a Date</h2>
      <p className="text-slate-400 text-sm mb-8">Choose your preferred consultation date</p>

      {/* Calendar */}
      <div className="max-w-xs mx-auto">
        {/* Nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>
          <span className="font-semibold text-slate-800 text-sm">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7">
          {prevTail.map(d => (
            <div key={`p-${d}`} className="text-center py-2 text-xs text-slate-300">{d}</div>
          ))}
          {days.map(day => (
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
          {nextDays.map(d => (
            <div key={`n-${d}`} className="text-center py-2 text-xs text-slate-300">{d}</div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-8">
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

/* ─── Step 2: Time Slots ─── */
function StepTime({ selectedDate, selectedTime, onSelect, onBack, onContinue }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
      <h2 className="font-bold text-slate-800 text-lg mb-1">Select a Time Slot</h2>
      <p className="text-slate-400 text-sm mb-8">
        Available times for {formatDate(selectedDate)}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TIME_SLOTS.map(slot => (
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
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
        >
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

/* ─── Step 3: Details ─── */
function StepDetails({ selectedDate, selectedTime, onBack, onConfirm }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", notes: "" });
  const [topicOpen, setTopicOpen] = useState(false);
  const [errors, setErrors] = useState({});

  function update(field, val) {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.topic) e.topic = "Please select a topic";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleConfirm() {
    if (validate()) onConfirm(form);
  }

  const inputCls = (field) => `
    w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-800
    placeholder:text-slate-400 outline-none transition-all
    focus:ring-2 focus:ring-blue-200 focus:border-blue-400
    ${errors[field] ? "border-red-300 bg-red-50" : "border-slate-200"}
  `;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
      <h2 className="font-bold text-slate-800 text-lg mb-1">Your Information</h2>
      <p className="text-slate-400 text-sm mb-8">Please provide your details for the consultation</p>

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
            onChange={e => update("name", e.target.value)}
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
            placeholder="john@example.com"
            value={form.email}
            onChange={e => update("email", e.target.value)}
            className={inputCls("email")}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
        <input
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={form.phone}
          onChange={e => update("phone", e.target.value)}
          className={inputCls("phone")}
        />
      </div>

      {/* Topic dropdown */}
      <div className="mb-4 relative">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Consultation Topic <span className="text-red-400">*</span>
        </label>
        <button
          type="button"
          onClick={() => setTopicOpen(o => !o)}
          className={`
            w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between
            outline-none transition-all
            ${errors.topic ? "border-red-300" : "border-slate-200"}
            ${form.topic ? "text-slate-800" : "text-slate-400"}
            hover:border-slate-300
          `}
        >
          {form.topic || "Select consultation topic"}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${topicOpen ? "rotate-180" : ""}`} />
        </button>
        {topicOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {TOPICS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => { update("topic", t); setTopicOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        )}
        {errors.topic && <p className="text-red-400 text-xs mt-1">{errors.topic}</p>}
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Additional Notes <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Tell us what you'd like to discuss..."
          value={form.notes}
          onChange={e => update("notes", e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
        />
      </div>

      {/* Appointment Summary */}
      <div className="bg-blue-50 rounded-xl p-5 mb-8 border border-blue-100">
        <h3 className="font-bold text-slate-800 text-base mb-3">Appointment Summary</h3>
        <p className="text-sm text-slate-600"><span className="font-semibold">Date:</span> {formatDate(selectedDate)}</p>
        <p className="text-sm text-slate-600 mt-1"><span className="font-semibold">Time:</span> {selectedTime}</p>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleConfirm}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
        >
          Confirm Appointment <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Confirmation screen ─── */
function Confirmed({ selectedDate, selectedTime, form, onReset }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-10 shadow-sm text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <Check className="w-8 h-8 text-green-500" strokeWidth={2.5} />
      </div>
      <h2 className="font-black text-2xl text-slate-900 mb-2">Booking Confirmed!</h2>
      <p className="text-slate-500 text-sm mb-8">
        A confirmation has been sent to <span className="font-semibold text-slate-700">{form.email}</span>
      </p>
      <div className="bg-blue-50 rounded-xl p-5 text-left border border-blue-100 mb-8 max-w-sm mx-auto">
        <p className="text-sm text-slate-600"><span className="font-semibold">Name:</span> {form.name}</p>
        <p className="text-sm text-slate-600 mt-1"><span className="font-semibold">Date:</span> {formatDate(selectedDate)}</p>
        <p className="text-sm text-slate-600 mt-1"><span className="font-semibold">Time:</span> {selectedTime}</p>
        <p className="text-sm text-slate-600 mt-1"><span className="font-semibold">Topic:</span> {form.topic}</p>
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
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmedForm, setConfirmedForm] = useState(null);

  function reset() {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setConfirmedForm(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Back link */}
        {!confirmedForm && (
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : window.history.back()}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        {/* Title */}
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

        {/* Steps */}
        {!confirmedForm && step === 1 && (
          <StepDate
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            onContinue={() => setStep(2)}
          />
        )}
        {!confirmedForm && step === 2 && (
          <StepTime
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        )}
        {!confirmedForm && step === 3 && (
          <StepDetails
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onBack={() => setStep(2)}
            onConfirm={(form) => setConfirmedForm(form)}
          />
        )}

        {/* Confirmed */}
        {confirmedForm && (
          <Confirmed
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            form={confirmedForm}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}
