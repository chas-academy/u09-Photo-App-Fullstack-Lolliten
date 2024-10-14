import User from "../models/User.js";
import mongoose from "mongoose";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === ":userId") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in getUser:", err);
    res.status(404).json({ message: err.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error in getAllUser:", err);
    res.status(404).json({ message: err.message });
  }
};

/* Helper function */
const formatFriends = (friends) => {
  return friends.map(({ _id, firstName, lastName, picturePath }) => {
    return { _id, firstName, lastName, picturePath };
  });
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch friends based on their IDs
    //Do i need the selct too ??
    const friends = await User.find({ _id: { $in: user.friends } }).select('_id firstName lastName picturePath'); // Ensure to select the necessary fields
    console.log("Friend data:", friends) //test
    const formattedFriends = formatFriends(friends); // Use the helper function to format friends
    console.log("Formatted data:", formattedFriends) // test
    res.status(200).json(formattedFriends);
  } catch (err) {
    console.error("Error in getUserFriends:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addFriend = async (req, res) => {
  try {
    const { friendId, userId } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      friend.friends.push(userId);
      const index = user.friendRequests.indexOf(friendId);
      if (index > -1) {
        user.friendRequests.splice(index, 1);
      }
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

export const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    // Remove friendId from user's friend list
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    // Remove userId from friend's friend list
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id, "friendRequests");
    return res.status(200).send(user);
  } catch (err) {
    console.error("Error in getPendingRequests", err);
    res.status(500).json({ message: "Server error:", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
