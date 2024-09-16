//import { json } from "express"; //needed ?
import User from "../models/User.js";

/* Read */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching user with id:", id); //test
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error in getUser:", err);
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await User.findById(id); 

    const friends = await Promise.all(
      //Multiple calls to the api
      user.friends.map((id) => User.findById(id)) //To find all friends connected to id
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath }) => {
        //formatting for fronten
        return { _id, firstName, lastName, picturePath };
      }
    );
    res.status(200).json(formattedFriends); // Fixed: Changed status(200), json to status(200).json
  } catch (err) {
    res.status(404).json({ message: "Server error", error: err.message });
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
