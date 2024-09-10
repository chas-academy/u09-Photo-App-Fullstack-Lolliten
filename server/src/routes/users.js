import express from "express";
import {
    getUser, 
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const userRoutes = express.Router();

/* Read */
userRoutes.get("/:id", verifyToken, getUser);
userRoutes.get("/:id/friends", verifyToken, getUserFriends);

/* Update */
userRoutes.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default userRoutes;
 