import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UpdateProfileForm from "./UpdateProfileForm";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!userData)
    return (
      <p style={{ color: "#eee", textAlign: "center" }}>Loading profile...</p>
    );

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>My Profile</h2>

        {!editing ? (
          <div style={infoStyle}>
            <div style={rowStyle}>
              <strong>Name:</strong> <span>{userData.name}</span>
            </div>
            <div style={rowStyle}>
              <strong>Email:</strong> <span>{userData.email}</span>
            </div>
            <div style={rowStyle}>
              <strong>Role:</strong> <span>{userData.role}</span>
            </div>

            {/* Show My Events button only for organizers */}
            {userData.role === "Organizer" && (
              <button
                onClick={() => navigate("/my-events")}
                style={buttonStyle}
              >
                My Events
              </button>
            )}

            {/* Show Admin Events button only for system admins */}
            {userData.role === "System Admin" && (
              <button
                onClick={() => navigate("/admin/events")}
                style={buttonStyle}
              >
                View All Events
              </button>
            )}

            <button onClick={() => setEditing(true)} style={buttonStyle}>
              Edit Profile
            </button>
          </div>
        ) : (
          <UpdateProfileForm
            initialData={userData}
            onCancel={() => setEditing(false)}
            onUpdate={(updatedUser) => {
              setUserData(updatedUser);
              setEditing(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

// ✅ Styling for modern dark UI
const containerStyle = {
  backgroundColor: "#0f172a",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const cardStyle = {
  backgroundColor: "#1e293b",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
  color: "#e2e8f0",
  width: "100%",
  maxWidth: "400px",
};

const headingStyle = {
  textAlign: "center",
  fontSize: "24px",
  marginBottom: "25px",
  color: "#ffffff",
};

const infoStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #334155",
  paddingBottom: "5px",
};

const buttonStyle = {
  marginTop: "15px",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#38bdf8",
  color: "#000",
  fontWeight: "bold",
  cursor: "pointer",
};

export default ProfilePage;
