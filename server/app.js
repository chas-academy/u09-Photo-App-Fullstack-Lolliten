import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js"; //didnt have a authRoutes in auth.js so added it
import userRoutes from "./src/routes/users.js"; //didnt have a userRoutes in user.js so added it
import postsRoutes from "./src/routes/posts.js";
import { register } from "./src/controllers/auth.js";
import User from "./src/models/User.js";
import Post from "./src/models/Post.js";
import { verifyToken } from "./src/middleware/auth.js";
import { createPost } from "./src/controllers/posts.js";
import connectDB from "./src/db/db.js";

dotenv.config(); // Load environment variables from a .env file into process.env

// Initialize Database Connection
connectDB();

const app = express();
app.use(express.json());
app.use(express.static("uploads"));

// Enable CORS for all routes below
app.use(cors());

//Multer config
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads");
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname); //Consider adding info, like < Date,now()+ "-" + > , or other info
  },
});
const upload = multer({ storage });

// Routes with files
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

app.get("/img/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Post.findById(id);
    if (!image) res.send({ msg: "Image Not Found" });

    const imagePath = path.join(__dirname, "uploads", image.filename);
    res.sendFile(imagePath);
  } catch (error) {
    res.send({ Error: "Unable to get image" });
  }
});

app.post("/auth/register", upload.single("picture"), register); // Middleware before uploading picture
app.post("/post", verifyToken, upload.single("picture"), createPost); //createPost is a middleware

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*
** Consider changing the import image method to import.meta.url. **

// Sets up CORS to allow requests from the frontend domain and allows cookies to be included
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
*/
