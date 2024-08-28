import express from "express";
import {
    getUser, 
    getUserFriends,
    //addRemoveFriend,
} from "../controllers/users.js";
//import { verifyToken } from "../middleware/auth.js";

const userRoutes = express.Router(); //express router

// C R U D

// Read
userRoutes.get("/:id", /*verifyToken,*/ getUser);
userRoutes.get("/:id/friends", /*verifyToken,*/ getUserFriends);

// Update
//router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default userRoutes;
 