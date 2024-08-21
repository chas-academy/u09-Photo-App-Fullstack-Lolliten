import express from 'express';
import multer from'multer';

const app = express();


//Multer config

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) { 
      cb(null, file.originalname)
    }
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.json(req.file);
    console.log(req.file);
    console.log(req.body);
});



app.get('/', (req, res) => {
    res.send('Welcome to the API')
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});