import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const S = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f3",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "48px 16px 80px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    border: "0.5px solid #e2e2df",
    padding: "40px 44px",
    width: "100%",
    maxWidth: "620px",
  },
  header: {
    marginBottom: "32px",
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "6px",
  },
  iconBox: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  h1: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#888",
    margin: 0,
    paddingLeft: "42px",
  },
  progressWrap: {
    height: "2px",
    background: "#ebebeb",
    borderRadius: "2px",
    marginBottom: "32px",
    overflow: "hidden",
  },
  sectionLabel: {
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "12px",
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "12px",
    color: "#666",
    fontWeight: "500",
  },
  reqDot: {
    display: "inline-block",
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#d94f4f",
    marginLeft: "5px",
    verticalAlign: "middle",
    marginBottom: "1px",
  },
  input: {
    background: "#fafafa",
    border: "0.5px solid #e2e2df",
    borderRadius: "8px",
    padding: "10px 13px",
    fontSize: "14px",
    color: "#1a1a1a",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
    width: "100%",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#e8a0a0",
    background: "#fff8f8",
  },
  textarea: {
    background: "#fafafa",
    border: "0.5px solid #e2e2df",
    borderRadius: "8px",
    padding: "10px 13px",
    fontSize: "14px",
    color: "#1a1a1a",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "96px",
    lineHeight: "1.6",
    transition: "border-color 0.15s, box-shadow 0.15s",
    width: "100%",
    boxSizing: "border-box",
  },
  charCount: {
    fontSize: "11px",
    color: "#bbb",
    textAlign: "right",
    marginTop: "3px",
  },
  divider: {
    height: "0.5px",
    background: "#ebebeb",
    margin: "24px 0",
  },
  submitRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginTop: "28px",
  },
  btn: {
    background: "#1a1a1a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 22px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "inherit",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "opacity 0.15s, transform 0.1s",
    flexShrink: 0,
  },
  btnDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
  toast: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "13px",
    padding: "8px 14px",
    borderRadius: "8px",
    fontWeight: "500",
  },
  toastSuccess: {
    background: "#edfaf3",
    color: "#1e7d4a",
  },
  toastError: {
    background: "#fff0f0",
    color: "#c0392b",
  },
};

function Field({ label, required, error, children }) {
  return (
    <div style={S.fieldWrap}>
      <label style={S.label}>
        {label}
        {required && <span style={S.reqDot} title="Required" />}
      </label>
      {children}
    </div>
  );
}

function SectionLabel({ icon, children }) {
  return (
    <p style={S.sectionLabel}>
      <span style={{ fontSize: "13px" }}>{icon}</span>
      {children}
    </p>
  );
}

export default function CreateResume() {
  const [form, setForm] = useState({
    title: "",
    full_name: "",
    email: "",
    phone: "",
    skills: "",
    education: "",
    experience: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // { type, text }
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalFields = Object.keys(form).length;
  const filledFields = Object.values(form).filter((v) => v.trim()).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.title.trim()) newErrors.title = true;
    if (!form.full_name.trim()) newErrors.full_name = true;

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setMessage({ type: "error", text: "Title and full name are required." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      await API.post("/resume", form);
      setMessage({ type: "success", text: "Resume saved — redirecting…" });
      setForm({
        title: "",
        full_name: "",
        email: "",
        phone: "",
        skills: "",
        education: "",
        experience: "",
      });
      setTimeout(() => navigate("/my-resumes"), 1000);
    } catch (err) {
  console.log("SAVE RESUME ERROR:", err.response?.data || err.message);
  setMessage({
    type: "error",
    text: err.response?.data?.detail || "Couldn't save resume. Please try again.",
  });
}finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) =>
    errors[name]
      ? { ...S.input, ...S.inputError }
      : S.input;

  return (
    <div style={S.page}>
      <div style={S.card}>

        {/* Header */}
        <div style={S.header}>
          <div style={S.headerTop}>
            <div style={S.iconBox}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h1 style={S.h1}>New resume</h1>
          </div>
          <p style={S.subtitle}>Fill in your details — dots mark required fields.</p>
        </div>

        {/* Progress bar */}
        <div style={S.progressWrap}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#1a1a1a", borderRadius: "2px", transition: "width 0.3s ease" }} />
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Basics */}
          <SectionLabel icon="◈">Basics</SectionLabel>
          <div style={S.row}>
            <Field label="Resume title" required>
              <input
                name="title"
                placeholder="e.g. Senior Product Designer"
                onChange={handleChange}
                value={form.title}
                style={inputStyle("title")}
                autoComplete="off"
              />
            </Field>
            <Field label="Full name" required>
              <input
                name="full_name"
                placeholder="e.g. Priya Sharma"
                onChange={handleChange}
                value={form.full_name}
                style={inputStyle("full_name")}
                autoComplete="name"
              />
            </Field>
          </div>
          <div style={S.row}>
            <Field label="Email">
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                value={form.email}
                style={S.input}
                autoComplete="email"
              />
            </Field>
            <Field label="Phone">
              <input
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                onChange={handleChange}
                value={form.phone}
                style={S.input}
                autoComplete="tel"
              />
            </Field>
          </div>

          <div style={S.divider} />

          {/* Skills */}
          <SectionLabel icon="◈">Skills</SectionLabel>
          <Field label="Your skills">
            <textarea
              name="skills"
              placeholder="Figma, React, TypeScript, user research…"
              onChange={handleChange}
              value={form.skills}
              style={S.textarea}
            />
            <p style={S.charCount}>{form.skills.length} chars</p>
          </Field>

          <div style={S.divider} />

          {/* Education */}
          <SectionLabel icon="◈">Education</SectionLabel>
          <Field label="Education history">
            <textarea
              name="education"
              placeholder={"B.Tech Computer Science — IIT Bombay, 2019\nRelevant coursework: HCI, algorithms…"}
              onChange={handleChange}
              value={form.education}
              style={{ ...S.textarea, minHeight: "106px" }}
            />
            <p style={S.charCount}>{form.education.length} chars</p>
          </Field>

          <div style={S.divider} />

          {/* Experience */}
          <SectionLabel icon="◈">Experience</SectionLabel>
          <Field label="Work experience">
            <textarea
              name="experience"
              placeholder={"Product Designer — Zomato (2021–present)\nLed redesign of checkout flow, reducing drop-off by 18%."}
              onChange={handleChange}
              value={form.experience}
              style={{ ...S.textarea, minHeight: "126px" }}
            />
            <p style={S.charCount}>{form.experience.length} chars</p>
          </Field>

          {/* Submit row */}
          <div style={S.submitRow}>
            <button
              type="submit"
              disabled={loading}
              style={loading ? { ...S.btn, ...S.btnDisabled } : S.btn}
            >
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save resume
                </>
              )}
            </button>

            {message && (
              <div style={message.type === "success" ? { ...S.toast, ...S.toastSuccess } : { ...S.toast, ...S.toastError }}>
                {message.type === "success" ? "✓" : "✕"} {message.text}
              </div>
            )}
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  
}
