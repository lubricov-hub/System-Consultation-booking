import { useState } from "react";
import { Search, X, Check, Clock, XCircle, Loader2 } from "lucide-react";
import { db } from "../Firebase.js";
import { ref, get } from "firebase/database";

function StatusBadge({ status }) {
  const map = {
    pending:   { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  icon: <Clock className="w-3.5 h-3.5" />,   label: "Pending"   },
    confirmed: { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   icon: <Check className="w-3.5 h-3.5" />,   label: "Confirmed" },
    completed: { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  icon: <Check className="w-3.5 h-3.5" />,   label: "Completed" },
    cancelled: { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    icon: <XCircle className="w-3.5 h-3.5" />, label: "Cancelled" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.text} ${s.border}`}>
      {s.icon} {s.label}
    </span>
  );
}

export default function CheckAppointmentModal({ onClose }) {
  const [inputId, setInputId]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [appt, setAppt]           = useState(null);
  const [error, setError]         = useState("");

  async function handleSearch() {
    const id = inputId.trim();
    if (!id) { setError("Please enter an appointment ID."); return; }

    setLoading(true);
    setError("");
    setAppt(null);

    try {
      const snap = await get(ref(db, `appointments/${id}`));
      if (!snap.exists()) {
        setError("No appointment found with that ID. Please double-check and try again.");
      } else {
        setAppt({ id, ...snap.val() });
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  function handleReset() {
    setInputId("");
    setAppt(null);
    setError("");
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <Search className="w-5 h-5 text-blue-500" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Check Appointment</h2>
          <p className="text-slate-500 text-sm mt-1">
            Enter your appointment ID to view its current status.
          </p>
        </div>

        {/* Input */}
        {!appt && (
          <>
            <div className="relative mb-3">
              <input
                type="text"
                value={inputId}
                onChange={(e) => { setInputId(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. TA-1A3DG"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-mono"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleSearch}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all
                ${loading
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-slate-700 hover:-translate-y-0.5 shadow-md"}`}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching...</>
                : <><Search className="w-4 h-4" /> Find Appointment</>}
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              Your appointment ID was shown after booking.{" "}
              <span className="font-semibold text-slate-500">Check your screenshot or notes.</span>
            </p>
          </>
        )}

        {/* Result */}
        {appt && (
          <div className="animate-in fade-in duration-300">
            {/* Status banner */}
            <div className={`rounded-xl p-4 mb-5 border flex items-center justify-between
              ${appt.status === "confirmed" ? "bg-blue-50 border-blue-100" :
                appt.status === "completed" ? "bg-green-50 border-green-100" :
                appt.status === "cancelled" ? "bg-red-50 border-red-100" :
                "bg-amber-50 border-amber-100"}`}
            >
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Current Status</p>
                <StatusBadge status={appt.status} />
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Appointment ID</p>
                <p className="font-mono text-xs text-slate-600 font-bold break-all max-w-[140px]">
                  {appt.id}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5 mb-6">
              {[
                ["👤 Student",    appt.studentName],
                ["👨‍🏫 Teacher",    appt.teacherName],
                ["📅 Date",       appt.date],
                ["⏰ Time",       appt.time],
                ["📌 Topic",      appt.topic],
                ["🎓 Year",       appt.yearLevel  || "—"],
                ["🏫 Section",    appt.section    || "—"],
                ["📝 Notes",      appt.notes      || "No notes provided."],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-3 text-sm">
                  <span className="w-28 flex-shrink-0 text-slate-400 font-medium text-xs pt-0.5">{label}</span>
                  <span className="text-slate-700 font-medium">{val}</span>
                </div>
              ))}
            </div>

            {/* Search again */}
            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              Search Another Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}