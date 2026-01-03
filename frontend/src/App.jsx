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
import AdminUserList from './pages/Admin/AdminUserList.jsx'
import AdminBlogs from './pages/Admin/AdminBlogs.jsx'
import AdminCreateBlog from './pages/Admin/AdminCreateBlog.jsx'
import Blog from './pages/Blog.jsx'
import BlogView from './pages/BlogView.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import Contact from './pages/Contact.jsx'
import AdminServiceList from './pages/Admin/AdminServiceList.jsx'
import AdminNewsLatters from './pages/Admin/AdminNewsLatters.jsx'

const App = () => {
  const location = useLocation();
  const { user, authLoading } = useContext(UserContext);

  const hideNavbarRoutes = ["/login", "/forget-password", "/admin"];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  //  Simple Admin Route Guard
  const isAdminRoute = location.pathname.toLowerCase().startsWith("/admin");

  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-warning"></div>
      </div>
    );
  }

  //  Admin route but user not logged in
  if (isAdminRoute && !user) {
    return <Navigate to="/login" replace />;
  }

  //  Admin route but user is not ADMIN
  if (isAdminRoute && user?.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {!shouldHideNavbar && <ServiceIcon />}
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogView />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/forget-password/:token" element={<ForgetPassword />} />
        <Route path="*" element={<NotFound />} />

        {/*  ALL ADMIN ROUTES ARE NOW PROTECTED AUTOMATICALLY */}
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/services" element={<AdminServiceList />} />
        <Route path="/admin/users" element={<AdminUserList />} />
        <Route path="/admin/inquery" element={<AdminInquery />} />
        <Route path="/admin/subscribe" element={<AdminNewsLatters />} />
        <Route path="/admin/blogs" element={<AdminBlogs />} />
        <Route path="/admin/blogs/create" element={<AdminCreateBlog />} />
        <Route path="/admin/blogs/edit/:id" element={<AdminCreateBlog />} />
      </Routes>
      {!shouldHideNavbar && <Footer />}
    </>
  );
};

export default App;
