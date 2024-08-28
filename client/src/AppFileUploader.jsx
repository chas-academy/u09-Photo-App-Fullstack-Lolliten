import "./App.css";
import { useState } from "react";

function App() {
  const [img, setImg] = useState(""); //"" will store the slected image
  const formdata = new FormData(); //creates a FormData object named formdata that will be used to hold the image data for upload.

  const handleImageChange = (event) => {
    const img = event.target.files[0];
    // Validate image file (optional, customize as needed)
    if (!img || !img.type.match("image")) {
      console.error("Please select a valid image file.");
      return;
    }
    setImg(img); // Update state with selected image
  };
  const handleClick = async () => {
    if (!img) {
      console.error("Please select an image before submitting.");
      return;
    }
    formdata.append("image", img);
    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formdata,
      });
      /*const data = await response.json(); // Get response data (e.g., success message, image URL)
      console.log(data.msg);*/ // display success message instead
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  // append everytime or better way before send form to back then append value in the img state

  return (
    <>
      <h1>Upload one image</h1>

      <input type="file" onChange={handleImageChange} />

      <button type="button" onClick={handleClick}>Submit</button>
    </>
  );
}

export default App;
