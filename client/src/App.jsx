import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
/*import WelcomePage from "../pages/WelcomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";*/

/* FAILS TO IMPORT ABOVE */

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

export default App;