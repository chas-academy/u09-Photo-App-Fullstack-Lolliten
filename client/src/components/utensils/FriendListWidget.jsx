import { Box, Typography, useTheme, Button, List, ListItem, ListItemText } from "@mui/material";
//import Friend from "../pages/friend/Friend";
import WidgetWrapper from "../utensils/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setFriendRequests } from "../../state/reduxConfig";


const FriendListWidget = ({ userId, isProfile, loggedInUserId, pendingRequests }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  //const friends = useSelector((state) => state.user.friends) || [];
  const friendRequests = useSelector((state) => state.user.friendRequests) || [];

  const isOwnProfile = loggedInUserId === userId;
  const isPending = Array.isArray(pendingRequests) && pendingRequests.includes(userId); //default value of an empty array

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
    dispatch(setFriends({ friends: data }));
    dispatch(setFriendRequests(friendRequests.filter(id => id !== friendId)));
    console.log(friendRequests.filter(id => id !== friendId))
  };

  /* Handle reject friend request */
  const handleReject = async (friendId) => {
    const response = await fetch(`http://localhost:3000/users/removeFriend`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendId }),
    });
    const data = await response.json();
    dispatch(setFriendRequests(data));
  };

  useEffect(() => {
    getFriends();
  }, [userId]);

  // not declared..
 // const isFriend = friends.some(friend => friend._id === userId); u

 console.log("friendrequests", friendRequests) //teswt

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
      {isProfile && isOwnProfile ? ( // Fix: Changed to a ternary operator for clarity
        friendRequests.length > 0 ? ( // Check if there are friend requests
          <List>
            {friendRequests.map((friendId) => (
              <ListItem key={friendId}>
                <ListItemText primary={`Friend request from user ${friendId}`} />
                <Button
                  onClick={() => handleAccept(friendId)}
                  disabled={isPending}
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
                  disabled={isPending}
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
          </List>
        ) : (
          <Typography>No friends to display.</Typography> // Display message if no friend requests
        )
      ) : (
        <Typography>No friends to display.</Typography> // Display message if not own profile
      )}
      
    </WidgetWrapper>
  );
};

export default FriendListWidget;
