import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const token = useSelector((state) => state.token);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
  
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setSnackbarMessage("Error fetching users: " + error.message); // Provide feedback
      setOpenSnackbar(true);
    }
  };

  // Delete a user as admin 
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/admin/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.ok) {
        setSnackbarMessage("User deleted successfully");
        setOpenSnackbar(true);
        fetchUsers(); // Refresh the user list after deletion
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      setSnackbarMessage("Failed to delete user: " + error.message); // Provide feedback
      setOpenSnackbar(true);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Snackbar close handler
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for feedback */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
