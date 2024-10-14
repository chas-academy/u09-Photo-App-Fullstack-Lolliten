import express from "express";
import { createPost, getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js"
import multer from "multer";

const postsRoutes = express.Router();

/* Multer config */ //Is multer needed here?
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, "public/uploads/posts");
    },
    filename: function (_req, file, cb) {
      cb(null, file.originalname); //Consider adding info, like < Date,now()+ "-" + > , or other info
    },
  });
  const upload = multer({ storage }); //defining upload

/* READ */
postsRoutes.get("/", verifyToken(["admin", "user"]), getFeedPosts)
postsRoutes.get("/:userId/posts", verifyToken(["admin", "user"]), getUserPosts)
postsRoutes.post("/", verifyToken(["admin", "user"]), upload.single("picture"), createPost)

/* UPDATE */
postsRoutes.patch("/:id/like", verifyToken(["admin", "user"]), likePost)

export default postsRoutes;