import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setFriends, setFriendRequests } from "../../state/reduxConfig";
import Navbar from "./Navbar";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const friends = useSelector((state) => state.user.friends);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("query");
  const dispatch = useDispatch();
  

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

  const addRemoveFriend = async (friendId) => {
    const response = await fetch(
      `http://localhost:3000/users/${loggedInUserId}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

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
    setSearchResults(prevResults =>
      prevResults.map(user =>
        user._id === friendId ? { ...user, requestSent: true } : user
      )
    );
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
                  disabled={user.requestSent}
                >
                  {user.requestSent ? "Request Sent" : "Add Friend"}
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