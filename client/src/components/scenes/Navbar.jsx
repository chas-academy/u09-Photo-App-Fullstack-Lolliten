import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import {
  setSearchLoading,
  setSearchResults,
  setSearchError,
} from "../../state/reduxConfig.jsx";
import { setMode, setLogout } from "../../state/reduxConfig.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../utensils/FlexBetween.jsx";
import capitalizeFirstLetters from "../utensils/capitalizeFirstLetters.jsx"; // Import the function

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
    console.log(event.target.value);
  };

  const handleSearch = async () => {
    console.log("Serachquery a string?", searchQuery); // test
    try {
      dispatch(setSearchQuery(searchQuery));
      dispatch(setSearchLoading(true));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}search?q=${searchQuery}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Search failed");
      }
      const result = await response.json();

      dispatch(setSearchResults(result));
      dispatch(setSearchLoading(false));
    } catch (error) {
      console.error("Search error:", error);
      dispatch(setSearchError(error.message));
      dispatch(setSearchLoading(false));
    }
    /* Navigate to search result of users */
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const goToProfile = () => {
    if (user) {
      navigate(`/profile/${user._id}`);
    }
  };

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  let fullName = ""; //default

  if (user) {
    fullName = capitalizeFirstLetters(`${user.firstName} ${user.lastName}`); // Capitalize the user's full name
  }

  const goToHome = () => {
    if (user) {
      navigate("/welcome"); // Navigate to WelcomePage if logged in
    } else {
      navigate("/login"); // Navigate to login page if not logged in
    }
  };

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem" flexDirection={isMobile ? "column" : "row"}>
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={goToHome}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          Digital Album
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={isMobile ? "100%" : "auto"}
          mt={isMobile ? 2 : 0}
        >
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="1rem"
            padding="0.1rem 1rem"
            sx={{
              width: isMobile ? "95%" : "auto",
            }}
          >
            <InputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={handleChange}
              sx={{ flex: 1 }}
            />
            <IconButton onClick={handleSearch}>
              <Search />
            </IconButton>
          </FlexBetween>
        </Box>
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <Message sx={{ fontSize: "25px" }} />
          <Notifications sx={{ fontSize: "25px" }} />
          <Help sx={{ fontSize: "25px" }} />
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName} onClick={goToProfile}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="1rem"
              padding="0.1rem 1rem"
              sx={{
                width: "80%", // Adjust width for mobile
              }}
            >
              <InputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={handleChange}
                sx={{ flex: 1 }}
              />
              <IconButton onClick={handleSearch}>
                <Search />
              </IconButton>
            </FlexBetween>
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName} onClick={goToProfile}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
