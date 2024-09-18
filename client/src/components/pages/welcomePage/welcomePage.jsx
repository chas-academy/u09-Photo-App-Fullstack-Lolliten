import { Box } from "@mui/material";
import Navbar from "../../scenes/Navbar"
//import SearchResults from "../../scenes/SearchResults"; 

/* Photo-feed of your added friends */

const WelcomePage = () => {

/*  <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 64px)', // Adjust this value based on your Navbar height
          padding: '2rem',
        }}
      >
        <Typography variant="h5" component="p" align="center">
          Welcome, this is where you will see your friends' photos!
        </Typography>
      </Box>*/

    return (
        <Box>
        <Navbar />
        </Box>
    )
};

export default WelcomePage;