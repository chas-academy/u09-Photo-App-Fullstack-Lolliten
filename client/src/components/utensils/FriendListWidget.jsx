import { Box, Typography, useTheme, Button } from "@mui/material";
import Friend from "../pages/friend/Friend";
import WidgetWrapper from "../utensils/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/reduxConfig";

const FriendListWidget = ({ userId, isProfile, loggedInUserId, pendingRequests }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends) || [];

  const isOwnProfile = loggedInUserId === userId;
  const isPending = pendingRequests.includes(userId);

/* Get friend list */ 
  const getFriends = async () => {
    try {
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

  /* Adds and remove friends */
  const addRemoveFriend = async () => {
    if (isPending) return; // Prevent action if request is pending
    try {
      const response = await fetch(
        `http://localhost:3000/users/${loggedInUserId}/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to update friend status");
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Error updating friend status:", error);
    }
  };

  useEffect(() => {
    getFriends();
  }, [userId]); // userId, token, getFriends

  const isFriend = friends.some(friend => friend._id === userId);

////{friends.some(friend => friend._id === loggedInUserId) ? "Remove Friend" : "Add Friend"}

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
      {isProfile && !isOwnProfile && (
        <Button
          onClick={addRemoveFriend}
          disabled={isPending}
          sx={{
            m: "0.5rem 0",
            p: "1rem",
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            "&:hover": { color: palette.primary.main },
            "&:disabled": { backgroundColor: palette.neutral.light, color: palette.neutral.main },
          }}
        >
           //{friends.some(friend => friend._id === loggedInUserId) ? "Remove Friend" : "Add Friend"}
          {isFriend ? "Remove Friend" : isPending ? "Request Pending" : "Add Friend"}
        </Button>
      )}
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              userPicturePath={friend.picturePath}
            />
          ))
        ) : (
          <Typography>No friends to display.</Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
