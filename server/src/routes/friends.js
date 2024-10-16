import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth.js";
import {
  addFriend,
  getPendingRequests,
  removeFriend,
} from "../controllers/users.js";

const friendsRoutes = express.Router();

/* TA BORT Multer config */
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/uploads/profilepictures");
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname); //Consider adding info, like < Date,now()+ "-" + > , or other info
  },
});
const upload = multer({ storage }); //defining upload

friendsRoutes.post(
  "/friend-request",
  verifyToken(["admin", "user"]),
  getPendingRequests
);

friendsRoutes.patch(
  "/accept-friend",
  verifyToken(["admin", "user"]),
  addFriend
);

friendsRoutes.patch(
  "/reject-friend",
  verifyToken(["admin", "user"]),
  removeFriend
);

export default friendsRoutes;

/*
friendsRoutes.post("/:id/friend-request", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
  
      const user = await User.findById(id);
  
      if (!user.friendRequests.includes(id)) {
        user.friendRequests.push(userId);
        await user.save();
      }
  
      res.status(200).json(user.friendRequests);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  });
  
  friendsRoutes.patch("/:id/accept-friend", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { friendId } = req.body;
  
      const user = await User.findById(id);
      const friend = await User.findById(friendId);
  
      user.friends.push(friendId);
      friend.friends.push(id);
      user.friendRequests = user.friendRequests.filter(
        (request) => request.toString() !== friendId
      );
  
      await user.save();
      await friend.save();
  
      res.status(200).json(user.friends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  });
  
  friendsRoutes.patch(":id/reject-friend", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { friendId } = req.body;
  
      const user = await User.findById(id);
  
      user.friendRequests = user.friendRequests.filter(
        (request) => request.toString() !== friendId
      );
  
      await user.save();
  
      res.status(200).json(user.friendRequests);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  });
*/
