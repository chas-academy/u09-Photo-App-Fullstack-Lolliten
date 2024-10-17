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
        `${import.meta.env.VITE_API_URL}search?q=${encodeURIComponent(searchQuery)}`,
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
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}friends/friend-request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId, friendId }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        // Update UI to show pending request with name
        setSentRequests((prev) => new Set(prev).add(friendId));
      } else {
        console.error(data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
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
                <Avatar src= {`${import.meta.env.VITE_API_URL}uploads/${user.picturePath}`} />
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
