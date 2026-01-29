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
// import ServiceIcon from "./component/ServiceIcon.jsx";
import AdminLayout from './pages/Admin/AdminLayout.jsx'
import AdminInquery from './pages/Admin/inquery/AdminInquery.jsx'
import AdminUserList from './pages/Admin/user/AdminUserList.jsx'
import AdminBlogs from './pages/Admin/blog/AdminBlogs.jsx'
import AdminCreateBlog from './pages/Admin/blog/AdminCreateBlog.jsx'
import Blog from './pages/Blog.jsx'
import BlogView from './pages/BlogView.jsx'
import AdminDashboard from './pages/Admin/dashboard/AdminDashboard.jsx'
import Contact from './pages/Contact.jsx'
import AdminServiceList from './pages/Admin/service/AdminServiceList.jsx'
import AdminCreateService from './pages/Admin/service/AdminCreateService.jsx'
import AdminNewsLatters from './pages/Admin/news-latter/AdminNewsLatters.jsx'
import Gallery from './pages/Gallery.jsx'
import AdminGallery from './pages/Admin/gallery/AdminGallery.jsx'
import Ppf from './pages/Service/Ppf.jsx'
import Paint from './pages/Service/Paint.jsx'
import Ceramic from './pages/Service/Ceramic.jsx'
import CarWash from './pages/Service/CarWash.jsx'
import AdminUserCars from './pages/Admin/user-cars/AdminUserCars.jsx'
import AdminCreateUserCars from './pages/Admin/user-cars/AdminCreateUserCars.jsx'
import AdminJobCards from './pages/Admin/job-card/AdminJobCards.jsx'
import AdminCreateJobCards from './pages/Admin/job-card/AdminCreateJobCards.jsx'
import AdminUpdateJobCards from './pages/Admin/job-card/AdminUpdateJobCards.jsx'
import AdminJobCardTimeLine from './pages/Admin/job-card/AdminJobCardTimeLine.jsx'
import AdminJobServices from './pages/Admin/job-card/AdminJobServices.jsx'

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
      {/* {!shouldHideNavbar && <ServiceIcon />} */}
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/ppf" element={<Ppf />} />
        <Route path="/paint" element={<Paint />} />
        <Route path="/ceramic" element={<Ceramic />} />
        <Route path="/premium-car-wash" element={<CarWash />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/gallery" element={<Gallery />} />
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
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admin/gallery/create" element={<AdminGallery />} />
        <Route path="/admin/services/create" element={<AdminCreateService />} />
        <Route path="/admin/services/edit/:id" element={<AdminCreateService />} />
        <Route path="/admin/user-cars" element={<AdminUserCars />} />
        <Route path="/admin/user-cars/create" element={<AdminCreateUserCars />} />
        <Route path="/admin/job-cards" element={<AdminJobCards />} />
        <Route path="/admin/job-cards/create" element={<AdminCreateJobCards />} />
        <Route path="/admin/job-cards/update/:id" element={<AdminUpdateJobCards />} />
        <Route path="/admin/job-cards/:id/timeline" element={<AdminJobCardTimeLine />} />
        <Route path="/admin/job-cards/:jobId/services" element={<AdminJobServices />} />
      </Routes>
      {!shouldHideNavbar && <Footer />}
    </>
  );
};

export default App;
