import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import FlexBetween from "../utensils/FlexBetween";
import WidgetWrapper from "../utensils/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/reduxConfig";
import capitalizeFirstLetters from "../utensils/capitalizeFirstLetters";
import { format } from "date-fns";

const PostWidget = () => {
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [posts, setPostsState] = useState([]);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}posts/allPosts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      // Sort posts by creation date (latest first)
      const sortedPosts = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPostsState(sortedPosts);
      dispatch(setPosts({ posts: sortedPosts }));
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  const fetchComments = async () => {
    try {
      const { _id, token } = useSelector((state) => state.user);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}posts/${_id}/fetchComments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const isComments = await response.json();
      setComments(isComments);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}posts/${postId}/addComments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId, text: commentText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const updatedCommentPost = await response.json();

      setPostsState((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedCommentPost._id ? updatedCommentPost : post
        )
      );
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const toggleCommentBox = () => {
    setIsCommentBoxOpen(!isCommentBoxOpen);
    if (!isCommentBoxOpen) {
      fetchComments();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box>
      {posts.map((post) => (
        <WidgetWrapper key={post._id} m="2rem 0">
          {post.userId && (
            <FlexBetween>
              <Typography
                color="neutral.main"
                sx={{ mt: "1rem", fontWeight: "bold" }}
              >
                {capitalizeFirstLetters(
                  `${post.userId.firstName} ${post.userId.lastName}`
                )}{" "}
                {/* Capitalize user's name */}
              </Typography>
              <img
                src={`http://localhost:3000/uploads/profilepictures/${post.userId.userPicturePath}`} // Display user's profile picture
                alt="User"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
            </FlexBetween>
          )}
          {/* Display the user's name */}
          {post.firstName && post.lastName && (
            <Typography
              color="neutral.main"
              sx={{ mt: "1rem", fontWeight: "bold" }}
            >
              {capitalizeFirstLetters(`${post.firstName} ${post.lastName}`)}{" "}
              {/* Capitalize user's name */}
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
              {format(new Date(post.createdAt), "MMMM dd, yyyy HH:mm")}{" "}
              {/* Format the date */}
            </Typography>
          )}
          <FlexBetween mt="0.25rem">
            <FlexBetween gap="1rem">
              <FlexBetween gap="0.3rem">
                <IconButton>
                  {Boolean(
                    post.likes && loggedInUserId && post.likes[loggedInUserId]
                  ) ? (
                    <FavoriteOutlined sx={{ color: "primary.main" }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography>{Object.keys(post.likes || {}).length}</Typography>
              </FlexBetween>

              <FlexBetween gap="0.3rem">
                <IconButton onClick={toggleCommentBox}>
                  <ChatBubbleOutlineOutlined />
                </IconButton>
                <Typography>{post.comments.length}</Typography>
              </FlexBetween>
            </FlexBetween>

            <IconButton>
              <ShareOutlined />
            </IconButton>
          </FlexBetween>

          {isCommentBoxOpen && (
            <Box mt="1rem">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Write a comment..."
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                sx={{ mt: "0.5rem" }}
                variant="contained"
                onClick={() => handleCommentSubmit(post._id)}
              >
                Post Comment
              </Button>
            </Box>
          )}

          {post.comments.length > 0 && (
            <Box mt="0.5rem">
              {post.comments.map((comment, i) => (
                <Box key={`${post._id}-${i}`}>
                  <Divider />
                  <Typography
                    sx={{ color: "neutral.main", m: "0.5rem 0", pl: "1rem" }}
                  >
                    {capitalizeFirstLetters(
                      `${comment.firstName || "Unknown"} ${
                        comment.lastName || "User"
                      }`
                    )}{" "}
                    | {comment.text}
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
