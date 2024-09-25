import express from "express";
import {
  getUser,
  getUserFriends,
  addFriend,
  //removeFriend
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import User from "../models/User.js";

const userRoutes = express.Router();

/* Search */
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

/* Read */
userRoutes.get("/:id", verifyToken, getUser); //if works dont change..
userRoutes.get("/:id/friends", verifyToken, getUserFriends);
//userRoutes.get("/:id/pendingRequest", verifyToken, );

/* Update */
userRoutes.patch("/addFriend", verifyToken, addFriend);
//userRoutes.patch("/removeFriend", verifyToken, removeFriend)
//pending request


export default userRoutes;
