import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../../../state/reduxConfig";
import Navbar from "../../scenes/Navbar";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Container,
  Paper,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
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
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}users/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormValues({ ...formValues, picturePath: file });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in formValues) {
      formData.append(key, formValues[key]);
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}users/${userId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (response.ok) {
      dispatch(setUserProfile(formValues));
      navigate(`/profile/${userId}`);
    } else {
      const error = await response.json();
      setErrorMessage(error.message || "Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}users/${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.ok) {
      navigate("/");
    } else {
      const error = await response.json();
      setErrorMessage(error.message || "Failed to delete account");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6 } }}>
        <Paper
          elevation={3}
          component="form"
          onSubmit={handleUpdate}
          sx={{
            p: { xs: 2, sm: 4 },
            mt: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              mb: 4,
              textAlign: "center",
            }}
          >
            Edit Profile
          </Typography>

          <Stack spacing={3}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                label="First Name"
                name="firstName"
                value={formValues.firstName}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formValues.lastName}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </Box>

            <TextField
              label="Email"
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              label="New Password"
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
              fullWidth
            />

            <TextField
              label="Old Password"
              type="password"
              name="oldPassword"
              value={formValues.oldPassword}
              onChange={handleInputChange}
              fullWidth
            />

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                textAlign: "center",
              }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profile-photo-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="profile-photo-upload">
                <Button variant="outlined" component="span" sx={{ mb: 1 }}>
                  Upload Profile Photo
                </Button>
              </label>
              {formValues.picturePath && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file:{" "}
                  {typeof formValues.picturePath === "string"
                    ? formValues.picturePath
                    : formValues.picturePath.name}
                </Typography>
              )}
            </Paper>

            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}

            <Stack
              spacing={2}
              sx={{
                mt: 4,
                width: "100%",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ py: 1.5 }}
              >
                Update Profile
              </Button>

              <Button
                variant="outlined"
                color="error"
                size="large"
                onClick={handleDeleteAccount}
                sx={{ py: 1.5 }}
              >
                Delete Account
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditProfilePage;
