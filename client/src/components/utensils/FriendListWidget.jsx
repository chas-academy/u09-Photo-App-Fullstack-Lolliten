import { Box, Typography, useTheme, Button } from "@mui/material";
import Friend from "../pages/friend/Friend";
import WidgetWrapper from "../utensils/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/reduxConfig";

const FriendListWidget = ({ userId, isProfile, loggedInUserId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends) || [];

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3000/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };
  const isOwnProfile = loggedInUserId === userId;

  //adds and remove
  const addRemoveFriend = async () => {
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
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, [userId]); // Added userId as a dependency //userId, token, getFriends

  const isFriend = Array.isArray(friends) && friends.some((friend) => friend._id === loggedInUserId); // is this right with the some. ?

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
          sx={{
            m: "0.5rem 0",
            p: "1rem",
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            "&:hover": { color: palette.primary.main },
          }}
        >
          {friends.some((friend) => friend._id === loggedInUserId)
            ? "Remove Friend"
            : "Add Friend"}
        </Button>
      )}
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {Array.isArray(friends) && friends.length > 0 ? (
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