import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/pages/welcomePage/welcomePage";
import LoginPage from "./components/pages/loginPage/loginPage";
import ProfilePage from "./components/pages/profilePage/profilePage";
import SearchResults from "./components/scenes/SearchResults";
import EditProfilePage from "./components/pages/editProfile/EditProfile.jsx";
import AdminDashboard from"./components/adminDashboard/AdminDashboard.jsx";
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
            <Route path="/edit-profile/:userId" element={<EditProfilePage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;