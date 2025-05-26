import React, { useState } from 'react';
import axios from 'axios';

const UpdateUserRoleModal = ({ user, onClose, onSuccess }) => {
  const [role, setRole] = useState(user.role);
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5001/api/v1/users/${user._id}`, { role }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '300px'
      }}>
        <h3>Update Role for {user.name}</h3>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
          <option value="Standard User">User</option>
          <option value="Organizer">Organizer</option>
          <option value="System Admin">Admin</option>
        </select>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserRoleModal;
