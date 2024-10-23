import mongoose from "mongoose";

/* Based on the ER-diagram */
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    description: String,
    picturePath: String,
    userPicturePath: String,
    comments: [ //or { type: [String], default: [] },
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("imageref", postSchema);

export default Post;

/*
 // likes: {
    //   //likes stored as a object with ref who liked it, like boolean,
    //   type: Map,
    //   of: Boolean,
    // },

 path : {type: String required: true},
    filename : {type: String required: true}
*/
