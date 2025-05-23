import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ Add this
import UpdateProfileForm from "./UpdateProfileForm";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Add this

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

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!userData) return <p style={{ color: "white" }}>Loading profile...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      {!editing ? (
        <>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>

          {userData.role === "Organizer" && (
            <button onClick={() => navigate("/my-events")}>My Events</button>
          )}

          {userData.role === "System Admin" && (
            <button onClick={() => navigate("/admin/events")}>View All Events</button>
          )}
        </>
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
  );
};

export default ProfilePage;
