import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    path : {type: String},
    filename : {type: String}
});

const ImageModel = mongoose.model("imagerefs", imageSchema);

export default ImageModel;

// Tog bort required: true i Schema för felsök