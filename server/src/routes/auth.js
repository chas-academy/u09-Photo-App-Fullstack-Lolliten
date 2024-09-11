import express from "express";
import { login } from "../controllers/auth.js";
import { register } from "../controllers/auth.js";
import multer from "multer";

/* Multer config */ //Is multer needed here?
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, "uploads");
    },
    filename: function (_req, file, cb) {
      cb(null, file.originalname); //Consider adding info, like < Date,now()+ "-" + > , or other info
    },
  });
  const upload = multer({ storage }); //defining upload

const authRoutes = express.Router();

authRoutes.post("/login", login);

authRoutes.post("/profile/:id");

authRoutes.post("/register", upload.single("picture"), register); // Middleware before uploading picture

export default authRoutes;