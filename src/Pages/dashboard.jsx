import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
const teacherOptions = ["Ms. Allen", "Mr. Brown", "Dr. Chen", "Ms. Davis"];
const statusLabels = ["All", "Requested", "Scheduled", "Completed", "Cancelled"];

function Dashboard() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    studentName: "",
    teacherName: teacherOptions[0],
    subject: "",
    preferredDate: "",
    message: "",
  });

  const [statusFilter, setStatusFilter] = useState("All");
  const [noteDrafts, setNoteDrafts] = useState({});

  useEffect(() => {
    fetchConsultations();
  }, []);

  async function fetchConsultations() {
    try {
      const response = await fetch(`${API_BASE}/api/consultations`);
      if (!response.ok) throw new Error('Failed to load consultations');
      const data = await response.json();
      setConsultations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredConsultations = useMemo(() => {
    return statusFilter === "All"
      ? consultations
      : consultations.filter((consultation) => consultation.status === statusFilter);
  }, [consultations, statusFilter]);

  const stats = useMemo(() => {
    return consultations.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      { Requested: 0, Scheduled: 0, Completed: 0, Cancelled: 0 }
    );
  }, [consultations]);

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.studentName.trim() || !form.subject.trim() || !form.preferredDate.trim()) {
      alert("Please fill in student name, subject, and preferred date.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: form.studentName.trim(),
          teacherName: form.teacherName,
          subject: form.subject.trim(),
          preferredDate: form.preferredDate,
          message: form.message.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to create consultation');

      const newConsultation = await response.json();
      setConsultations((prev) => [newConsultation, ...prev]);
      setForm({
        studentName: "",
        teacherName: teacherOptions[0],
        subject: "",
        preferredDate: "",
        message: "",
      });
    } catch (err) {
      alert('Error creating consultation: ' + err.message);
    }
  }

  async function updateConsultation(id, updates) {
    try {
      const response = await fetch(`${API_BASE}/api/consultations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update consultation');

      const updated = await response.json();
      setConsultations((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      alert('Error updating consultation: ' + err.message);
    }
  }

  function handleNoteChange(id, value) {
    setNoteDrafts((prev) => ({ ...prev, [id]: value }));
  }

  function saveNote(id) {
    const note = noteDrafts[id] || "";
    updateConsultation(id, { teacherNote: note });
    setNoteDrafts((prev) => ({ ...prev, [id]: undefined }));
  }

  function renderActionButtons(item) {
    const actions = [];
    if (item.status === "Requested") {
      actions.push(
        <button key="schedule" onClick={() => updateConsultation(item.id, { status: "Scheduled" })} style={actionButtonStyle}>
          Mark Scheduled
        </button>
      );
      actions.push(
        <button key="cancel" onClick={() => updateConsultation(item.id, { status: "Cancelled" })} style={cancelButtonStyle}>
          Cancel
        </button>
      );
    }
    if (item.status === "Scheduled") {
      actions.push(
        <button key="complete" onClick={() => updateConsultation(item.id, { status: "Completed" })} style={actionButtonStyle}>
          Mark Completed
        </button>
      );
      actions.push(
        <button key="cancel" onClick={() => updateConsultation(item.id, { status: "Cancelled" })} style={cancelButtonStyle}>
          Cancel
        </button>
      );
    }
    return actions;
  }

  if (loading) return <div style={{ padding: "24px", textAlign: "center" }}>Loading consultations...</div>;
  if (error) return <div style={{ padding: "24px", textAlign: "center", color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ textAlign: "left", padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "38px", marginBottom: "8px" }}>📚 Student-Teacher Consultation Dashboard</h1>
        <p style={{ color: "#5b5863", fontSize: "17px", maxWidth: "840px" }}>
          Create new consultation requests, track session status, and add teacher notes. Data is stored in MySQL database.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", marginBottom: "32px" }}>
        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>New Consultation Request</h2>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
            <label style={labelStyle}>
              Student Name
              <input
                type="text"
                name="studentName"
                value={form.studentName}
                onChange={handleFormChange}
                style={inputStyle}
                placeholder="e.g. Jose Martinez"
              />
            </label>
            <label style={labelStyle}>
              Teacher
              <select name="teacherName" value={form.teacherName} onChange={handleFormChange} style={inputStyle}>
                {teacherOptions.map((teacher) => (
                  <option key={teacher} value={teacher}>{teacher}</option>
                ))}
              </select>
            </label>
            <label style={labelStyle}>
              Subject
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleFormChange}
                style={inputStyle}
                placeholder="e.g. Algebra support"
              />
            </label>
            <label style={labelStyle}>
              Preferred Date
              <input
                type="date"
                name="preferredDate"
                value={form.preferredDate}
                onChange={handleFormChange}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Consultation Notes
              <textarea
                name="message"
                value={form.message}
                onChange={handleFormChange}
                style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                placeholder="Describe the topic, questions, or objectives."
              />
            </label>
            <button type="submit" style={primaryButtonStyle}>
              Request Consultation
            </button>
          </form>
        </section>

        <aside style={cardStyle}>
          <h2 style={sectionTitleStyle}>Status Summary</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {statusLabels.slice(1).map((status) => (
              <div key={status} style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", borderRadius: "12px", background: "#f8f7ff" }}>
                <span>{status}</span>
                <strong>{stats[status] || 0}</strong>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          {statusLabels.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                border: statusFilter === status ? "2px solid #4f46e5" : "1px solid #d6d3e1",
                background: statusFilter === status ? "#eef2ff" : "white",
                color: "#27272a",
                borderRadius: "999px",
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      <section>
        {filteredConsultations.length === 0 ? (
          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#555" }}>No consultations found for this filter. Add a new request to begin.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {filteredConsultations.map((item) => (
              <div key={item.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 8px", fontSize: "22px" }}>{item.subject}</h3>
                    <p style={{ margin: "0 6px 4px", color: "#5b5863" }}><strong>Student:</strong> {item.studentName}</p>
                    <p style={{ margin: "0 6px 4px", color: "#5b5863" }}><strong>Teacher:</strong> {item.teacherName}</p>
                    <p style={{ margin: "0 6px 4px", color: "#5b5863" }}><strong>Preferred:</strong> {item.preferredDate}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ padding: "6px 10px", borderRadius: "999px", background: statusBadgeColor(item.status), color: "white", fontWeight: 600, fontSize: "13px" }}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {item.message && (
                  <p style={{ margin: "14px 0", color: "#3f3f46" }}><strong>Details:</strong> {item.message}</p>
                )}

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
                  {renderActionButtons(item)}
                </div>

                <div style={{ display: "grid", gap: "10px" }}>
                  <label style={{ display: "grid", gap: "6px", fontSize: "14px" }}>
                    Teacher Note
                    <textarea
                      value={noteDrafts[item.id] ?? item.teacherNote}
                      onChange={(e) => handleNoteChange(item.id, e.target.value)}
                      placeholder="Enter the teacher's note or consultation summary."
                      style={{ ...inputStyle, minHeight: "90px" }}
                    />
                  </label>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button type="button" onClick={() => saveNote(item.id)} style={secondaryButtonStyle}>
                      Save Note
                    </button>
                    <button type="button" onClick={() => updateConsultation(item.id, { teacherNote: "" })} style={cancelButtonStyle}>
                      Clear Note
                    </button>
                  </div>
                  {item.teacherNote && (
                    <p style={{ margin: 0, padding: "12px", background: "#f8fafc", borderRadius: "14px", color: "#2c3e50" }}>
                      <strong>Saved note:</strong> {item.teacherNote}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const cardStyle = {
  borderRadius: "24px",
  padding: "24px",
  background: "white",
  border: "1px solid #e7e5e4",
  boxShadow: "0 18px 60px rgba(15, 23, 42, 0.06)",
};

const sectionTitleStyle = {
  margin: "0 0 18px",
  fontSize: "22px",
};

const labelStyle = {
  display: "grid",
  gap: "8px",
  fontSize: "15px",
  color: "#27272a",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "16px",
  border: "1px solid #d6d3e1",
  outline: "none",
  fontSize: "15px",
  color: "#111827",
  background: "#fbfbfb",
};

const primaryButtonStyle = {
  padding: "14px 18px",
  borderRadius: "16px",
  border: "none",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
};

const secondaryButtonStyle = {
  padding: "12px 16px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "white",
  color: "#4f46e5",
  cursor: "pointer",
  fontWeight: 700,
};

const actionButtonStyle = {
  padding: "10px 14px",
  borderRadius: "14px",
  border: "none",
  background: "#4338ca",
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
};

const cancelButtonStyle = {
  padding: "10px 14px",
  borderRadius: "14px",
  border: "1px solid #d6d3e1",
  background: "#f8fafc",
  color: "#4b5563",
  cursor: "pointer",
  fontWeight: 700,
};

function statusBadgeColor(status) {
  switch (status) {
    case "Requested":
      return "#7c3aed";
    case "Scheduled":
      return "#047857";
    case "Completed":
      return "#1d4ed8";
    case "Cancelled":
      return "#dc2626";
    default:
      return "#374151";
  }
}

export default Dashboard;