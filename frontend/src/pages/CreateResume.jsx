import { useState } from "react";
import API from "../api/api";

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

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/resume", form);
      setMessage("Resume created successfully ✅");

      setForm({
        title: "",
        full_name: "",
        email: "",
        phone: "",
        skills: "",
        education: "",
        experience: "",
      });
    } catch (err) {
      console.log(err);
      setMessage("Failed to create resume ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Resume</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} value={form.title} />
        <br />

        <input name="full_name" placeholder="Full Name" onChange={handleChange} value={form.full_name} />
        <br />

        <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
        <br />

        <input name="phone" placeholder="Phone" onChange={handleChange} value={form.phone} />
        <br />

        <textarea name="skills" placeholder="Skills" onChange={handleChange} value={form.skills} />
        <br />

        <textarea name="education" placeholder="Education" onChange={handleChange} value={form.education} />
        <br />

        <textarea name="experience" placeholder="Experience" onChange={handleChange} value={form.experience} />
        <br />

        <button type="submit">Create Resume</button>
      </form>

      <p>{message}</p>
    </div>
  );
}