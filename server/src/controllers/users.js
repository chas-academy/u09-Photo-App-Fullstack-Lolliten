import { json } from "express";
import User from "../models/User.js";
import mongoose from "mongoose";

/* Read */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received user ID:", id); // debugging
    const user = await User.findById(id);
    res.status(200).json(user);

    if (!id || id === ':userId') {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) { 
      return res.status(400).json({ message: "Invalid user ID" });
    }
  } catch (err) {
    console.error("Error in getUser:", err);
    res.status(500).json({ error: err.message });
  }
};

//const user = await User.findById(userId).populate('friends', '_id firstName lastName picturePath');

export const getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received user ID:", userId);

    const user = await User.findById(userId);
    
    if (!user) {
      console.log(`No user found with ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.friends || !Array.isArray(user.friends)) {
      console.log(`User ${userId} has no friends array`);
      return res.status(200).json([]);
    }

    const friends = await User.find({ _id: { $in: user.friends } })
      .select('_id firstName lastName picturePath');

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error in getUserFriends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* Update */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath }) => {
        return { _id, firstName, lastName, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
