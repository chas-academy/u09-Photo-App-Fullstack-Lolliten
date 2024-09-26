import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set()); // Track sent requests
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      const response = await fetch(
        `http://localhost:3000/users/search?query=${encodeURIComponent(searchQuery)}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSearchResults(data);
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery, token]);

  const sendFriendRequest = async (friendId) => {
    const response = await fetch(
      `http://localhost:3000/users/${friendId}/friend-request`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const data = await response.json();
    // Update UI to show pending request
    setSentRequests((prev) => new Set(prev).add(friendId)); // Add to sent requests
  };

  return (
    <Box p={3}>
      <Navbar />
      <Typography variant="h4" sx={{ mb: 2 }}>
        Search Results for "{searchQuery}"
      </Typography>
      {searchResults.length > 0 ? (
        <List>
          {searchResults.map((user) => (
            <ListItem key={user._id}>
              <ListItemAvatar>
                <Avatar src={`http://localhost:3000/assets/${user.picturePath}`} />
              </ListItemAvatar>
              <ListItemText 
                primary={`${user.firstName} ${user.lastName}`}
              />
              {user._id !== loggedInUserId && (
                <Button
                  onClick={() => sendFriendRequest(user._id)}
                  variant="contained"
                  color="primary"
                  disabled={sentRequests.has(user._id)} // Disable if request sent
                >
                  {sentRequests.has(user._id) ? "Request Sent" : "Add Friend"}
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No results found.</Typography>
      )}
    </Box>
  );
};

export default SearchResults;