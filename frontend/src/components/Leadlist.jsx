import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button } from '@mui/material';

const LeadTable = ({ leads, onLeadClick,userRole, userId }) => {

  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads?.map((lead) => (
            <TableRow key={lead._id} onClick={() => onLeadClick(lead)} style={{ cursor: 'pointer' }}>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>{lead.service}</TableCell>
              <TableCell>{lead.price}</TableCell>
              <TableCell>{lead.source}</TableCell>
              <TableCell>{lead.status}</TableCell>
              <TableCell>{lead.assignedTo ? lead.assignedTo : 'N/A'}</TableCell>
              <TableCell>
                 <Button onClick={() => onLeadClick(lead)} variant="contained" color="primary">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeadTable;
