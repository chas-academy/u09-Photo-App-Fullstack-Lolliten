import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, List, ListItem, ListItemText } from '@mui/material';
import { setFriends, setFriendRequests } from '../../state/reduxConfig';

const FriendRequests = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const userId = useSelector((state) => state.user._id);

  const handleAccept = async (friendId) => {
    const response = await fetch(
      `http://localhost:3000/users/${userId}/accept-friend`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
    dispatch(setFriendRequests(friendRequests.filter(id => id !== friendId)));
  };

  const handleReject = async (friendId) => {
    const response = await fetch(
      `http://localhost:3000/users/${userId}/reject-friend`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      }
    );
    const data = await response.json();
    dispatch(setFriendRequests(data));
  };

  return (
    <List>
      {friendRequests.map((friendId) => (
        <ListItem key={friendId}>
          <ListItemText primary={`Friend request from user ${friendId}`} />
          <Button onClick={() => handleAccept(friendId)}>Accept</Button>
          <Button onClick={() => handleReject(friendId)}>Reject</Button>
        </ListItem>
      ))}
    </List>
  );
};

export default FriendRequests;