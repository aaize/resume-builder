import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");
        setProfile(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.page}>
      
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>Resume Builder</h2>

        <div style={styles.navActions}>
          <button style={styles.navButton} onClick={() => navigate("/create-resume")}>
            Create Resume
          </button>

          <button style={styles.navButton} onClick={() => navigate("/my-resumes")}>
            My Resumes
          </button>

          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div style={styles.card}>
        <h1 style={styles.title}>Dashboard</h1>

        {profile ? (
          <>
            <p style={styles.subtitle}>
              Welcome User <b>#{profile.user_id}</b>
            </p>

            <div style={styles.infoBox}>
              {profile.message}
            </div>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

const styles = {
  page: {
    fontFamily: "Arial",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#1f2937",
    color: "white",
  },

  logo: {
    margin: 0,
  },

  navActions: {
    display: "flex",
    gap: "10px",
  },

  navButton: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#374151",
    color: "white",
  },

  logoutButton: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#ef4444",
    color: "white",
  },

  card: {
    maxWidth: "600px",
    margin: "60px auto",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  title: {
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#555",
  },

  infoBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#e5e7eb",
    borderRadius: "8px",
  },
};