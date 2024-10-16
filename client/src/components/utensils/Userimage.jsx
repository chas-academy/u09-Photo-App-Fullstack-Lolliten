import { Avatar } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
    const imageUrl = image ? `${import.meta.env.VITE_API_URL}uploads/profilepictures/${image}` : null; // Construct the image URL

    return (
        <Avatar
            alt="user"
            src={imageUrl}
            sx={{ width: size, height: size }}
            onError={(e) => {
                e.target.onerror = null; // Prevent looping
                e.target.src = `${import.meta.env.VITE_API_URL}uploads/profilepictures/${image}`; // Replace with your default image path
            }}
        />
    );
};

export default UserImage;
