import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required: true, 
            min: 2,
            max: 50,
        },
        lastName:{
            type: String,
            required: true, 
            min: 2,
            max: 50,
        },
        email:{
            type: String,
            required: true, 
            unique: true,
            max: 50,
        },
        password:{
            type: String,
            required: true, 
            min: 5,
        },
        picturePath:{
            type: String,
            default: "",
        },
        friends:{
            type: Array,
            default: [],
        },
        picturePath:{
            type: String,
            default: "",
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
          },
        friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {timestamps: true}
);

const User = mongoose.model("User", UserSchema)

export default User;