import React from "react";
import {
  Modal,
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import axios from "axios";

const CreateLeadModal = ({
  isOpen,
  toggleModal,
  handleSubmit,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  service,
  setService,
  price,
  setPrice,
  source,
  setSource,
  status,
  setStatus,
  user,
  assignedTo,
  setAssignedTo,
  users,
}) => {
  const handleDownloadTemplate = () => {
    const csvData = [
      [
        "name",
        "email",
        "phone",
        "service",
        "price",
        "status",
        "source",
        "assignedTo",
      ],
    ];
    const blob = new Blob([Papa.unparse(csvData)], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "lead_template.csv");
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          // Filter out incomplete leads
          const leads = results.data
            .filter(
              (lead) => lead.name && lead.email && lead.phone && lead.service
            )
            .map((lead) => ({
              ...lead,
              assignedTo: lead.assignedTo || null, // Handle empty assignedTo field
            }));

          const token = localStorage.getItem("token");
          const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/api/leads/bulk`,
            {
              leads,
              createdBy: user._id,
            },
            {
              headers: { Authorization: token },
            }
          );
          if (response.status === 201) {
            alert("Leads uploaded successfully!");
            toggleModal();
            window.location.reload();
          } else {
            alert("Error uploading leads.");
          }
        },
      });
    }
  };

  return (
    <Modal open={isOpen} onClose={toggleModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: 24,
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{ marginBottom: "20px", color: "#1976d2" }}
        >
          Create Lead
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Lead Name"
            required
            fullWidth
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Lead Email"
            required
            fullWidth
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            label="Phone"
            required
            fullWidth
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            label="Service"
            required
            fullWidth
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            label="Price"
            fullWidth
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            label="Source"
            fullWidth
            sx={{ marginBottom: "10px" }}
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
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ marginBottom: "10px" }}
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginBottom: "10px" }}
          >
            Add Lead
          </Button>
        </form>
        {(user.role === "manager" || user.role === "admin") && (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadTemplate}
              fullWidth
              sx={{ marginBottom: "10px" }}
            >
              Download CSV Template
            </Button>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                marginBottom: "10px",
                backgroundColor: "#4caf50",
                color: "#fff",
              }}
            >
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                hidden
              />
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CreateLeadModal;
