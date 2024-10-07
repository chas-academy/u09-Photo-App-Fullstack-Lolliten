import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Dropzone from "react-dropzone";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const EditProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    picturePath: "",
    oldPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          picturePath: data.picturePath,
          oldPassword: "", // Initialize oldPassword here
        });
      } else {
        console.error("Failed to fetch user data:", response.status);
      }
    };
    getUser();
  }, [userId]);

  /* Handle input change */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  /* Handle form submission to update user data */
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in formValues) {
      formData.append(key, formValues[key]);
    }

    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      // Handle successful update
      console.log("Profile updated successfully"); //test
    } else {
      const error = await response.json();
      setErrorMessage(error.message || "Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Account deleted successfully");
    } else {
      const error = await response.json();
      setErrorMessage(error.message || "Failed to delete account");
    }
  };

  if (!user) return null;

  return (
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
