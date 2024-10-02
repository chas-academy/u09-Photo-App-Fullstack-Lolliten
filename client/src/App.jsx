import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/pages/welcomePage/welcomePage";
import LoginPage from "./components/pages/loginPage/loginPage";
import ProfilePage from "./components/pages/profilePage/profilePage";
import SearchResults from "./components/scenes/SearchResults";
import EditProfilePage from "./components/pages/editProfile/EditProfile.jsx";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme.js";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);


  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

  /* import pendingRequests from "./components/pages/profilePage";
    <Route
              path="/profile/:userId"
              element={<ProfilePage pendingRequests={pendingRequests} />}
            /> */

/* 
 //const isAuth = Boolean(useSelector((state) => state.token)); // see below

//navigate in the routes instead ?? 
            <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
          </Routes> */
