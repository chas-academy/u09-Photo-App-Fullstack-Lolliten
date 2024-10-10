import "./App.css";
import { useState } from "react";

function AppFileUploader({ onUpload }) { // Accept onUpload prop
  const [img, setImg] = useState("");
  //creates a FormData object named formdata that will be used to hold the image data for upload.
  //const formdata = new FormData(); 

  const handleImageChange = (event) => {
    const img = event.target.files[0];
    // Validate image file (optional, customize as neded)
    if (!img || !img.type.match("image")) {
      console.error("Please select a valid image file.");
      return;
    }
    setImg(img);
  };

  const handleClick = async () => {
    if (!img) {
      console.error("Please select an image before submitting.");
      return;
    }
    const formdata = new FormData();
    formdata.append("image", img);
    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formdata,
      });
      const data = await response.json();
      onUpload(data); // Call the onUpload callback with the response data
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  return (
    <>
      <h1>Upload one image</h1>
      <input type="file" onChange={handleImageChange} />
      <button type="button" onClick={handleClick}>Submit</button>
    </>
  );
}

export default AppFileUploader;
