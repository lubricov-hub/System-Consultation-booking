import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { ShieldX, HomeIcon, GraduationCap } from "lucide-react";
import { auth, db } from "./Firebase";

function UnauthorizedModal({ role }) {
  const navigate = useNavigate();
  const isStudent = role === "student";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8 flex flex-col items-center gap-5 animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldX className="w-8 h-8 text-red-400" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">Access Denied</h2>
          <p className="text-sm text-gray-500 mt-1">
            You don't have permission to view this page.
          </p>
        </div>

        <button
          onClick={() => navigate(isStudent ? "/" : "/teacher")}
          className="flex items-center gap-2 w-full justify-center px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white text-sm font-medium transition-all"
        >
          {isStudent ? (
            <HomeIcon className="w-4 h-4" />
          ) : (
            <GraduationCap className="w-4 h-4" />
          )}
          {isStudent ? "Back to Home" : "Back to Teacher Dashboard"}
        </button>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children, requiredRole }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setNotLoggedIn(true);
        setLoading(false);
        return;
      }

      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          localStorage.setItem("uid", user.uid);
          localStorage.setItem("role", data.role);
          setUserRole(data.role);

          if (!requiredRole || data.role === requiredRole || data.role === "admin") {
            setAllowed(true);
          } else {
            setAllowed(false);
          }
        } else {
          setAllowed(false);
        }
      } catch (err) {
        console.error(err);
        setAllowed(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="relative flex items-center justify-center w-18 h-18">
          <div className="absolute inset-0 rounded-full border-2 border-sky-400/50 animate-ping" />
          <div className="absolute inset-0 rounded-full border-2 border-sky-400/50 animate-ping [animation-delay:0.5s]" />
          <div className="w-12 h-12 rounded-full border-3 border-sky-200/40 border-t-sky-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (notLoggedIn) return <Navigate to="/login" />;

  if (!allowed) return <UnauthorizedModal role={userRole} />;

  return children;
}