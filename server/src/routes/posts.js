import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js"

const postsRoutes = express.Router();

/* READ */
postsRoutes.get("/", verifyToken, getFeedPosts)
postsRoutes.get("/:userId/posts", verifyToken, getUserPosts)

/* UPDATE */
postsRoutes.patch("/:id/like", verifyToken, likePost)

export default postsRoutes;