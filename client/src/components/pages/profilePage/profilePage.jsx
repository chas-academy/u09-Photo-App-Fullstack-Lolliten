import { Box, useMediaQuery, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../scenes/Navbar";
import FriendListWidget from "../../utensils/FriendListWidget";
import MyPostWidget from "../../utensils/MyPostWidget";
import UserWidget from "../../utensils/UserWidget";
import PostWidget from "../../utensils/PostWidget";
//import FriendRequests from "../../scenes/FriendRequest";


const ProfilePage = () => {
  const [user, setUser] = useState(null); //if uncontrolled change value from null
  const [pendingRequests, setPendingRequests] = useState([]);
  const { userId } = useParams();
  console.log("userId from params:", userId); //test
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user); //Error in browser undefined
console.log("loggedInUser", loggedInUser._id)

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const isOwnProfile = userId === loggedInUser._id;

  /* Gets User */
  const getUser = async () => {
    console.log("Test userID", userId); //test
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  /* Gets pending friend reequests */
  const getPendingRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/${loggedInUser._id}/pendingRequests`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  /*  This instead ???
useEffect(() => {
    getUser();
    if (loggedInUserId && token) {
        getPendingRequests();
    }
}, [loggedInUserId, token]); */

  useEffect(() => {
    //useEffect after or before functions ???
    getUser();
    getPendingRequests();
  }, []); // loggedInUserId and token a s a dependency too ???

  if (!user || userId === undefined) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget
            userId={userId}
            isProfile={true}
            loggedInUserId={loggedInUser._id}
            pendingRequests={pendingRequests}
          />
          {isOwnProfile && (
            <Box mt="2rem">
              <FriendListWidget />
            </Box>
          )}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {isOwnProfile && <MyPostWidget picturePath={user.picturePath} />}
          <Box m="2rem 0" />
          <PostWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
