import {
  ManageAccountsOutlined,
  EditOutlined,         //ta bort ?
  LocationOnOutlined,  //ta bort ?
  WorkOutlineOutlined, //ta bort ?
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "../utensils/Userimage";
import FlexBetween from "../utensils/FlexBetween";
import WidgetWrapper from "../utensils/WidgetWrapper";
import { useSelector } from "react-redux"; //ta bort ?
import { useEffect, useState } from "react"; //ta bort ?
import { useNavigate } from "react-router-dom";
import capitalizeFirstLetters from "../utensils/capitalizeFirstLetters";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main; // ta bort ?

const getUser = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}users/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  setUser(data);
}

useEffect(() => {
  getUser();
}, []);

  if (!user) {
    return null;
  }

  const { 
    firstName,
    lastName,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/edit-profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {capitalizeFirstLetters(`${firstName} ${lastName}`)}
            </Typography>
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
        {/* onClick={() => navigate(`/edit-profile`)}  */}
      </FlexBetween>
      <Divider />
    </WidgetWrapper>
  );
};

export default UserWidget;
