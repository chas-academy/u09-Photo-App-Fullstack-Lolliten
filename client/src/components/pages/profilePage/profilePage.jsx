import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../scenes/Navbar";
import FriendListWidget from "../../utensils/FriendListWidget";
import MyPostWidget from "../../utensils/MyPostWidget";
import UserWidget from "../../utensils/UserWidget";
import PostWidget from "../../utensils/PostWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // State for user's posts
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const isOwnProfile = userId === loggedInUser._id;

  const getUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}user/${userId}`,
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
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchUserPosts = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}posts/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setPosts(data); // Set the user's posts
  };

  useEffect(() => {
    getUser();
    fetchUserPosts();
  }, []);

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
          />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {isOwnProfile && <MyPostWidget picturePath={user.picturePath} />}
          <Box m="2rem 0" />
          <PostWidget posts={posts} /> {/* Pass user's posts to PostWidget */}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;

/*
Line 103 :  <PostWidget userId={userId} isProfile />
*/
