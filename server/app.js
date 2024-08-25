import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { Path } from 'react-router-dom';
import path from 'path';

import dotenv from "dotenv";

dotenv.config(); // Load environment variables from a .env file into process.env

import ImageModel from './src/model/imageModel.js';
import connectDB from './src/db/db.js';

// Initialize Database Connection
connectDB;

const app = express();
app.use(express.json());
app.use(express.static("uploads")) //imported path but not sure will work

// Enable CORS for all routes below
app.use(cors());

//Multer config
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads');
    },
    filename: function (_req, file, cb) { 
      cb(null, file.originalname)      //Consider adding info, like < Date,now()+ "-" + > , or other info
    }
});
const upload = multer({ storage });

// Routes
app.post('/api/upload', upload.single('image'), async(req, res) => {
  try {
    console.log(req.file) //test
    const { path, filename } = req.file
    const imagerefs = await ImageModel({ path, filename })
    await imagerefs.save()
   
    res.send({ "msg": "Image uploaded successfully" })
    
    console.log(path, filename) //test
  } catch (error) {
    console.log(error)
        res.send({ "error": "Unable to upload image" })
  } 
});

app.get('/img/:id', async (req, res) => {
  const {id} = req.params
    try {
      const image = await ImageModel.findById(id)
      if(!image) res.send({"msg":"Image Not Found"})

        const imagePath = path.join(__dirname, "uploads", image.filename)
        res.sendFile(imagePath)
        } catch (error) {
          res.send({"Error": "Unable to get image"})
        }
})

// Middleware before uploading picture
app.post("/auth/register", upload.single("picture"), register)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});


/*
// Sets up CORS to allow requests from the frontend domain and allows cookies to be included
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
*/