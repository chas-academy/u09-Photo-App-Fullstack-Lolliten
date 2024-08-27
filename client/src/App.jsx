import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import WelcomePage from "pages/welcomePage"
import LoginPage from "pages/loginPage"
import ProfilePage from "pages/profilePage"

function App() {

    return
    <>
    <BrowserRouter>
    <Routes>

    <Route path="/" element={<LoginPage />} />
    <Route path="/welcome" element={<WelcomePage />} />
    <Route path="/profile/:userId" element={<ProfilePage />} />
    
    </Routes>
    </BrowserRouter>

    </>
}

export default App