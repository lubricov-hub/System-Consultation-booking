import { useState, useEffect } from "react";
import { COLORS } from "../constants";
import { Card } from "../components/Card";

import {  ref, get, update } from "firebase/database";
import {db} from "../../Firebase";
import { data } from "react-router-dom";

// ── Constants ─────────────────────────────────────────────────────────────────
const SLOTS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
];

const DEFAULT_DAYS = {
  Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false,
};

const DEFAULT_SLOTS = Object.fromEntries(
  SLOTS.map((s) => [s, s >= "09:00 AM" && s <= "05:00 PM"])
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function Availability() {
  const [enabledDays,  setEnabledDays]  = useState(DEFAULT_DAYS);
  const [enabledSlots, setEnabledSlots] = useState(DEFAULT_SLOTS);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "saving" | "saved" | "error"
  const [errMsg, setErrMsg] = useState("");

  const uid = localStorage.getItem("uid");

  // ── Load existing availability on mount ────────────────────────────────────
  useEffect(() => {
    if (!uid) {
      setErrMsg("No user session found. Please log in again.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    get(ref(db, `available/${uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Merge saved days with defaults (in case new days were added later)
          if (data.days) {
            setEnabledDays((prev) => ({ ...prev, ...data.days }));
          }

          // Merge saved slots with defaults
          if (data.slots) {
            setEnabledSlots((prev) => ({ ...prev, ...data.slots }));
          }
        }

        
        setStatus("idle");
      })
      .catch((err) => {
        console.error("Firebase read error:", err);
        setErrMsg("Failed to load availability. Check your connection.");
        setStatus("error");
      });

      console.log(enabledDays);
      console.log(enabledSlots);
  }, [uid]);

  // ── Save using update() — only touches days & slots, leaves other fields ──
  const handleSave = async () => {
    if (!uid) {
      setErrMsg("No user session found. Please log in again.");
      setStatus("error");
      return;
    }

    setStatus("saving");

    try {
      // update() merges into the existing node instead of overwriting it
      await update(ref(db, `available/${uid}`), {
        days:  enabledDays,
        slots: enabledSlots,
      });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error("Firebase write error:", err);
      setErrMsg("Failed to save. Please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const toggleDay  = (d) => setEnabledDays ((prev) => ({ ...prev, [d]: !prev[d] }));
  const toggleSlot = (s) => setEnabledSlots((prev) => ({ ...prev, [s]: !prev[s] }));

  const isDisabled = status === "loading" || status === "saving";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Availability Settings</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 28 }}>
        Configure which days and time slots students can book consultations with you.
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

      {status === "loading" && (
        <p style={{ color: COLORS.textMuted, marginBottom: 16, fontSize: 14 }}>
          ⏳ Loading your availability…
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>

        {/* ── Days ── */}
        <Card>
          <h3 style={{ margin: "0 0 16px", fontWeight: 700 }}>Available Days</h3>
          {Object.entries(enabledDays).map(([day, on]) => (
            <div
              key={day}
              onClick={() => !isDisabled && toggleDay(day)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: `1px solid ${COLORS.border}`,
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.6 : 1,
              }}
            >
              <span style={{ fontWeight: 600 }}>{day}</span>
              <div
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: on ? COLORS.accent : COLORS.border,
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: on ? 22 : 3,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s",
                  }}
                />
              </div>
            </div>
          ))}
        </Card>

        {/* ── Time Slots ── */}
        <Card>
          <h3 style={{ margin: "0 0 16px", fontWeight: 700 }}>Available Time Slots</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {SLOTS.map((s) => (
              <button
                key={s}
                onClick={() => toggleSlot(s)}
                disabled={isDisabled}
                style={{
                  padding: "10px 0",
                  borderRadius: 10,
                  border: `2px solid ${enabledSlots[s] ? COLORS.accent : COLORS.border}`,
                  background: enabledSlots[s] ? COLORS.accentLight : COLORS.white,
                  color: enabledSlots[s] ? COLORS.accent : COLORS.textMuted,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.6 : 1,
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Save button */}
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSave}
              disabled={isDisabled}
              style={{
                background:
                  status === "saved"  ? COLORS.green
                : isDisabled          ? COLORS.textMuted
                :                       COLORS.accent,
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "12px 32px",
                fontWeight: 700,
                fontSize: 15,
                cursor: isDisabled ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {status === "saving"  ? "Saving…"
             : status === "saved"   ? "✔ Saved!"
             : status === "loading" ? "Loading…"
             :                        "Save Availability"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}