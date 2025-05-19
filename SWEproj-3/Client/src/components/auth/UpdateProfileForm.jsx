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
      onUpdate(response.data); // Update in parent
    } catch (err) {
      setError("Update failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Profile</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>New Password:</label>
        <input
          type="password"
          placeholder="Leave blank to keep current"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Update</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
        Cancel
      </button>
    </form>
  );
};

export default UpdateProfileForm;
