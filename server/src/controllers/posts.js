import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body; //what front should send
    const user = await User.findById(userId);
    console.log("user", user); //test
    console.log("userid", userId); //test
    console.log("req", req.body); //test
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
    await newPost.save(); //adding new post

    const post = await Post.find(); //get Post model and find the image
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ 
connect to endpoint and get the data, when working then filter
*/
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find(); //(Post model)
    .select("firstName", "lastName", "description", "picturePath", "userId") // Specify the fields to include
      .populate("userId", "firstName", "lastName", "picturePath"); // Populate user details if needed

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

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; //get paramaters id (user) from mongo
    const { userId } = req.body; //get userId from req in body
    const post = await Post.findById(id); //grabbing post info
    const isLiked = post.likes.get(userId); //check if the userid exist and the post is liked

    //an object that include a list of id if it exist delete it
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true); //if non existing set
    }

    const updatedPost = await Post.findByIdAndUpdate(
      //find and update a specific post
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost); //update frontend
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
