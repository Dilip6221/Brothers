import React, { useContext } from 'react'
import { Routes, Route, useLocation,Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import NotFound from './pages/NotFound.jsx'
import Navbar from './component/Navbar.jsx'
import { UserContext } from "./context/UserContext.jsx";

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/forget-password"];
  const { token } = useContext(UserContext);  
  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />}/>  
        <Route path="/forget-password/:token" element={<ForgetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App