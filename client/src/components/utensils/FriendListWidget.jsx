import {
  Typography,
  useTheme,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import WidgetWrapper from "../utensils/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setFriendRequests, setSentRequests } from "../../state/reduxConfig"; //added set SentRequests

const FriendListWidget = ({ userId, loggedInUserId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friendRequests =
    useSelector((state) => state.user.friendRequests) || [];
  const friends = useSelector((state) => state.user.friends) || []; // Get friends from state
  const sentRequests = useSelector((state) => state.user.sentRequests) || []; // Get sent requests from state

  const getFriends = async () => {
    try {
      if (userId === undefined) {
        return null;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}users/${userId}/friends`,
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

  const handleAccept = async (friendId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}friends/accept-friend`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendId, userId: loggedInUserId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Fetch the updated friends list after accepting the friend request
      const updatedFriendsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}users/${loggedInUserId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!updatedFriendsResponse.ok) {
        throw new Error("Failed to fetch updated friends list");
      }
      const updatedFriendsData = await updatedFriendsResponse.json();
      dispatch(setFriends({ friends: updatedFriendsData })); // Dispatch the updated friends list

      // Update friend requests
      dispatch(
        setFriendRequests({
          friendRequests: friendRequests.filter((request) => request._id !== friendId), // Remove accepted friend request
        })
      );

      // Remove the accepted friend from sentRequests
      dispatch(
        setSentRequests({
          sentRequests: sentRequests.filter((id) => id !== friendId), // Remove from sentRequests
        })
      );
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleReject = async (friendId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}friends/reject-friend`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId, friendId }), // Send both userId and friendId
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Only dispatch once to update friend requests
      dispatch(
        setFriendRequests({
          friendRequests: friendRequests.filter((request) => request._id !== friendId),
        })
      );
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const handleRemove = async (friendId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}friends/remove-friend`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, friendId }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Remove the friend from the friends list
      dispatch(
        setFriends({
          friends: friends.filter((friend) => friend._id !== friendId),
        })
      ) 
      // dispatch(setFriends({ friends: updatedFriendsList }));
  
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  useEffect(() => {
    getFriends();

  }, []); //re-render when new userId or dispatch ???


  // Remove duplicate friend requests
  const uniqueFriendRequests = [...new Set(friendRequests)];


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
          <ListItem
            key={friend._id}
            sx={{ display: "flex", alignItems: "center" }}
          >
            {friend.picturePath && ( // Display picture if available
              <img
                src={`${
                  import.meta.env.VITE_API_URL
                }public/uploads/profilepictures/${friend.picturePath}`}
                alt={`${friend.firstName} ${friend.lastName}`}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              /> // Corrected closing tag
            )}
            <ListItemText primary={`${friend.firstName} ${friend.lastName}`} />
            <Button
              onClick={() => handleRemove(friend._id)}
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
        {uniqueFriendRequests.map(
          (friend) =>
            friend && ( // changed to map friend not friendId, and key from friendId
              <ListItem key={friend}>
                <ListItemText
                  primary={`Friend request from ${
                    (friend.firstName, friend.lastName)
                  }`}
                />
                <Button
                  onClick={() => handleAccept(friend._id)}
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
                  onClick={() => handleReject(friend._id)}
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
            )
        )}
        {friends.length === 0 && friendRequests.length === 0 && (
          <Typography>No friends to display.</Typography>
        )}
      </List>
    </WidgetWrapper>
  );
};

export default FriendListWidget;

/*
{uniqueFriendRequests
  .filter(friendId => friendId) // Filter out null or undefined friendIds
  .map((friendId) => (
    <ListItem key={friendId}>
*/
