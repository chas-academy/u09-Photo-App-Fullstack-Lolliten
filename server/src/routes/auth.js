import express from "express";
import { login, register } from "../controllers/auth.js";
import multer from "multer";

/* Multer config */
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/uploads/profilepictures");
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname); //Consider adding info, like < Date,now()+ "-" + > , or other info
  },
});
const upload = multer({ storage }); //defining upload

const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/register", upload.single("picture"), register); // Move ?? Middleware before uploading picture
authRoutes.get("/profile/:userId"); // should it be a route for only geteting id or for id for profile?

export default authRoutes;
