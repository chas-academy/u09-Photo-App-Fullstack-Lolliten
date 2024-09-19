import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/pages/welcomePage/welcomePage";
import LoginPage from "./components/pages/loginPage/loginPage";
import ProfilePage from "./components/pages/profilePage/profilePage";
import SearchResults from "./components/scenes/SearchResults";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme.js";

function App() {
    const mode = useSelector((state) => state.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    //const isAuth = Boolean(useSelector((state) => state.token)); // see commented out in bottom

    // search route rightly import ???

  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>

        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

/*       //navigate in the routes instead ?? 
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
