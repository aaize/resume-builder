import { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {profile && (
        <>
          <h2>Welcome User #{profile.user_id}</h2>
          <p>{profile.message}</p>
        </>
      )}
    </div>
  );
}

export default Dashboard;