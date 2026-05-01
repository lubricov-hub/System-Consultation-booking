import { CalendarDays, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AppointmentsPage() {
  const navigate = useNavigate();

  // In a real app you'd fetch appointments from state/API
  const appointments = [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Back link */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Heading */}
        <h1
          className="text-4xl font-black text-slate-900 mb-2 tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          My Appointments
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          View and manage your teacher consultation appointments
        </p>

        {/* Empty state card */}
        {appointments.length === 0 && (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm py-20 px-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 flex items-center justify-center mb-6">
              <CalendarDays className="w-16 h-16 text-slate-300" strokeWidth={1.2} />
            </div>
            <h2 className="font-bold text-slate-800 text-xl mb-3">No Appointments Yet</h2>
            <p className="text-slate-400 text-sm max-w-md mb-8">
              You haven't booked any teacher consultations yet. Start by scheduling your first appointment.
            </p>
            <button
              onClick={() => navigate("/book")}
              className="bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
            >
              Book Your First Consultation
            </button>
          </div>
        )}

        {/* Appointment list (when there are appointments) */}
        {appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map((apt, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{apt.topic}</p>
                  <p className="text-slate-400 text-sm mt-1">{apt.date} · {apt.time}</p>
                </div>
                <span className="text-xs font-semibold bg-green-100 text-green-600 px-3 py-1 rounded-full">Confirmed</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
