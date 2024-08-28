import { json } from "express";
import User from "../models/User.js";

/* C R U D */

/* Read */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params; // To grab id from choosen string
    const user = await User.findById(id); //To grab user from id
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
   try {
    const { id } = req.params; // To grab id from choosen string
    const user = await User.findById(id); //To grab user from id
  
    const friends = await Promise.all(
      //Multiple calls to the api
      user.friends.map((id) => User.findById(id)) //To find all friends connected to id
    );
  
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => { //formatting for fronten
      return { _id, firstName, lastName, occupation, location, picturePath }
      }
    );
    res.status(200),json(formattedFriends);
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
   };


   /* Update */


