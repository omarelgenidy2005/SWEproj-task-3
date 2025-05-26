const UserRow = ({ user, setActiveUser, setModalType }) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <button onClick={() => {
          setActiveUser(user);
          setModalType("update");
        }}>Update Role</button>

        <button onClick={() => {
          setActiveUser(user);
          setModalType("delete");
        }}>Delete</button>
      </td>
    </tr>
  );
};

export default UserRow;
