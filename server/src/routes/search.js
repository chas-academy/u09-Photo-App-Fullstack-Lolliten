import express from "express";
import User from "../models/User.js";

const searchRoutes = express.Router();

searchRoutes.get("/", async (req, res) => {
  try {
    const query = req.query.q;
    console.log("SearchQuery:", query); 

    /* const { query } = req.body;
    console.log("SearchQuery:", req.query.q) */

    /* Find all users where either the username OR the 
        email matches the given query, ignoring case */
    const user = await User.find({
      //MongoDB operator that performs a logical OR operation on array
      //$options: 'i': makes the regex case-insensitive
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).limit(10); //limit result to 10 users

    res.json(user);
  } catch (error) {
    console.error("Search error", error);
    res.status(500).json({ message: "An error occured during search" });
  }
});

export default searchRoutes;

/* infinite loading ?? */
