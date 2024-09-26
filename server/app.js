import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/users.js";
import postsRoutes from "./src/routes/posts.js";
import User from "./src/models/User.js";
import Post from "./src/models/Post.js";
import { verifyToken } from "./src/middleware/auth.js";
import { createPost } from "./src/controllers/posts.js";
import connectDB from "./src/db/db.js";

dotenv.config();

/* Initialize Database Connection */
connectDB();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

/* Enable CORS for all routes below */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);

/* Multer config */ //Is multer needed here?
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads");
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname); //Consider adding info, like < Date,now()+ "-" + > , or other info
  },
});
const upload = multer({ storage }); //defining upload

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

/* This why profile pic dont appear ??? */
/*app.get("/img/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Post.findById(id);
    if (!image) res.send({ msg: "Image Not Found" });

    const imagePath = path.join(__dirname, "uploads", image.filename);
    res.sendFile(imagePath);
  } catch (error) {
    res.send({ Error: "Unable to get image" });
  }
});*/

//move to auth, protected routes ??
app.post("/post", verifyToken, upload.single("picture"), createPost); //createPost is a middleware

/* Get User */
app.get('/user/:id', async (req, res) => { // getUser from controllers here too?
  const { id } = req.params; //userId or id ??
  console.log('Received user ID:', id); // test

  try {
    // Fetch user from database
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/* Routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);

/* New friend request  */
//Is this etup right ???
// create sendFriendRequestController+
//.post('/users/:userId/send-friend-request', authMiddleware, sendFriendRequestController);

/* Pending friend routes */
app.post("/users/:id/friend-request", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const user = await User.findById(id);

    if (!user.friendRequests.includes(id)) {
      user.friendRequests.push(userId);
      await user.save();
    }

    res.status(200).json(user.friendRequests);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

app.patch("/users/:id/accept-friend", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    user.friends.push(friendId);
    friend.friends.push(id);
    user.friendRequests = user.friendRequests.filter(
      (request) => request.toString() !== friendId
    );

    await user.save();
    await friend.save();

    res.status(200).json(user.friends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

app.patch("/users/:id/reject-friend", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    const user = await User.findById(id);

    user.friendRequests = user.friendRequests.filter(
      (request) => request.toString() !== friendId
    );

    await user.save();

    res.status(200).json(user.friendRequests);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
  
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));


/* ADD DATA ONE TIME FROM DATA folder: TESTDATA*/
// User.insertMany(users);
// Post.insertMany(posts);
/*

** Consider changing the import image method to import.meta.url. **

// Sets up CORS to allow requests from the frontend domain and allows cookies to be included
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);
*/
