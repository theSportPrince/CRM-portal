import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import AssessmentIcon from '@mui/icons-material/Assessment'; 
import logo from "../assets/1.png"

const Sidebar = ({ isSidebarOpen, toggleSidebar, user, toggleModal }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    alert('You have logged out successfully');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
      open={isSidebarOpen}
    >
      <Toolbar>
        <IconButton onClick={toggleSidebar}>
          {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <List>
        <ListItem>
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "100px" }}
          />
        </ListItem>
        <ListItem button onClick={toggleModal}>
          <ListItemIcon style={{ minWidth: '35px' }}>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Create Lead" />
        </ListItem>
    
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon style={{ minWidth: '35px' }}>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="Bucket Search" />
        </ListItem>

        {/* {user.role === 'manager' || user.role === 'admin' ? (
          <ListItem button component={Link} to="/users">
            <ListItemIcon style={{ minWidth: '35px' }}>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
        ) : null} */}
         {user.role === 'manager' || user.role === 'admin' ? (
          <>
            <ListItem button component={Link} to="/users">
              <ListItemIcon style={{ minWidth: '35px' }}>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem button component={Link} to="/reports">
              <ListItemIcon style={{ minWidth: '35px' }}>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
          </>
        ) : null}

        

        <ListItem button component={Link} to="/profile">
          <ListItemIcon style={{ minWidth: '35px' }}>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>

        {user ? (
          <ListItem button onClick={handleLogout}>
            <ListItemIcon style={{ minWidth: '35px' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        ) : (
          <ListItem button component={Link} to="/login">
            <ListItemIcon style={{ minWidth: '35px' }}>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
