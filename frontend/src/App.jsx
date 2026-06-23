import React, { useContext } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { UserContext } from "./context/UserContext.jsx";
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import NotFound from './pages/NotFound.jsx'
import Navbar from './component/Navbar.jsx'
import WhatsappButton  from './component/WhatsappButton.jsx'
import Footer from "./component/Footer.jsx";
import Blog from './pages/Blog.jsx'
import BlogView from './pages/BlogView.jsx'
import Contact from './pages/Contact.jsx'
import Gallery from './pages/Gallery.jsx'
import Faq from './pages/Faq.jsx'

// import Ppf from './pages/Service/Ppf.jsx'
// import Paint from './pages/Service/Paint.jsx'
// import Ceramic from './pages/Service/Ceramic.jsx'
// import CarWash from './pages/Service/CarWash.jsx'

// import ServiceIcon from "./component/ServiceIcon.jsx";
import AdminLayout from './pages/Admin/AdminLayout.jsx'
import AdminDashboard from './pages/Admin/dashboard/AdminDashboard.jsx'
import AdminUserList from './pages/Admin/user/AdminUserList.jsx'
import AdminBlogs from './pages/Admin/blog/AdminBlogs.jsx'
import AdminCreateBlog from './pages/Admin/blog/AdminCreateBlog.jsx'
import AdminInquery from './pages/Admin/inquery/AdminInquery.jsx'
import AdminNewsLatters from './pages/Admin/news-latter/AdminNewsLatters.jsx'

import AdminServiceList from './pages/Admin/service/AdminServiceList.jsx'
import AdminCreateService from './pages/Admin/service/AdminCreateService.jsx'

import AdminGallery from './pages/Admin/gallery/AdminGallery.jsx'


import AdminUserCars from './pages/Admin/user-cars/AdminUserCars.jsx'
import AdminCreateUserCars from './pages/Admin/user-cars/AdminCreateUserCars.jsx'
import AdminJobCards from './pages/Admin/job-card/AdminJobCards.jsx'
import AdminCreateJobCards from './pages/Admin/job-card/AdminCreateJobCards.jsx'
import AdminUpdateJobCards from './pages/Admin/job-card/AdminUpdateJobCards.jsx'
import AdminJobCardTimeLine from './pages/Admin/job-card/AdminJobCardTimeLine.jsx'
import AdminJobServices from './pages/Admin/job-card/AdminJobServices.jsx'
import AdminJobMedia from './pages/Admin/job-card/AdminJobMedia.jsx';
import MyCarVault from './pages/MyCarVault.jsx';
import CustomerJobCard from './pages/CustomerJobCard.jsx';
import ScrollToTop from './component/ScrollToTop.jsx';
import AdminCustomerReview from './pages/Admin/customer-review/AdminCustomerReview.jsx';
import AdminAboutTimeLine from './pages/Admin/about-time-line/AdminAboutTimeLine.jsx';
import AdminCreateAboutTimeLine from './pages/Admin/about-time-line/AdminCreateAboutTimeLine.jsx';

import OnlineServiceLayout from './pages/OnlineService/OnlineServiceLayout.jsx';  
import AdminOnlineServiceCategory from './pages/OnlineService/admin/category/AdminOnlineServiceCategory.jsx';
import AdminCreateOnlineServiceCategory from './pages/OnlineService/admin/category/AdminCreateOnlineServiceCategory.jsx';
import AdminOnlineService from './pages/OnlineService/admin/service/AdminOnlineService.jsx';
import AdminCreateOnlineService from './pages/OnlineService/admin/service/AdminCreateOnlineService.jsx';
import AdminCreateOnlineServicePackages from './pages/OnlineService/admin/packges/AdminCreateOnlineServicePackages.jsx';
import AdminOnlineServicePackages from './pages/OnlineService/admin/packges/AdminOnlineServicePackages.jsx';
import AdminOnlineAddonService from './pages/OnlineService/admin/addon/AdminOnlineAddonService.jsx';
import AdminCreateOnlineAddonService from './pages/OnlineService/admin/addon/AdminCreateOnlineAddonService.jsx';
import ScrollToTopArrow from './component/ScrollToTopArrow.jsx';
import ServiceCard from './pages/ServiceCard.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import Profile from './pages/Profile.jsx';

const App = () => {
  const location = useLocation();
  const { user, authLoading } = useContext(UserContext);

  const hideNavbarRoutes = ["/login", "/forget-password", "/admin","/online-services"];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

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
    return <Navigate to="/" replace />;
  }

  //  Admin route but user is not ADMIN
  if (isAdminRoute && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ScrollToTop />
      <ScrollToTopArrow />
      {/* {!shouldHideNavbar && <ServiceIcon />} */}
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* <Route path="/ppf" element={<Ppf />} />
        <Route path="/paint" element={<Paint />} />
        <Route path="/ceramic" element={<Ceramic />} />
        <Route path="/premium-car-washs" element={<CarWash />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/blog/:slug" element={<BlogView />} />
        {/* <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} /> */}
        {/* <Route path="/forget-password/:token" element={<ForgetPassword />} /> */}
        <Route path="/my-car-vault" element={<MyCarVault />} />
        <Route path="/my-car-vault/:carId/job-card" element={<CustomerJobCard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/faqs" element={<Faq />} />
        <Route path="/services" element={<ServiceCard />} />
        <Route path="service/:slug" element={<ServiceDetail />} />
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
        <Route path="/admin/job-cards/:id/media" element={<AdminJobMedia />} />
        <Route path="/admin/customer-reviews" element={<AdminCustomerReview />} />
        <Route path="/admin/about-timeline" element={<AdminAboutTimeLine />} />
        <Route path="/admin/about-timeline/create" element={<AdminCreateAboutTimeLine />} />
        <Route path="/admin/about-timeline/edit/:id" element={<AdminCreateAboutTimeLine />} />
        
        <Route path="/admin/online-services-category" element={<AdminOnlineServiceCategory />} />
        <Route path="/admin/online-services-category/create" element={<AdminCreateOnlineServiceCategory />} />
        <Route path="/admin/online-services-category/edit/:id" element={<AdminCreateOnlineServiceCategory />} />


        <Route path="/admin/online-services" element={<AdminOnlineService />} />
        <Route path="/admin/online-services/create" element={<AdminCreateOnlineService />} />
        <Route path="/admin/online-services/edit/:id" element={<AdminCreateOnlineService />} />

        <Route path="/admin/online-services-packages" element={<AdminOnlineServicePackages />} />
        <Route path="/admin/online-services-packages/create" element={<AdminCreateOnlineServicePackages />} />
        <Route path="/admin/online-services-packages/edit/:id" element={<AdminCreateOnlineServicePackages />} />

       <Route path="/admin/online-addon-services" element={<AdminOnlineAddonService />} />
        <Route path="/admin/online-addon-services/create" element={<AdminCreateOnlineAddonService />} />
        <Route path="/admin/online-addon-services/edit/:id" element={<AdminCreateOnlineAddonService />} />

        <Route path="/online-services" element={<OnlineServiceLayout />} />
      </Routes>
      {!shouldHideNavbar && <Footer />}
      {!shouldHideNavbar && <WhatsappButton />}
    </>
  );
};

export default App;
