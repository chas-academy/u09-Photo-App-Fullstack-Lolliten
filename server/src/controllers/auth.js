import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./src/model/User.js";
import { error } from "server/router"; //create error message??

// Register User
export const register = async (req, res) => {
    try{
      const {
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath,
        friends,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
    } catch (err) {
        res.staus(500).json({ error: err.message })
    }
} 