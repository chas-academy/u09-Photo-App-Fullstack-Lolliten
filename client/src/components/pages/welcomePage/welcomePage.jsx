import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../../scenes/Navbar";
import MyPostWidget from "../../utensils/MyPostWidget";
import PostsWidget from "../../utensils/PostWidget";
//import { useSelector } from "react-redux";


const WelcomePage = () => {
    //const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    //const { _id, picturePath } = useSelector((state) => state.user);

      return (
        <Box>
          <Navbar />
          <Box>
            <MyPostWidget />
            <PostsWidget />
          </Box>
        </Box>
      )
    }
    //     <Box>
    //       <Navbar />
    //       <Box
    //         width="100%"
    //         padding="2rem 6%"
    //         display={isNonMobileScreens ? "flex" : "block"}
    //         gap="0.5rem"
    //         justifyContent="space-between"
    //       >
    //         <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
    //           <UserWidget userId={_id} picturePath={picturePath} />
    //         </Box>
    //         <Box
    //           flexBasis={isNonMobileScreens ? "42%" : undefined}
    //           mt={isNonMobileScreens ? undefined : "2rem"}
    //         >
    //           <MyPostWidget picturePath={picturePath} />
    //           <PostsWidget userId={_id} /> {/* Display posts from friends */}
    //         </Box>
    //         {isNonMobileScreens && (
    //           <Box flexBasis="26%">
    //             <Box m="2rem 0" />
    //             <FriendListWidget userId={_id} />
    //           </Box>
    //         )}
    //       </Box>
    //     </Box>
    //   );
    // };
    

export default WelcomePage;

/*  <Box
          width="100%"
          padding="2rem 6%"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="0.5rem"
          justifyContent="space-between"
        >
          <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
            <UserWidget userId={_id} picturePath={picturePath} />
          </Box>
          <Box
            flexBasis={isNonMobileScreens ? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            <MyPostWidget picturePath={picturePath} />
            <PostsWidget userId={_id} />
          </Box>
          {isNonMobileScreens && (
            <Box flexBasis="26%">
              <Box m="2rem 0" />
              <FriendListWidget userId={_id} />
            </Box>
          )}
        </Box> */

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
        
      </Box>
      */
