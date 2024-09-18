import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import User from "../models/User.js";

const userRoutes = express.Router();

/* Read */
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
userRoutes.get("/:id/friends", verifyToken, (req, res, next) => {
  // for testing:
  console.log(`Received request for user friends. User ID: ${req.params.id}`);
  getUserFriends(req, res, next);
});

/* Update (add or remove friends) */
userRoutes.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default userRoutes;
