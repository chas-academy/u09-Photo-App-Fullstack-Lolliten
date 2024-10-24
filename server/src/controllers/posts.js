import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "firstName lastName userPicturePath") // Populate user details
      .exec();

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addCommentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, text } = req.body;

    console.log("Add comment postId:", id); // test

    const post = await Post.findById(id).populate({
      path: "comments.userId",
      select: "firstName lastName",
    });

    const newComment = {
      userId,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    console.log("new comment", newComment);

    await post.save();

    res.status(200).json(newComment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const fetchCommentPost = async (req, res) => {
  try {
    const { id } = req.params; // Post ID

    const post = await Post.findById(id).select("comments");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post.comments);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
