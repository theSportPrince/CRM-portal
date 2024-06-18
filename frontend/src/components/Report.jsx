import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import {
  Button,
  Select,
  MenuItem,
  Container,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
} from "@mui/material";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Sidebar from "./Sidebar"; // Importing the Sidebar component
import "./Report.css"; // Importing the CSS file

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Reports = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setToken(storedToken);
    setUser(storedUser);
    fetchLeads(storedToken);
    fetchUsers(storedToken);
  }, []);

  const fetchLeads = async (token) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/leads`,
      {
        headers: { Authorization: token },
      }
    );
    setLeads(data);
    setFilteredLeads(data);
  };

  const fetchUsers = async (token) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/users/getalluser`,
      {
        headers: { Authorization: token },
      }
    );
    setUsers(data);
  };

  const handleUserChange = (event) => {
    const selectedUserId = event.target.value;
    setSelectedUser(selectedUserId);
    filterLeads(
      selectedUserId,
      selectedStatus,
      selectedStartDate,
      selectedEndDate
    );
  };

  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setSelectedStatus(selectedStatus);
    filterLeads(
      selectedUser,
      selectedStatus,
      selectedStartDate,
      selectedEndDate
    );
  };

  const handleStartDateChange = (event) => {
    const selectedStartDate = event.target.value;
    setSelectedStartDate(selectedStartDate);
    filterLeads(
      selectedUser,
      selectedStatus,
      selectedStartDate,
      selectedEndDate
    );
  };

  const handleEndDateChange = (event) => {
    const selectedEndDate = event.target.value;
    setSelectedEndDate(selectedEndDate);
    filterLeads(
      selectedUser,
      selectedStatus,
      selectedStartDate,
      selectedEndDate
    );
  };

  const filterLeads = (userId, status, startDate, endDate) => {
    let filtered = leads;
    if (userId) {
      filtered = filtered.filter((lead) => lead.assignedTo === userId);
    }
    if (status) {
      filtered = filtered.filter((lead) => lead.status === status);
    }
    if (startDate) {
      filtered = filtered.filter(
        (lead) => new Date(lead.createdAt) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (lead) => new Date(lead.createdAt) <= new Date(endDate)
      );
    }
    setFilteredLeads(filtered);
  };

  const handleDownload = (status) => {
    const filteredData = leads.filter((lead) => lead.status === status);
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${status}_leads_report.csv`);
  };

  const handleFilteredDownload = () => {
    const csv = Papa.unparse(filteredLeads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `filtered_leads_report.csv`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const pieData = {
    labels: ["New", "Contacted", "Qualified", "Lost", "Won"],
    datasets: [
      {
        data: [
          leads.filter((lead) => lead.status === "new").length,
          leads.filter((lead) => lead.status === "contacted").length,
          leads.filter((lead) => lead.status === "qualified").length,
          leads.filter((lead) => lead.status === "lost").length,
          leads.filter((lead) => lead.status === "won").length,
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF6347",
          "#4BC0C0",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: "easeInOutBounce",
    },
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
      <Container
        className="reports-container"
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{ fontWeight: "bold", marginBottom: "30px" }}
        >
          Reports
        </Typography>
        <Grid
          container
          spacing={2}
          alignItems="center"
          style={{ width: "100%", marginBottom: "20px" }}
        >
          <Grid
            item
            xs={12}
            md={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Select
              value={selectedUser}
              onChange={handleUserChange}
              displayEmpty
              style={{ marginRight: "20px", width: "200px" }}
            >
              <MenuItem value="">Select User</MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              displayEmpty
              style={{ marginRight: "20px", width: "200px" }}
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="qualified">Qualified</MenuItem>
              <MenuItem value="lost">Lost</MenuItem>
              <MenuItem value="won">Won</MenuItem>
            </Select>
            <TextField
              type="date"
              value={selectedStartDate}
              onChange={handleStartDateChange}
              InputLabelProps={{ shrink: true }}
              label="Start Date"
              style={{ marginRight: "20px" }}
            />
            <TextField
              type="date"
              value={selectedEndDate}
              onChange={handleEndDateChange}
              InputLabelProps={{ shrink: true }}
              label="End Date"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              onClick={() => handleDownload("won")}
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
            >
              Download Won Leads
            </Button>
            <Button
              onClick={() => handleDownload("lost")}
              variant="contained"
              color="secondary"
              style={{ marginRight: "10px" }}
            >
              Download Lost Leads
            </Button>
            <Button
              onClick={handleFilteredDownload}
              variant="contained"
              style={{ backgroundColor: "#888", color: "#fff" }}
            >
              Download Filtered Leads
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ width: "100%" }}>
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLeads
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((lead) => (
                      <TableRow key={lead._id}>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{lead.service}</TableCell>
                        <TableCell>{lead.status}</TableCell>
                        <TableCell>
                          {
                            users.find((user) => user._id === lead.assignedTo)
                              ?.name
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredLeads.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Box style={{ width: "100%", maxWidth: "400px", height: "400px" }}>
              <Pie data={pieData} options={pieOptions} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Reports;
