import { Box, Typography, useTheme, Button, List, ListItem, ListItemText } from "@mui/material";
import WidgetWrapper from "../utensils/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setFriendRequests } from "../../state/reduxConfig";

const FriendListWidget = ({ userId, isProfile, loggedInUserId, pendingRequests }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friendRequests = useSelector((state) => state.user.friendRequests) || [];
  const friends = useSelector((state) => state.user.friends) || []; // Get friends from state

  const isOwnProfile = loggedInUserId === userId;
 

/* Get friend list */ 
  const getFriends = async () => {
    try {
      if (userId === undefined) {
        return null;
      }
      const response = await fetch(
        `http://localhost:3000/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch friends");
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  /* Handle accept friend request */
  const handleAccept = async (friendId) => {
    const response = await fetch(`http://localhost:3000/users/addFriend`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendId, userId: loggedInUserId }),
    });
    const data = await response.json();
    dispatch(setFriends({ friends: [...friends, { _id: friendId }] })); // Add accepted friend
    dispatch(setFriendRequests({ friendRequests: friendRequests.filter(id => id !== friendId) })); // Remove from requests
  };

  /* Handle reject friend request */
  const handleReject = async (friendId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/removeFriend`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, friendId }), // Send both userId and friendId
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Only dispatch once to update friend requests
      dispatch(setFriendRequests({ friendRequests: friendRequests.filter(id => id !== friendId) }));
      //dispatch(setFriendRequests(friendRequests.filter(id => id !== friendId))); // Remove rejected request
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  useEffect(() => {
    getFriends();
  }, [userId]);

  // Remove duplicate friend requests
  const uniqueFriendRequests = [...new Set(friendRequests)];

  /* 
  // Capitalize the first letter of the name
  const capitalizeFirstLetter = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  */

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <List>
        {/* Display friends */}
        {friends.map((friend) => (
          <ListItem key={friend._id}>
            <ListItemText primary={`Friend: ${friend._id}`} />
            <Button
              onClick={() => handleReject(friend._id)} // Remove friend
              sx={{
                m: "0.5rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              Remove
            </Button>
          </ListItem>
        ))}
        {/* Display pending friend requests */}
        {uniqueFriendRequests.map((friendId) => (
          <ListItem key={friendId}>
            <ListItemText primary={`Friend request from user ${friendId}`} />
            <Button
              onClick={() => handleAccept(friendId)}
            
              sx={{
                m: "0.5rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
                "&:disabled": {
                  backgroundColor: palette.neutral.light,
                  color: palette.neutral.main,
                },
              }}
            >
              Accept
            </Button>
            <Button
              onClick={() => handleReject(friendId)}
             
              sx={{
                m: "0.5rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
                "&:disabled": {
                  backgroundColor: palette.neutral.light,
                  color: palette.neutral.main,
                },
              }}
            >
              Reject
            </Button>
          </ListItem>
        ))}
        {friends.length === 0 && friendRequests.length === 0 && (
          <Typography>No friends to display.</Typography> // Display message if no friends or requests
        )}
      </List>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
