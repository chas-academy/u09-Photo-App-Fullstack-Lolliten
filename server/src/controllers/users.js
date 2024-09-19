import User from "../models/User.js";
import mongoose from "mongoose";

/* Read: Get user */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

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

    res.status(404).json({ message: err.message });
  }
};

/* Helper function */
const formatFriends = (friends) => {
  return friends.map(({ _id, firstName, lastName, picturePath }) => {
    return { _id, firstName, lastName, picturePath };
  });
};

/* Read: Get user's friends */
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching friends for userId:", id);

    const user = await User.findById(id);

    if (!user) {
      console.log(`No user found with ID: ${id}`); //test
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);
    console.log("User friends:", user.friends);

    const friends = await User.find({ _id: { $in: user.friends } });
    console.log("Friends fetched:", friends);

    const formattedFriends = formatFriends(friends);
    res.status(200).json(formattedFriends);
  } catch (err) {
    console.error("Error in getUserFriends:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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
    const formattedFriends = formatFriends(friends);
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};