import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Sidebar from "./Sidebar"; // Importing the Sidebar component
import "./Profile.css";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [performanceData, setPerformanceData] = useState({
    labels: [],
    datasets: [
      {
        label: "Performance",
        data: [],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  });
  const [wonLeads, setWonLeads] = useState([]);
  const [token, setToken] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    fetchUserInfo(storedToken);
    fetchPerformanceData(storedToken);
    fetchWonLeads(storedToken);
  }, []);

  const fetchUserInfo = async (token) => {
    const profile = JSON.parse(localStorage.getItem("user"));
    setUserInfo(profile);
  };

  const fetchPerformanceData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/users/performance`,
        {
          headers: { Authorization: token },
        }
      );

      const data = response.data || [];
      const labels = data.map((entry) => entry.date) || [];
      const values = data.map((entry) => entry.value) || [];

      setPerformanceData({
        labels,
        datasets: [
          {
            label: "Performance",
            data: values,
            fill: false,
            borderColor: "rgba(75,192,192,1)",
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  const fetchWonLeads = async (token) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/leads/won`,
        {
          headers: { Authorization: token },
        }
      );
      setWonLeads(data);
    } catch (error) {
      console.error("Error fetching won leads:", error);
    }
  };

  const handleDownload = () => {
    const csv = Papa.unparse(wonLeads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `won_leads.csv`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={userInfo}
      />
      <Container
        className="profile-container"
        style={{ marginTop: "40px", flex: 1 }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{ fontWeight: "bold", marginBottom: "30px" }}
        >
          User Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box
              className="profile-left"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Avatar src={userInfo.avatar} alt="Avatar" className="avatar" />
              <div className="user-details" style={{ textAlign: "center" }}>
                <Typography variant="h6">{userInfo.name}</Typography>
                <Typography variant="body1">{userInfo.email}</Typography>
              </div>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box className="profile-right">
              <Typography variant="h6">Performance</Typography>
              <Line data={performanceData} />
            </Box>
          </Grid>
        </Grid>
        <Box className="profile-bottom" mt={4}>
          <Typography variant="h6">Won Leads</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date Won</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wonLeads
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.service}</TableCell>
                      <TableCell>{lead.status}</TableCell>
                      <TableCell>{lead.dateWon}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={wonLeads.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Button
            onClick={handleDownload}
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
          >
            Download Won Leads
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Profile;
