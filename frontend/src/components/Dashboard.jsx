import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Modal,
  TextField,
  Button,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LeadTable from "./Leadlist";
import axios from "axios";
import CreateLeadModal from "./CreateLeadModal";
import UserManagement from "./UserManagement";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [editLead, setEditLead] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage, setLeadsPerPage] = useState(10);

  // Search parameter state
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchService, setSearchService] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setToken(storedToken);
    setUser(storedUser);
    fetchLeads(storedToken);
    if (storedUser.role === "manager" || storedUser.role === "admin") {
      fetchUsers(storedToken);
    }
  }, []);

  const fetchLeads = async (token) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/leads`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setLeads(data);
  };

  const fetchUsers = async (token) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/users/getonlyuser`,
      {
        headers: { Authorization: token },
      }
    );
    setUsers(data.filter((u) => u.role === "user"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/leads/add`,
      {
        name,
        email,
        phone,
        service,
        price,
        source,
        status,
        createdBy: user._id,
        assignedTo: user.role === "manager" ? assignedTo : null,
      },
      {
        headers: { Authorization: token },
      }
    );
    toggleModal();
    fetchLeads(token);
    setName("");
    setEmail("");
    setPhone("");
    setService("");
    setPrice("");
    setSource("");
    setStatus("");
    setAssignedTo("");
  };

  const handleUpdate = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/leads/update/${editLead._id}`,
      {
        name: editLead.name,
        email: editLead.email,
        phone: editLead.phone,
        service: editLead.service,
        price: editLead.price,
        source: editLead.source,
        status: editLead.status,
        assignedTo: user.role === "manager" ? editLead.assignedTo : null,
      },
      {
        headers: { Authorization: token },
      }
    );
    toggleEditModal();
    alert("you have updated the Lead successfully")
    fetchLeads(token);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const toggleUserModal = () => {
    setIsUserModalOpen(!isUserModalOpen);
  };

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "searchName":
        setSearchName(value);
        break;
      case "searchEmail":
        setSearchEmail(value);
        break;
      case "searchPhone":
        setSearchPhone(value);
        break;
      case "searchStatus":
        setSearchStatus(value);
        break;
      case "searchService":
        setSearchService(value);
        break;
      default:
        break;
    }
  };

  const filteredLeads = leads.filter((lead) => {
    return (
      (searchName
        ? lead.name.toLowerCase().includes(searchName.toLowerCase())
        : true) &&
      (searchEmail
        ? lead.email.toLowerCase().includes(searchEmail.toLowerCase())
        : true) &&
      (searchPhone ? lead.phone.includes(searchPhone) : true) &&
      (searchStatus ? lead.status === searchStatus : true) &&
      (searchService
        ? lead.service.toLowerCase().includes(searchService.toLowerCase())
        : true)
    );
  });

  // Pagination logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleLeadsPerPageChange = (event) => {
    setLeadsPerPage(event.target.value);
    setCurrentPage(1); // Reset to the first page
  };

  const handleLeadClick = (lead) => {
    setEditLead(lead);
    setIsEditModalOpen(true);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
        toggleModal={toggleModal}
      />
      {/* Main Content Area */}
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <h1>Dashboard</h1>
        <div>
          {/* Search Fields */}
          <div style={{ marginBottom: "20px" }}>
            <TextField
              name="searchName"
              value={searchName}
              onChange={handleSearchInputChange}
              label="Search by Name"
              style={{ marginRight: "10px" }}
            />
            <TextField
              name="searchEmail"
              value={searchEmail}
              onChange={handleSearchInputChange}
              label="Search by Email"
              style={{ marginRight: "10px" }}
            />
            <TextField
              name="searchPhone"
              value={searchPhone}
              onChange={handleSearchInputChange}
              label="Search by Phone"
              style={{ marginRight: "10px" }}
            />
            <TextField
              name="searchService"
              value={searchService}
              onChange={handleSearchInputChange}
              label="Search by Service"
              style={{ marginRight: "10px" }}
            />
            <Select
              name="searchStatus"
              value={searchStatus}
              onChange={handleSearchInputChange}
              displayEmpty
              style={{ minWidth: "150px" }}
            >
              <MenuItem value="">Search by Status</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="qualified">Qualified</MenuItem>
              <MenuItem value="lost">Lost</MenuItem>
              <MenuItem value="won">Won</MenuItem>
            </Select>
          </div>

          {/* Leads List */}
          <LeadTable
            leads={currentLeads}
            onLeadClick={handleLeadClick}
            userRole={user?.role}
            userId={user?.email}
          />

          {/* Pagination Controls */}
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Pagination
              count={Math.ceil(filteredLeads.length / leadsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
            <Select value={leadsPerPage} onChange={handleLeadsPerPageChange}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </div>
        </div>
      </div>
      {/* Create Lead Modal */}
      <CreateLeadModal
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        handleSubmit={handleSubmit}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        service={service}
        setService={setService}
        price={price}
        setPrice={setPrice}
        source={source}
        setSource={setSource}
        status={status}
        setStatus={setStatus}
        user={user}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        users={users}
      />
      {/* Edit Lead Modal */}
      <Modal open={isEditModalOpen} onClose={toggleEditModal}>
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
          <h2>Edit Lead</h2>
          {editLead && (
            <form onSubmit={handleUpdate}>
              <TextField
                type="text"
                value={editLead.name}
                onChange={(e) =>
                  setEditLead({ ...editLead, name: e.target.value })
                }
                label="Lead Name"
                required
                style={{ marginBottom: "10px" }}
              />
              <TextField
                type="email"
                value={editLead.email}
                onChange={(e) =>
                  setEditLead({ ...editLead, email: e.target.value })
                }
                label="Lead Email"
                required
                style={{ marginBottom: "10px" }}
              />
              <TextField
                type="text"
                value={editLead.phone}
                onChange={(e) =>
                  setEditLead({ ...editLead, phone: e.target.value })
                }
                label="Phone"
                required
                style={{ marginBottom: "10px" }}
              />
              <TextField
                type="text"
                value={editLead.service}
                onChange={(e) =>
                  setEditLead({ ...editLead, service: e.target.value })
                }
                label="Service"
                required
                style={{ marginBottom: "10px" }}
              />
              <TextField
                type="number"
                value={editLead.price}
                onChange={(e) =>
                  setEditLead({ ...editLead, price: e.target.value })
                }
                label="Price"
                style={{ marginBottom: "10px" }}
              />
              <TextField
                type="text"
                value={editLead.source}
                onChange={(e) =>
                  setEditLead({ ...editLead, source: e.target.value })
                }
                label="Source"
                style={{ marginBottom: "10px" }}
              />
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                displayEmpty
                fullWidth
                required
                sx={{ marginBottom: "10px" }}
              >
                <MenuItem value="" disabled>
                  Select Status
                </MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="qualified">Qualified</MenuItem>
                <MenuItem value="lost">Lost</MenuItem>
                <MenuItem value="won">Won</MenuItem>
              </Select>
              {user.role === "manager" && (
                <Select
                  value={editLead.assignedTo}
                  onChange={(e) =>
                    setEditLead({ ...editLead, assignedTo: e.target.value })
                  }
                  displayEmpty
                  style={{ marginBottom: "10px" }}
                >
                  <MenuItem value="" disabled>
                    Select User
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user.email}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
              <Button type="submit" variant="contained">
                Update Lead
              </Button>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
