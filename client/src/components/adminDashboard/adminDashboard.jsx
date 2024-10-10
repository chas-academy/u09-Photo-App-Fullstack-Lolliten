import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from the backend
  const fetchUsers = async () => {
    const response = await fetch("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
      },
    });
    const data = await response.json();
    setUsers(data);
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      fetchUsers(); // Refresh the user list after deletion
    } else {
      console.error("Failed to delete user");
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

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
    </Box>
  );
};

export default AdminDashboard;
