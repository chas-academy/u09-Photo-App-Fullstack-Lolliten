import express from "express";
import multer from "multer";
import {
  getUser,
  getUserFriends,
  addFriend,
  removeFriend,
  getPendingRequests,
  deleteUser,
  updateUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import User from "../models/User.js";

const userRoutes = express.Router();

/* Multer config */ //Is multer needed here?
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/uploads/profilepictures");
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname); //Consider adding info, like < Date,now()+ "-" + > , or other info
  },
});
const upload = multer({ storage }); //defining upload

userRoutes.get("/search", verifyToken, async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query);
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
      ],
    }).select("firstName lastName picturePath");

    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

userRoutes.get("/:id", verifyToken(["admin", "user"]), getUser);
userRoutes.get("/:id/friends", verifyToken(["admin", "user"]), getUserFriends);
userRoutes.get("/:id/pendingRequests", verifyToken(["admin", "user"]), getPendingRequests);

userRoutes.patch("/addFriend", verifyToken(["admin", "user"]), addFriend);
userRoutes.patch("/removeFriend", verifyToken(["admin", "user"]), removeFriend);

userRoutes.delete("/:id", verifyToken(["admin", "user"]), deleteUser);

userRoutes.put("/:id", upload.single('picturePath'), updateUser);
//userRoutes.put("/:id", verifyToken(["admin", "user"]), updateUser);

export default userRoutes;
