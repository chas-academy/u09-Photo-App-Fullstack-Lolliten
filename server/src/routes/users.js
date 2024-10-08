import express from "express";
import {
  getUser,
  getUserFriends,
  addFriend,
  removeFriend,
  getPendingRequests,
  deleteUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import User from "../models/User.js";

const userRoutes = express.Router();

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

userRoutes.get("/:id", verifyToken, getUser);
userRoutes.get("/:id/friends", verifyToken, getUserFriends);
userRoutes.get("/:id/pendingRequests", verifyToken, getPendingRequests);

userRoutes.patch("/addFriend", verifyToken, addFriend);
userRoutes.patch("/removeFriend", verifyToken, removeFriend);

userRoutes.delete("/:id", verifyToken, deleteUser);

export default userRoutes;
