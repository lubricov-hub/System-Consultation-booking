import { useState } from "react";
import { COLORS, FONT } from "../constants";
import { db, app } from "../../Firebase.js"; // import `app` so we can read its config
import { initializeApp, getApps, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

// ── Secondary auth instance ────────────────────────────────────────────────────
// Clones the config from the already-initialised primary app so we never
// hard-code or duplicate the Firebase config here.
// The secondary app shares the same Firebase project/DB but has its own
// isolated auth session, meaning createUserWithEmailAndPassword won't
// displace the logged-in admin.
function getSecondaryAuth() {
  const SECONDARY_NAME = "adminSecondary";

  // Reuse if already initialised (modal opened more than once)
  const existing = getApps().find(a => a.name === SECONDARY_NAME);
  if (existing) return getAuth(existing);

  // Pull config straight from the primary app instance
  const secondaryApp = initializeApp(app.options, SECONDARY_NAME);
  return getAuth(secondaryApp);
}

// ── Field config ───────────────────────────────────────────────────────────────
const FIELDS = [
  { label: "Display Name", key: "displayName", type: "text",     placeholder: "e.g. Ms. Maria Garcia", required: true },
  { label: "Email",         key: "email",       type: "email",    placeholder: "teacher@school.edu",    required: true },
  { label: "Password",      key: "password",    type: "password", placeholder: "Min. 6 characters",     required: true },
];

const EMPTY = { displayName: "", email: "", password: "" };

// ── Component ──────────────────────────────────────────────────────────────────
export default function AddTeacherModal({ onClose, onSuccess }) {
  const [form,   setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");

  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.displayName.trim())        e.displayName = "Display name is required";
    if (!form.email.trim())              e.email       = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password.trim())           e.password    = "Password is required";
    else if (form.password.length < 6)   e.password    = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!validate()) return;

    setStatus("loading");
    setErrMsg("");

    const secondaryAuth = getSecondaryAuth();

    try {
      // 1. Create auth account using the secondary isolated instance
      //    → primary auth (admin session) is completely untouched
      const userCred = await createUserWithEmailAndPassword(
        secondaryAuth,
        form.email.trim(),
        form.password
      );
      const { uid } = userCred.user;

      // 2. Sign out of the secondary instance immediately — clean up temp session
      await secondaryAuth.signOut();

      // 3. Write teacher profile to DB using the primary app's db reference
      await set(ref(db, `users/${uid}`), {
        uid,
        displayName: form.displayName.trim(),
        email:       form.email.trim().toLowerCase(),
        role:        "teacher",
        createdAt:   new Date().toISOString(),
      });

      setStatus("success");
      onSuccess?.({
        uid,
        displayName: form.displayName.trim(),
        email:       form.email.trim(),
        role:        "teacher",
      });

      setTimeout(() => onClose(), 1400);

    } catch (err) {
      console.error("Register teacher error:", err);

      // Clean up secondary session on error too
      try { await secondaryAuth.signOut(); } catch (_) {}

      const msg =
        err.code === "auth/email-already-in-use" ? "This email is already registered."
        : err.code === "auth/invalid-email"       ? "The email address is invalid."
        : err.code === "auth/weak-password"       ? "Password is too weak. Use at least 6 characters."
        : err.message ?? "Something went wrong. Please try again.";

      setErrMsg(msg);
      setStatus("error");
    }
  };

  // ── Style helpers ──────────────────────────────────────────────────────────
  const inputStyle = (key) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: `1.5px solid ${errors[key] ? COLORS.red : COLORS.border}`,
    background: errors[key] ? COLORS.redLight : COLORS.bg,
    fontSize: 14,
    color: COLORS.text,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: FONT,
    transition: "border-color 0.15s",
  });

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: COLORS.white,
          borderRadius: 22,
          padding: "38px 40px",
          width: 460,
          maxWidth: "95vw",
          boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
          fontFamily: FONT,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>Add New Teacher</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>
              Creates a Firebase account without signing you out.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: COLORS.bg,
              border: "none",
              borderRadius: 8,
              width: 32,
              height: 32,
              fontSize: 18,
              cursor: "pointer",
              color: COLORS.textMuted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Success banner */}
        {isSuccess && (
          <div style={{ background: COLORS.greenLight, color: COLORS.green, borderRadius: 12, padding: "14px 18px", marginBottom: 20, fontWeight: 700, fontSize: 14, textAlign: "center" }}>
            ✔ Teacher account created successfully!
          </div>
        )}

        {/* Error banner */}
        {status === "error" && errMsg && (
          <div style={{ background: COLORS.redLight, color: COLORS.red, borderRadius: 12, padding: "12px 16px", marginBottom: 18, fontWeight: 600, fontSize: 13 }}>
            ⚠ {errMsg}
          </div>
        )}

        {/* Fields */}
        {FIELDS.map(({ label, key, type, placeholder, required }) => (
          <div key={key} style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 7 }}>
              {label}
              {required && <span style={{ color: COLORS.red, marginLeft: 3 }}>*</span>}
            </label>
            <input
              type={type}
              value={form[key]}
              onChange={e => setField(key, e.target.value)}
              placeholder={placeholder}
              disabled={isLoading || isSuccess}
              style={inputStyle(key)}
              onFocus={e => { if (!errors[key]) e.target.style.borderColor = COLORS.accent; }}
              onBlur={e  => { e.target.style.borderColor = errors[key] ? COLORS.red : COLORS.border; }}
            />
            {errors[key] && (
              <div style={{ fontSize: 12, color: COLORS.red, marginTop: 5 }}>{errors[key]}</div>
            )}
          </div>
        ))}

        {/* Role pill — read only */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: COLORS.bg, borderRadius: 10, padding: "10px 14px", marginBottom: 26 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted }}>Role</span>
          <span style={{ background: COLORS.accentLight, color: COLORS.accent, fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "3px 12px" }}>
            🎓 Teacher
          </span>
          <span style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: "auto" }}>Assigned automatically</span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: `1.5px solid ${COLORS.border}`, background: "transparent", color: COLORS.textMuted, fontWeight: 700, fontSize: 14, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: FONT }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={isLoading || isSuccess}
            style={{ flex: 2, padding: "12px 0", borderRadius: 12, border: "none", background: isSuccess ? COLORS.green : isLoading ? COLORS.textMuted : COLORS.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: isLoading || isSuccess ? "not-allowed" : "pointer", fontFamily: FONT, transition: "background 0.2s" }}
          >
            {isLoading ? "Creating Account…" : isSuccess ? "✔ Done!" : "Add Teacher"}
          </button>
        </div>
      </div>
    </div>
  );
}