import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateProfileForm from "./UpdateProfileForm";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (err) {
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p>{error}</p>;
  if (!userData) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      {!editing ? (
        <>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
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
