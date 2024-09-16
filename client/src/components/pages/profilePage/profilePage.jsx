import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../scenes/Navbar";
import FriendListWidget from "../../utensils/FriendListWidget";
import MyPostWidget from "../../utensils/MyPostWidget";
import UserWidget from "../../utensils/UserWidget";
import PostWidget from "../../utensils/PostWidget";

/* use navigate(/) to in this page to navigate to different part, ex when click comments, pictures, friends  */

const ProfilePage = () => {
  const [user, setUser] = useState(null); 
    //{ _id: "",
    // username: '',
    // email: '',
    // picturePath: '',
    // // friends: [], }
  //was null first, but it was uncontrollable wheras I need a controlled in the component..
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    console.log("Test userID", userId); //debugging
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          //'Content-Type': 'application/json',
          //mode: 'cors',
          //credentials: 'include'
        }
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

  useEffect(() => {
    getUser();
  }, [userId]); // Added userId as a dependency ?

  if (!user) return null;

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
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <PostWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;