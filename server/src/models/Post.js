import mongoose from "mongoose";

/* Based on the ER-diagram */
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      //likes stored as a object with ref who liked it, like boolean,
      type: Map,
      of: Boolean,
    },
    comments: {
      //comments just posts like strings [array],
      types: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("imageref", postSchema);

export default Post;

/*
 path : {type: String required: true},
    filename : {type: String required: true}
*/
