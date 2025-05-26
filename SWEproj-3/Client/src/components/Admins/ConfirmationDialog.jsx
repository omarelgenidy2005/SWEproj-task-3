import React from 'react';
import axios from 'axios';

const ConfirmationDialog = ({ userId, onClose, onSuccess }) => {
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="modal">
      <p>Are you sure you want to delete this user?</p>
      <button onClick={handleDelete}>Yes, delete</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default ConfirmationDialog;
