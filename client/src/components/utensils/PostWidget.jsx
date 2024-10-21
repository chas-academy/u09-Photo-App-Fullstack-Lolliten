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
  import { format } from 'date-fns';
  
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}posts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("Log response", data); // Log the response to inspect the structure
        
        // Sort posts by creation date (latest first)
        const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setPostsState(sortedPosts); // Set the local posts state with the sorted data
        dispatch(setPosts({ posts: sortedPosts })); // Dispatch to redux store
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
    //   const response = await fetch(`${import.meta.env.VITE_API_URL}posts/${postId}/like`, {
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
                    {post.userId && (
                        <FlexBetween>
                            <Typography color="neutral.main" sx={{ mt: "1rem", fontWeight: "bold" }}>
                                {`${post.userId.firstName} ${post.userId.lastName}`} {/* Display user's name */}
                            </Typography>
                            <img
                                src={`http://localhost:3000/uploads/profilepictures/${post.userId.userPicturePath}`} // Display user's profile picture
                                alt="User"
                                style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }}
                            />
                        </FlexBetween>
                    )}
                    {/* Display the user's name */}
                    {post.firstName && post.lastName && (
                        <Typography color="neutral.main" sx={{ mt: "1rem", fontWeight: "bold" }}>
                            {`${post.firstName} ${post.lastName}`} {/* Display user's name */}
                        </Typography>
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
                            src={`http://localhost:3000/uploads/posts/${post.picturePath}`}
                        />
                    )}
                    {/* Display the date and time the post was created */}
                    {post.createdAt && (
                        <Typography color="neutral.main" sx={{ mt: "1rem" }}>
                            {format(new Date(post.createdAt), 'MMMM dd, yyyy HH:mm')} {/* Format the date */}
                        </Typography>
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
