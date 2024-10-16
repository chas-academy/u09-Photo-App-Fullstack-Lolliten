import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI =
      "mongodb+srv://lolo:Password123@u09-cluster.jn5av.mongodb.net/lolo?retryWrites=true&w=majority&appName=U09-cluster";
    await connect(mongoURI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    console.log("Connection failed");
    process.exit(1);
  }
};

export default connectDB;