import { connect } from "mongoose";

import dotenv from "dotenv";

dotenv.config();
// Load environment variables from a .env file into process.env

const connectDB = async () => {
  try {
    const mongoURI =
      "mongodb://lolo:Password123@localhost:27017/imagerefs"; //do i need username and password to connect? 
    await connect(mongoURI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    console.log("Connection failed");
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;