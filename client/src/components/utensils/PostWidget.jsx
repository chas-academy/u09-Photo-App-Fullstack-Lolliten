import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
  import FlexBetween from "../utensils/FlexBetween";
  import WidgetWrapper from "../utensils/WidgetWrapper";
  import { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts } from "../../state/reduxConfig"; //later import setPost too
  
  const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    picturePath,
    userPicturePath,
    likes = {},
    comments = [],
  }) => {
    const [isComments, setIsComments] = useState(false);
    const [posts, setPostsState] = useState([]);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user?._id);
    const isLiked = Boolean(likes && loggedInUserId && likes[loggedInUserId]);
    const likeCount = likes ? Object.keys(likes).length : 0;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ userId: loggedInUserId }),
        });
        const data = await response.json();
        setPostsState(data); // Set the local posts state with the fetched data
        dispatch(setPosts({ posts: data })); // Dispatch to redux store
      } catch (err) {
        console.error("Error fetching posts", err);
      }
    };

    useEffect(() => {
      fetchPosts(); // Fetch posts when the component mounts
    }, []);
  
    // /* Likes on posts */
    // const patchLike = async () => {
    //   if (!postId || !loggedInUserId) return; // Guard clause
    //   const response = await fetch(`http://localhost:3000/posts/${postId}/like`, {
    //     method: "PATCH",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ userId: loggedInUserId }),
    //   });
    //   const updatedPost = await response.json();
    //   dispatch(setPost({ post: updatedPost }));
    // };
  
    return (
      <Box>
      {posts.map((post) => (
        <WidgetWrapper key={post._id} m="2rem 0">
          {post.userId && post.firstName && post.userPicturePath && (
            <Friend
              friendId={post.userId}
              name={`${post.firstName} ${post.lastName}`} // Combine first and last name
              userPicturePath={post.userPicturePath}
            />
          )}
          {post.description && (
            <Typography color="neutral.main" sx={{ mt: "1rem" }}>
              {post.description}
            </Typography>
          )}
          {post.picturePath && (
            <img
              width="100%"
              height="auto"
              alt="post"
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
              src={`http://localhost:3000/assets/${post.picturePath}`}
            />
          )}
          <FlexBetween mt="0.25rem">
            <FlexBetween gap="1rem">
              <FlexBetween gap="0.3rem">
                <IconButton>
                  {Boolean(post.likes && loggedInUserId && post.likes[loggedInUserId]) ? (
                    <FavoriteOutlined sx={{ color: "primary.main" }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography>{Object.keys(post.likes || {}).length}</Typography>
              </FlexBetween>
    
              <FlexBetween gap="0.3rem">
                <IconButton>
                  <ChatBubbleOutlineOutlined />
                </IconButton>
                <Typography>{post.comments.length}</Typography>
              </FlexBetween>
            </FlexBetween>
    
            <IconButton>
              <ShareOutlined />
            </IconButton>
          </FlexBetween>
          {post.comments.length > 0 && (
            <Box mt="0.5rem">
              {post.comments.map((comment, i) => (
                <Box key={`${post._id}-${i}`}>
                  <Divider />
                  <Typography sx={{ color: "neutral.main", m: "0.5rem 0", pl: "1rem" }}>
                    {comment}
                  </Typography>
                </Box>
              ))}
              <Divider />
            </Box>
          )}
        </WidgetWrapper>
      ))}
    </Box>
    );
    };
    
    export default PostWidget;