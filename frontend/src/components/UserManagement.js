import React, { useState, useEffect } from "react";
import { Modal, TextField, Button, Select, MenuItem } from "@mui/material";
import axios from "axios";
import UserTable from "./UserTable";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setToken(storedToken);
    setUser(storedUser);
    if (storedUser.role === "manager" || storedUser.role === "admin") {
      fetchUsers(storedToken);
    }
  }, []);

  const fetchUsers = async (token) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/users/getalluser`,
        {
          headers: { Authorization: token },
        }
      );
      setUsers(data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        navigate("/login"); // Redirect to login if access is forbidden
      }
    }
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    const isRoleChangedToUser =
      user._id === editUser._id && editUser.role === "user";

    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/users/update/${editUser._id}`,
        {
          name: editUser.name,
          email: editUser.email,
          role: editUser.role,
        },
        {
          headers: { Authorization: token },
        }
      );

      toggleUserModal();

      if (isRoleChangedToUser) {
        // Log out and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        fetchUsers(token);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        navigate("/login"); // Redirect to login if access is forbidden
      }
    }
  };

  const toggleUserModal = () => {
    setIsUserModalOpen(!isUserModalOpen);
  };

  const handleUserClick = (user) => {
    setEditUser(user);
    setIsUserModalOpen(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
      />
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <h1>User Management</h1>
        <UserTable users={users} onUserClick={handleUserClick} />
        <Modal open={isUserModalOpen} onClose={toggleUserModal}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h2>Edit User</h2>
            {editUser && (
              <form onSubmit={handleUserUpdate}>
                <TextField
                  type="text"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  label="Name"
                  required
                  style={{ marginBottom: "10px" }}
                />
                <TextField
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  label="Email"
                  required
                  style={{ marginBottom: "10px" }}
                />
                <Select
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  displayEmpty
                  style={{ marginBottom: "10px", width: "100%" }}
                >
                  <MenuItem value="" disabled>
                    Role
                  </MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
                <Button type="submit" variant="contained">
                  Update User
                </Button>
              </form>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
