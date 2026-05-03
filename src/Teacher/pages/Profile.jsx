import { useState, useEffect } from "react";
import { COLORS } from "../constants";
import { Card } from "../components/Card";

// ── Firebase ─────────────────────────────────────────────────────────────────
// Replace these values with your actual Firebase project config
import {  ref, get, update } from "firebase/database";
import { db } from "../../Firebase";


// ── Field definitions ─────────────────────────────────────────────────────────
const FIELDS = [
  ["First Name",   "firstName",   "text"],
  ["Last Name",    "lastName",    "text"],
  ["Middle Name",  "middleName",  "text"],
  ["Display Name", "DisplayName", "text"],
  ["Phone Number", "phoneNumber", "tel"],
  ["Email",        "email",       "email"],
  ["Department",   "department",  "text"],
  ["Teacher ID",   "teacherID",   "text"],
];

const EMPTY_FORM = {
  firstName:   "",
  lastName:    "",
  middleName:  "",
  DisplayName: "",
  phoneNumber: "",
  email:       "",
  department:  "",
  teacherID:   "",
  bio:         "",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Profile() {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "saving" | "saved" | "error"
  const [errMsg, setErrMsg] = useState("");

  // Read UID from localStorage (stored as "uid" during login)
  const uid = localStorage.getItem("uid");

  // ── Load data on mount ────────────────────────────────────────────────────
  useEffect(() => {
    if (!uid) {
      setErrMsg("No user session found. Please log in again.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    get(ref(db, `users/${uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setForm({
            firstName:   data.firstName   ?? "",
            lastName:    data.lastName    ?? "",
            middleName:  data.middleName  ?? "",
            DisplayName: data.DisplayName ?? "",
            phoneNumber: data.phoneNumber ?? "",
            email:       data.email       ?? "",
            department:  data.department  ?? "",
            teacherID:   data.teacherID   ?? "",
            bio:         data.bio         ?? "",
          });
        }
        setStatus("idle");
      })
      .catch((err) => {
        console.error("Firebase read error:", err);
        setErrMsg("Failed to load profile. Check your connection.");
        setStatus("error");
      });
  }, [uid]);

  // ── Save data ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!uid) {
      setErrMsg("No user session found. Please log in again.");
      setStatus("error");
      return;
    }

    setStatus("saving");

    try {
      await update(ref(db, `users/${uid}`), {
        firstName:   form.firstName,
        lastName:    form.lastName,
        middleName:  form.middleName,
        DisplayName: form.DisplayName,
        phoneNumber: form.phoneNumber,
        email:       form.email,
        department:  form.department,
        teacherID:   form.teacherID,
        bio:         form.bio,
      });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error("Firebase write error:", err);
      setErrMsg("Failed to save changes. Please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ── Derived display values ────────────────────────────────────────────────
  const initials =
    ((form.firstName?.[0] ?? "") + (form.lastName?.[0] ?? "")).toUpperCase() || "?";

  const displayLabel =
    form.DisplayName ||
    [form.firstName, form.lastName].filter(Boolean).join(" ") ||
    "—";

  const isDisabled = status === "loading" || status === "saving";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Profile & Settings</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 28, fontSize: 15 }}>
        Manage your personal information and account details.
      </p>

      {/* Error banner */}
      {status === "error" && (
        <div
          style={{
            background: COLORS.redLight,
            color: COLORS.red,
            borderRadius: 10,
            padding: "12px 18px",
            marginBottom: 20,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          ⚠ {errMsg}
        </div>
      )}

      {/* Loading hint */}
      {status === "loading" && (
        <p style={{ color: COLORS.textMuted, marginBottom: 16, fontSize: 14 }}>
          ⏳ Loading your profile…
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* ── Personal Information ── */}
        <Card>
          <h3 style={{ margin: "0 0 20px", fontWeight: 700 }}>Personal Information</h3>

          {FIELDS.map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.textMuted,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
                disabled={isDisabled}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: `1px solid ${COLORS.border}`,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  background: isDisabled ? COLORS.bg : "#fff",
                  color: COLORS.text,
                  cursor: isDisabled ? "not-allowed" : "text",
                }}
                onFocus={(e) => { if (!isDisabled) e.target.style.borderColor = COLORS.accent; }}
                onBlur={(e)  => { e.target.style.borderColor = COLORS.border; }}
              />
            </div>
          ))}

          {/* Bio */}
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.textMuted,
                display: "block",
                marginBottom: 6,
              }}
            >
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setField("bio", e.target.value)}
              disabled={isDisabled}
              rows={3}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                fontSize: 14,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                background: isDisabled ? COLORS.bg : "#fff",
                color: COLORS.text,
                cursor: isDisabled ? "not-allowed" : "text",
              }}
              onFocus={(e) => { if (!isDisabled) e.target.style.borderColor = COLORS.accent; }}
              onBlur={(e)  => { e.target.style.borderColor = COLORS.border; }}
            />
          </div>
        </Card>

        {/* ── Profile Preview ── */}
        <div>
          <Card>
            <h3 style={{ margin: "0 0 20px", fontWeight: 700 }}>Profile Preview</h3>

            {/* Avatar row */}
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: COLORS.accent,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{displayLabel}</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
                  {form.department || "—"}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                  ID: {form.teacherID || "—"}
                </div>
              </div>
            </div>

            {/* Detail list */}
            {[
              ["📧 Email",      form.email       || "—"],
              ["📞 Phone",      form.phoneNumber || "—"],
              ["🏫 Department", form.department  || "—"],
              ["🪪 Teacher ID", form.teacherID   || "—"],
            ].map(([label, val]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: `1px solid ${COLORS.border}`,
                  fontSize: 13,
                }}
              >
                <span style={{ minWidth: 120, fontWeight: 600, color: COLORS.textMuted }}>{label}</span>
                <span style={{ color: COLORS.text, wordBreak: "break-word" }}>{val}</span>
              </div>
            ))}

            {form.bio && (
              <div
                style={{
                  marginTop: 16,
                  background: COLORS.bg,
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: COLORS.textMuted,
                  fontStyle: "italic",
                  lineHeight: 1.5,
                }}
              >
                "{form.bio}"
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Save button row */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 24, gap: 14 }}>
        <button
          onClick={handleSave}
          disabled={isDisabled}
          style={{
            background:
              status === "saved"   ? COLORS.green
            : isDisabled           ? COLORS.textMuted
            :                        COLORS.accent,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "13px 36px",
            fontWeight: 700,
            fontSize: 15,
            cursor: isDisabled ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {status === "saving"  ? "Saving…"
         : status === "saved"   ? "✔ Changes Saved!"
         : status === "loading" ? "Loading…"
         :                        "Save Changes"}
        </button>
      </div>
    </div>
  );
}