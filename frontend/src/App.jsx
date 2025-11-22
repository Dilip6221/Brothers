import React, { useContext } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import NotFound from './pages/NotFound.jsx'
import Navbar from './component/Navbar.jsx'
import { UserContext } from "./context/UserContext.jsx";
import Footer from "./component/Footer.jsx";
import ServiceIcon from "./component/ServiceIcon.jsx";
import AdminLayout from './pages/Admin/AdminLayout.jsx'
import AdminInquery from './pages/Admin/AdminInquery.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import UserList from './pages/Admin/UserList.jsx'

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/forget-password", "/admin"];
  const { user, loading } = useContext(UserContext);
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // if (loading) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
  //       <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
  //         <span className="visually-hidden">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <>
      <div>
        {!shouldHideNavbar && <ServiceIcon />}
        {!shouldHideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/forget-password/:token" element={<ForgetPassword />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/admin/*"
            element={
              loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <div className="spinner-border text-warning"></div>
                </div>
              ) : user?.role === "ADMIN" ? (
                <AdminLayout />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="admin/inquery" element={<AdminInquery />} />
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/users" element={<UserList />} />

        </Routes>
        {!shouldHideNavbar && <Footer />}
      </div>
    </>
  );
};

export default App;
