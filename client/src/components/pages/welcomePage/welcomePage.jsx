import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../../scenes/Navbar";
import MyPostWidget from "../../utensils/MyPostWidget";
import PostWidget from "../../utensils/PostWidget"; // Import PostWidget
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

/* Style return here or in widgets? ? ? */

const WelcomePage = () => {
    const { _id, token } = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/friends/${_id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        setPosts(data);
    };

    useEffect(() => {
        fetchPosts(); // Fetch posts from friends when the component mounts
    }, []);

    return (
        <Box>
            <Navbar />
            <Box>
                <MyPostWidget />
                <PostWidget posts={posts} /> {/* Pass fetched posts to PostWidget */}
            </Box>
        </Box>
    );
};

export default WelcomePage;

/*  <Box
          width="100%"
          padding="2rem 6%"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="0.5rem"
          justifyContent="space-between"
        >
          <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
            <UserWidget userId={_id} picturePath={picturePath} />
          </Box>
          <Box
            flexBasis={isNonMobileScreens ? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            <MyPostWidget picturePath={picturePath} />
            <PostsWidget userId={_id} />
          </Box>
          {isNonMobileScreens && (
            <Box flexBasis="26%">
              <Box m="2rem 0" />
              <FriendListWidget userId={_id} />
            </Box>
          )}
        </Box> */

        /*  <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 64px)', // Adjust this value based on your Navbar height
          padding: '2rem',
        }}
      >
        <Typography variant="h5" component="p" align="center">
          Welcome, this is where you will see your friends' photos!
        </Typography>
        
      </Box>
      */
