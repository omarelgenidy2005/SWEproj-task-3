
import React, { useState } from "react";
import axios from "axios";

const UpdateProfileForm = ({ initialData, onCancel, onUpdate }) => {
  const [name, setName] = useState(initialData.name);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim() === "") {
      return setError("Name is required.");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/v1/users/profile",
        { name, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdate(response.data);
    } catch (err) {
      setError("Update failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={headingStyle}>Edit Profile</h3>
      {error && <p style={errorStyle}>{error}</p>}

      <label style={labelStyle}>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>New Password</label>
      <input
        type="password"
        placeholder="Leave blank to keep current"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />

      <div style={buttonRowStyle}>
        <button type="submit" style={saveButtonStyle}>Update</button>
        <button type="button" onClick={onCancel} style={cancelButtonStyle}>Cancel</button>
      </div>
    </form>
  );
};

// 🎨 Styling (matches modern dark theme)
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  color: "#e2e8f0",
};

const headingStyle = {
  fontSize: "20px",
  marginBottom: "10px",
  textAlign: "center",
  color: "#ffffff",
};

const labelStyle = {
  fontWeight: "bold",
};

const inputStyle = {
  backgroundColor: "#334155",
  color: "#ffffff",
  border: "1px solid #475569",
  borderRadius: "6px",
  padding: "8px",
  fontSize: "14px",
};

const errorStyle = {
  color: "#f87171",
  fontWeight: "bold",
};

const buttonRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "16px",
};

const saveButtonStyle = {
  backgroundColor: "#38bdf8",
  color: "#000000",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

const cancelButtonStyle = {
  backgroundColor: "#475569",
  color: "#ffffff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default UpdateProfileForm;
