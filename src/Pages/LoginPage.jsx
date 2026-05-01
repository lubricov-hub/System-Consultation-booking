import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {auth, db} from  "../Firebase.js";
import {Link} from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";

const COLORS = {
  accent: "#6C63FF",
  accentDark: "#5651d4",
  accentLight: "#EEF0FF",
  teacher: "#1A1D2E",
  teacherAccent: "#F59E0B",
  teacherLight: "#FEF3C7",
  bg: "#F7F8FC",
  white: "#FFFFFF",
  text: "#1A1D2E",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  error: "#EF4444",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(null);

  const isTeacher = role === "teacher";

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Login with Firebase Auth
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;


      // ✅ Store UID in localStorage
      localStorage.setItem("uid", user.uid);

      // 📡 Fetch user data from Realtime DB
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        // ✅ store role
        localStorage.setItem("role", userData.role);

        setLoggedIn(userData.role);

        // 🚀 Redirect
        setTimeout(() => {
          if (userData.role === "teacher") {
            navigate("/teacher"); // or setup
          } else {
            navigate("/");
          }
        }, 1000);

      } else {
        setError("User data not found in database.");
      }

    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
  const switchRole = (r) => {
    setRole(r);
    setEmail("");
    setPassword("");
    setError("");
  };

  


  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        background: isTeacher ? COLORS.teacher : COLORS.accent,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        transition: "background 0.4s ease",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: isTeacher ? "#ffffff08" : "#ffffff15" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: isTeacher ? "#ffffff08" : "#ffffff10" }} />
        <div style={{ position: "absolute", top: "40%", right: -40, width: 160, height: 160, borderRadius: "50%", background: isTeacher ? "#F59E0B22" : "#ffffff08" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: 72, marginBottom: 20, filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.2))" }}>
            {isTeacher ? "🎓" : "📚"}
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 12px", letterSpacing: -1, lineHeight: 1.1 }}>
            {isTeacher ? "Teacher Portal" : "Student Portal"}
          </h1>
          <p style={{ fontSize: 16, opacity: 0.8, maxWidth: 280, lineHeight: 1.6, margin: "0 auto 36px" }}>
            {isTeacher
              ? "Manage your consultations, availability, and student appointments all in one place."
              : "Schedule consultations with your teachers and track your academic progress."}
          </p>

          {/* Demo credentials hint */}
          <div style={{ background: "#ffffff18", backdropFilter: "blur(8px)", borderRadius: 14, padding: "16px 24px", textAlign: "left" }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Demo Credentials</div>
            <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>📧 {isTeacher ? "myemail@gmail.com" : "mystuemail@gmail.com" }</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>🔑 {isTeacher ?" tech213" : "stu3321"}</div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: 480, background: COLORS.white, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 52px", boxShadow: "-8px 0 40px rgba(0,0,0,0.06)" }}>
        {/* Logo */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontWeight: 900, fontSize: 22, color: COLORS.accent, letterSpacing: -0.5 }}>📖 EduConsult</div>
          <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>Teacher Consultation System</div>
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px", color: COLORS.text }}>Sign in</h2>
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 28px" }}>Select your role to continue</p>

        {/* Role Toggle */}
        <div style={{ display: "flex", background: COLORS.bg, borderRadius: 14, padding: 5, marginBottom: 28, border: `1px solid ${COLORS.border}` }}>
          {[
            { id: "student", label: "Student", icon: "🎒" },
            { id: "teacher", label: "Teacher", icon: "🎓" },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => switchRole(id)}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 10,
                border: "none",
                background: role === id ? (id === "teacher" ? COLORS.teacher : COLORS.accent) : "transparent",
                color: role === id ? "#fff" : COLORS.textMuted,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.25s ease",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Role indicator pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: isTeacher ? COLORS.teacherAccent : COLORS.accent }} />
          <span style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>
            Logging in as <strong style={{ color: isTeacher ? COLORS.teacher : COLORS.accent }}>{isTeacher ? "Teacher" : "Student"}</strong>
          </span>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 7 }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            placeholder={isTeacher ? "teacher@school.edu" : "student@school.edu"}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${error ? COLORS.error : COLORS.border}`, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = isTeacher ? COLORS.teacher : COLORS.accent}
            onBlur={e => e.target.style.borderColor = error ? COLORS.error : COLORS.border}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 7 }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter your password"
              style={{ width: "100%", padding: "12px 48px 12px 16px", borderRadius: 12, border: `1.5px solid ${error ? COLORS.error : COLORS.border}`, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = isTeacher ? COLORS.teacher : COLORS.accent}
              onBlur={e => e.target.style.borderColor = error ? COLORS.error : COLORS.border}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
            <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: COLORS.textMuted }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <button style={{ background: "none", border: "none", color: isTeacher ? COLORS.teacher : COLORS.accent, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Forgot password?
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#FEE2E2", color: COLORS.error, borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 12,
            border: "none",
            background: loading ? COLORS.border : isTeacher ? COLORS.teacher : COLORS.accent,
            color: loading ? COLORS.textMuted : "#fff",
            fontWeight: 800,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {loading ? (
            <>
              <div style={{ width: 18, height: 18, border: "2px solid #aaa", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Signing in...
            </>
          ) : (
            `Sign in as ${isTeacher ? "Teacher" : "Student"} →`
          )}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
          <span style={{ fontSize: 12, color: COLORS.textMuted }}>or</span>
          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
        </div>

        {/* Quick switch hint */}
        <div style={{ textAlign: "center", fontSize: 13, color: COLORS.textMuted }}>
          Are you new? <Link to="/register" className=" underline text-accent hover:text-accentDark font-bold">Register</Link>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48, fontSize: 12, color: COLORS.textMuted, textAlign: "center" }}>
          © 2026 EduConsult · Teacher Consultation System
        </div>
      </div>
    </div>
  );
}
