import { useState } from "react";
import { Power, LogOut, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase";

export default function LogoutButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("uid");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger button — drop this anywhere in your nav */}
      <button
        onClick={() => setOpen(true)}
        className="relative p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
      >
        <Power className="w-4.5 h-4.5" />
      </button>

      {/* Backdrop + Modal */}
      {open && (
        <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center gap-5 ring-1 ring-slate-100 animate-in fade-in zoom-in duration-200">

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center ring-1 ring-red-100">
              <LogOut className="w-6 h-6 text-red-400" strokeWidth={1.8} />
            </div>

            {/* Copy */}
            <div className="text-center">
              <h2 className="font-bold text-slate-800 text-[1.05rem] mb-1.5">
                Sign out?
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                You'll need to sign back in to access your appointments and bookings.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-700 disabled:bg-slate-300 text-white font-semibold text-[0.95rem] px-6 py-3 rounded-xl shadow-sm shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing out…
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Yes, sign me out
                  </>
                )}
              </button>

              <button
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[0.95rem] px-6 py-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <X className="w-4 h-4 text-slate-400" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}