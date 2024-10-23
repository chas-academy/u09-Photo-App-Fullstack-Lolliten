import express from "express";
import { adminLogin, deleteUser, deletePost, login, register } from "../controllers/auth.js";
import { getAllUser } from "../controllers/users.js";
import multer from "multer";
import { verifyToken } from "../middleware/auth.js";

/* Multer config */
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/uploads/profilepictures");
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname); 
  },
});
const upload = multer({ storage });

const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/register", upload.single("picture"), register);

authRoutes.get("/profile/:userId");

authRoutes.post("/admin", verifyToken(["admin"]), getAllUser);
authRoutes.post("/admin", verifyToken(["admin"]), adminLogin);
authRoutes.delete("/admin/:userId", verifyToken(["admin"]), deleteUser);
authRoutes.delete("/admin/posts/:userId", verifyToken(["admin"]), deletePost); 

export default authRoutes;
