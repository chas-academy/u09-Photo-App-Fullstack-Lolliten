import { Box, useMediaQuery, useTheme, Container } from "@mui/material";
import Navbar from "../../scenes/Navbar";
import MyPostWidget from "../../utensils/MyPostWidget";
import PostWidget from "../../utensils/PostWidget";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const WelcomePage = () => {
  const { _id, token } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const theme = useTheme();
  const isNonMobile = useMediaQuery(theme.breakpoints.up("sm"));

  const fetchPosts = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}posts/friends/${_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Container
        maxWidth="md"
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 3 },
            maxWidth: isNonMobile ? "600px" : "100%",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
              boxShadow: 1,
              p: { xs: 2, sm: 3 },
            }}
          >
            <MyPostWidget />
          </Box>

          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
              boxShadow: 1,
              p: { xs: 2, sm: 3 },
              "& > *": {
                // This targets the PostWidget component
                mb: { xs: 2, sm: 3 },
                "&:last-child": {
                  mb: 0,
                },
              },
            }}
          >
            <PostWidget />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomePage;
