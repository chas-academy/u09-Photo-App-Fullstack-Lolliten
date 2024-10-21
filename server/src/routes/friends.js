import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addFriend,
  friendRequests,
  removeFriend,
  rejectFriend
} from "../controllers/users.js";

const friendsRoutes = express.Router();

friendsRoutes.post(
  "/friend-request",
  verifyToken(["admin", "user"]),
  friendRequests
);

friendsRoutes.patch(
  "/accept-friend",
  verifyToken(["admin", "user"]),
  addFriend
);

friendsRoutes.patch(
  "/reject-friend",
  verifyToken(["admin", "user"]),
  rejectFriend
);

friendsRoutes.patch(
  "/remove-friend",
  verifyToken(["admin", "user"]),
  removeFriend
);

export default friendsRoutes;
