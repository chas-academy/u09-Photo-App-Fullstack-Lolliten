import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/users.js";
import postsRoutes from "./src/routes/posts.js";
import searchRoutes from "./src/routes/search.js";
import friendsRoutes from "./src/routes/friends.js";
import User from "./src/models/User.js";
import Post from "./src/models/Post.js";
import connectDB from "./src/db/db.js";

dotenv.config();

/* Initialize Database Connection */
connectDB();

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

/* Enable CORS for all routes below */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

/* Multer config */ //Is multer needed here?
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
    //Consider adding info, like < Date,now()+ "-" + > , or other info
  },
});
const upload = multer({ storage }); //defining upload

/* Routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);
app.use("/search", searchRoutes);
app.use("/friends", friendsRoutes);

/* Routes with files */
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const { path, filename } = req.file;
    const imagerefs = await Post({ path, filename });
    await imagerefs.save(); //imagerefs is the collection

    res.send({ msg: "Image uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.send({ error: "Unable to upload image" });
  }
});

/* Get User */ //Move get user or take away ???
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received user ID:", id); // test

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
