import { CalendarDays, Clock3, FileText, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5">
        <Icon className="w-5 h-5 text-blue-500" strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="font-bold text-slate-900 text-base mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function ConfirmedPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive booking data passed via navigate state, or fall back to defaults
  const booking = location.state || {
    date: "Thursday, April 30, 2026",
    time: "01:30 PM",
    topic: "General Questions & Support",
    email: "student@example.com",
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex items-start justify-center py-12 px-6">
      <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Top confirmed section */}
        <div className="px-10 pt-12 pb-8 text-center">
          {/* Green check icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={1.8} />
          </div>

          <h1
            className="text-3xl font-black text-slate-900 mb-2 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Appointment Confirmed!
          </h1>
          <p className="text-slate-400 text-sm">
            Your teacher consultation has been successfully scheduled
          </p>
        </div>

        <div className="px-10 pb-10 space-y-4">
          {/* Appointment Details card */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-7 space-y-5">
            <h2 className="font-bold text-slate-800 text-base">Appointment Details</h2>
            <DetailRow icon={CalendarDays} label="Date" value={booking.date} />
            <DetailRow icon={Clock3}      label="Time" value={booking.time} />
            <DetailRow icon={FileText}    label="Consultation Topic" value={booking.topic} />
            <DetailRow icon={Mail}        label="Confirmation sent to" value={booking.email} />
          </div>

          {/* What's Next card */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-7">
            <h2 className="font-bold text-slate-800 text-base mb-4">What's Next?</h2>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-slate-400">•</span>
                A confirmation email has been sent to your inbox
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-slate-400">•</span>
                You'll receive a reminder 24 hours before your appointment
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-slate-400">•</span>
                Meeting location/link will be shared via email
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate("/appointments")}
              className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              View All Appointments
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
            >
              Back to Home <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Contact support */}
          <p className="text-center text-slate-400 text-sm pt-2">
            Need to make changes?{" "}
            <button className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
