import User from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === ":userId" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (id == null) {
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
    const friends = await User.find({ _id: { $in: user.friends } }).select(
      "_id firstName lastName picturePath"
    );
    const formattedFriends = formatFriends(friends); // Use the helper function to format friends
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

      // Remove the friend request from the user's friendRequests
      user.friendRequests = user.friendRequests.filter(
        (request) => request._id.toString() !== friendId // Ensure to convert to string for comparison
      );
     
      const index = friend.sentRequests.indexOf(userId);
      if (index > -1) {
        friend.sentRequests.splice(index, 1);
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

//create redux state, make sure its coming through,
//check how you set the friendRequest state, do similiar
//
export const friendRequests = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const friend = await User.findById(friendId);
    const user = await User.findById(userId);

    // Check if the friend exists
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (friend.friends === userId){
      //then send "already friends" implement in frontend to.
    }
    if (
      !friend.friendRequests.some((requestVar) => requestVar._id === userId)
    ) {
      friend.friendRequests.push({
        _id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      user.sentRequests.push(friendId)
      await user.save();
      await friend.save();
    }

    res.status(200).json(friend.friendRequests); // CORRECT ???
  } catch (err) {
    res.status(500).json({ message: err.message });
    // Changed to 500 for server errors
  }
};

//edit profile
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

//edit profile
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, oldPassword } = req.body;
  const picturePath = req.file ? req.file.path : null; // Get the file path if a file was uploaded

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
    }
    if (picturePath) user.picturePath = picturePath; // Update picture path if provided
    // Save the updated user
    const updatedUser = await user.save();

    if (oldPassword) {
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
