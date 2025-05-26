import React, { useEffect, useState } from "react";
import axios from "axios";
import UserRow from "./UserRow";
import UpdateUserRoleModal from "./UpdateUserRoleModal";
import ConfirmationDialog from "./ConfirmationDialog";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [modalType, setModalType] = useState(null); // "update" or "delete"

  const fetchUsers = () => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5001/api/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* ✅ ONLY render <tr>s inside <tbody> */}
          {users.map(user => (
            <UserRow
              key={user._id}
              user={user}
              setActiveUser={setActiveUser}
              setModalType={setModalType}
            />
          ))}
        </tbody>
      </table>

      {/* ✅ ✅ ✅ Modals are placed **outside** the table */}
      {modalType === "update" && activeUser && (
        <UpdateUserRoleModal
          user={activeUser}
          onClose={() => setModalType(null)}
          onSuccess={fetchUsers}
        />
      )}

      {modalType === "delete" && activeUser && (
        <ConfirmationDialog
          userId={activeUser._id}
          onClose={() => setModalType(null)}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;
