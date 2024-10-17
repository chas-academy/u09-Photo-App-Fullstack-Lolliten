import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { setUserProfile } from "../../../state/reduxConfig"; // Import the action
import Navbar from "../../scenes/Navbar";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Dropzone from "react-dropzone";
import { useParams, useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch(); // Initialize dispatch
  const user = useSelector((state) => state.user); // Get user from Redux state
  const [formValues, setFormValues] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    picturePath: "",
    password: "",
    oldPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFormValues({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          picturePath: data.picturePath,
          password: "",
          oldPassword: "",
        });
      } else {
        console.error("Failed to fetch user data:", response.status);
      }
    };
    getUser();
  }, [userId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in formValues) {
      if (key === "picturePath" && formValues.picturePath instanceof File) {
        formData.append("picturePath", formValues.picturePath);
      } else {
        formData.append(key, formValues[key]);
      }
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}users/${userId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) {
      // Dispatch the action to update the Redux state
      dispatch(setUserProfile(formValues)); // Update the user profile in Redux
      console.log("Profile updated successfully");
      navigate(`/profile/${userId}`); // Redirect to the profile page after update
    } else {
      const error = await response.json();
      setErrorMessage(error.message || "Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      console.log("Account deleted successfully");
      navigate("/"); // Redirect to home after deletion
    } else {
      const error = await response.json();
      setErrorMessage(error.message || "Failed to delete account");
    }
  };

  return (
    <Box>
      <Navbar />
      <Box
        component="form"
        onSubmit={handleUpdate}
        sx={{
          display: "grid",
          gap: "30px",
          gridTemplateColumns: isNonMobile ? "repeat(4, minmax(0, 1fr))" : "1fr",
          padding: "2rem",
        }}
      >
        <TextField
          label="First Name"
          name="firstName"
          value={formValues.firstName}
          onChange={handleInputChange}
          required
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formValues.lastName}
          onChange={handleInputChange}
          required
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleInputChange}
          required
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleInputChange}
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          label="Old Password"
          type="password"
          name="oldPassword"
          value={formValues.oldPassword}
          onChange={handleInputChange}
          sx={{ gridColumn: "span 4" }}
        />
        <Box
          gridColumn="span 4"
          border={`1px solid ${theme.palette.neutral.medium}`}
          borderRadius="5px"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg, .jpeg, .png"
            multiple={false}
            onDrop={(acceptedFiles) =>
              setFormValues({ ...formValues, picturePath: acceptedFiles[0] })
            }
          >
            {({ getRootProps, getInputProps }) => (
              <Box
                {...getRootProps()}
                border={`2px dashed ${theme.palette.neutral.main}`}
                p="1rem"
                sx={{ "&:hover": { cursor: "pointer" } }}
              >
                <input {...getInputProps()} />
                {!formValues.picturePath ? (
                  <p> Add Picture Here</p>
                ) : (
                  <Typography>{formValues.picturePath.name}</Typography>
                )}
              </Box>
            )}
          </Dropzone>
        </Box>
        {errorMessage && (
          <Typography color={theme.palette.error.main} sx={{ mt: "1rem" }}>
            {errorMessage}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ gridColumn: "span 4" }}
        >
          Update Profile
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteAccount}
          sx={{ gridColumn: "span 4" }}
        >
          Delete Account
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfilePage;

/*
  /*Toggle editing mode */
/*const toggleEdit = () => {
    setUser(!user);
  };

onClick={toggleEdit}

form onSubmit={handleUpdate}

Username, password, email, picture: onChange={handleInputChange}
*/
