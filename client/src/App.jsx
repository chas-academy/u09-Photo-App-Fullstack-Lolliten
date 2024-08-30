import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/pages/welcomePage/welcomePage"
import LoginPage from "./components/pages/LoginPage/loginPage";
import ProfilePage from "./components/pages/ProfilePage/profilePage";

function App() {

    return (
    <>
    <BrowserRouter>
    <Routes>

    <Route path="/" element={<LoginPage />} />
    <Route path="/welcome" element={<WelcomePage />} />
    <Route path="/profile/:userId" element={<ProfilePage />} />
    
    </Routes>
    </BrowserRouter>

    </>
    )
}

export default App;