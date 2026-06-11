import { useEffect, useState } from "react";
import API from "../api/api";

export default function MyResumes() {
  const [resumes, setResumes] = useState([]);

  const fetchResumes = async () => {
    try {
      const res = await API.get("/resumes");
      setResumes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteResume = async (id) => {
    try {
      await API.delete(`/resume/${id}`);
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Resumes</h2>

      {resumes.map((r) => (
        <div key={r.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <h3>{r.title}</h3>
          <p><b>{r.full_name}</b></p>
          <p>{r.skills}</p>

          <button onClick={() => deleteResume(r.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}