import User from "../models/User.js";
import mongoose from "mongoose";

/* Read: Get user */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    res.status(200).json(user);

    if (!id || id === ":userId") {
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
    //const { friendsId, userId } = req.body;
    //console.log("Fetching friends for userId:", userId); //test
    console.log("Fetching friends for userId:", id); //test

    const user = await User.findById(id);

    if (!user) {
      console.log(`No user found with ID: ${id}`); //test
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user); //test
    console.log("User friends:", user.friends); //test

    const friends = await User.find({ _id: { $in: user.friends } });
    console.log("Friends fetched:", friends); // test

    const formattedFriends = formatFriends(friends);
    res.status(200).json(formattedFriends);
  } catch (err) {
    console.error("Error in getUserFriends:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* Update */
export const addFriend = async (req, res) => {
  try {
    const { friendId, userId } = req.body;
    console.log(friendId, userId) //test

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    console.log("user", user); //test
    console.log("friend", friend); //test

    if (user.friends.includes(friendId)) {
      /*user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== userId);*/
      // dont add a second time, inform user
    } else {
      user.friends.push(friendId);
      friend.friends.push(userId);
      const index = user.friendRequests.indexOf(friendId);
      user.friendRequests.splice(index, 1);
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

/*export const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    //Remove friendId from user friend list
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    //Remove userId from friends list
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    //Remove friendId from users friendrequest list
    if (user.friendRequests) {
      user.friendRequests = user.friendRequests.filter(
        (id) => id.toString() !== friendId
      );
    }

    await user.save();
    await friend.save();

    //Fetch updated friends list
    const updatedFriends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = formatFriends(updatedFriends);

    res.status(200).json({
      friends: formattedFriends,
      friendRequests: user.friendRequests || [],
    });
  } catch (err) {
    //404 ???
    res.status(404).json({ message: err.message });
  }
};*/
//clean the friend requests
//remove function
