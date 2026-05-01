import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {ref , set} from "firebase/database";

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

export default function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isTeacher = role === "teacher";

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

      console.log(user.uid);

      // Save user to Firestore
      if(user.uid){
          await set(ref(db, `users/${user.uid}`), {
          uid: user.uid,
          DisplayName: name,
          email,
          role,
          createdAt: new Date(),
        });
      } else {
        setError("Failed to create user.");
        return;
      }

      // Redirect logic
      if (role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (r) => {
    setRole(r);
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>

      {/* LEFT PANEL */}
      <div style={{
        flex: 1,
        background: isTeacher ? COLORS.teacher : COLORS.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        padding: 60,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 70 }}>
            {isTeacher ? "🎓" : "📚"}
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900 }}>
            {isTeacher ? "Join as Teacher" : "Join as Student"}
          </h1>
          <p style={{ opacity: 0.8 }}>
            {isTeacher
              ? "Create your teaching profile and start accepting consultations."
              : "Register and start booking consultations with teachers."}
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: 480,
        padding: 50,
        background: COLORS.white,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>

        <h2 style={{ fontSize: 26, fontWeight: 800 }}>
          Create Account
        </h2>

        {/* ROLE SWITCH */}
        <div style={{
          display: "flex",
          background: COLORS.bg,
          padding: 5,
          borderRadius: 12,
          margin: "20px 0",
        }}>
          {["student", "teacher"].map(r => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              style={{
                flex: 1,
                padding: 10,
                border: "none",
                borderRadius: 10,
                background: role === r
                  ? (r === "teacher" ? COLORS.teacher : COLORS.accent)
                  : "transparent",
                color: role === r ? "#fff" : COLORS.textMuted,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {r === "teacher" ? "🎓 Teacher" : "🎒 Student"}
            </button>
          ))}
        </div>

        {/* NAME */}
        <input
          placeholder="Username"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle(error)}
        />

        {/* EMAIL */}
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle(error)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle(error)}
        />

        {/* ERROR */}
        {error && (
          <div style={{
            color: COLORS.error,
            fontSize: 13,
            marginBottom: 10
          }}>
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            padding: 14,
            borderRadius: 12,
            border: "none",
            background: isTeacher ? COLORS.teacher : COLORS.accent,
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* LOGIN LINK */}
        <p style={{ marginTop: 20, fontSize: 13 }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: COLORS.accent, cursor: "pointer" }}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

const inputStyle = (error) => ({
  width: "100%",
  padding: "12px",
  marginBottom: 12,
  borderRadius: 10,
  border: `1px solid ${error ? "#EF4444" : "#E5E7EB"}`,
  outline: "none"
});