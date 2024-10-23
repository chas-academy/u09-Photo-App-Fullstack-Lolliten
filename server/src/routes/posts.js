import express from "express";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  fetchCommentPost,
  addCommentPost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";

const postsRoutes = express.Router();

/* Multer config */
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/uploads/posts");
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
    //Consider adding info, like < Date,now()+ "-" + > , or other info
  },
});
const upload = multer({ storage });

postsRoutes.post(
  "/",
  verifyToken(["admin", "user"]),
  upload.single("picture"),
  createPost
);
postsRoutes.post("/allPosts", verifyToken(["admin", "user"]), getFeedPosts);
postsRoutes.get("/:userId", verifyToken(["admin", "user"]), getUserPosts);

postsRoutes.get(
  "/:id/addComments",
  verifyToken(["admin", "user"]),
  fetchCommentPost
);
postsRoutes.post(
  "/:id/addComments",
  verifyToken(["admin", "user"]),
  addCommentPost
);

export default postsRoutes;
