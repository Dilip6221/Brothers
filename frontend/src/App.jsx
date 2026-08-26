import React, { lazy, Suspense, useContext, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { UserContext } from "./context/UserContext.jsx";
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
// Legacy email/password login pages are disabled; OTP login is provided by LoginDrawer.
// import Login from './pages/Login.jsx'
// import ForgetPassword from './pages/ForgetPassword.jsx'
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
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout.jsx'))
const AdminDashboard = lazy(() => import('./pages/Admin/dashboard/AdminDashboard.jsx'))
const AdminUserList = lazy(() => import('./pages/Admin/user/AdminUserList.jsx'))
const AdminBlogs = lazy(() => import('./pages/Admin/blog/AdminBlogs.jsx'))
const AdminCreateBlog = lazy(() => import('./pages/Admin/blog/AdminCreateBlog.jsx'))
const AdminInquery = lazy(() => import('./pages/Admin/inquery/AdminInquery.jsx'))
const AdminNewsLatters = lazy(() => import('./pages/Admin/news-latter/AdminNewsLatters.jsx'))
const AdminServiceList = lazy(() => import('./pages/Admin/service/AdminServiceList.jsx'))
const AdminCreateService = lazy(() => import('./pages/Admin/service/AdminCreateService.jsx'))
const AdminGallery = lazy(() => import('./pages/Admin/gallery/AdminGallery.jsx'))
const AdminUserCars = lazy(() => import('./pages/Admin/user-cars/AdminUserCars.jsx'))
const AdminCreateUserCars = lazy(() => import('./pages/Admin/user-cars/AdminCreateUserCars.jsx'))
const AdminJobCards = lazy(() => import('./pages/Admin/job-card/AdminJobCards.jsx'))
const AdminCreateJobCards = lazy(() => import('./pages/Admin/job-card/AdminCreateJobCards.jsx'))
const AdminUpdateJobCards = lazy(() => import('./pages/Admin/job-card/AdminUpdateJobCards.jsx'))
const AdminJobCardTimeLine = lazy(() => import('./pages/Admin/job-card/AdminJobCardTimeLine.jsx'))
const AdminJobServices = lazy(() => import('./pages/Admin/job-card/AdminJobServices.jsx'))
const AdminJobMedia = lazy(() => import('./pages/Admin/job-card/AdminJobMedia.jsx'))
import MyCarVault from './pages/MyCarVault.jsx';
import CustomerJobCard from './pages/CustomerJobCard.jsx';
import ScrollToTop from './component/ScrollToTop.jsx';
const AdminCustomerReview = lazy(() => import('./pages/Admin/customer-review/AdminCustomerReview.jsx'))
const AdminAboutTimeLine = lazy(() => import('./pages/Admin/about-time-line/AdminAboutTimeLine.jsx'))
const AdminCreateAboutTimeLine = lazy(() => import('./pages/Admin/about-time-line/AdminCreateAboutTimeLine.jsx'))

const OnlineServiceLayout = lazy(() => import('./pages/OnlineService/OnlineServiceLayout.jsx'))
const AdminOnlineServiceCategory = lazy(() => import('./pages/OnlineService/admin/category/AdminOnlineServiceCategory.jsx'))
const AdminCreateOnlineServiceCategory = lazy(() => import('./pages/OnlineService/admin/category/AdminCreateOnlineServiceCategory.jsx'))
const AdminOnlineService = lazy(() => import('./pages/OnlineService/admin/service/AdminOnlineService.jsx'))
const AdminCreateOnlineService = lazy(() => import('./pages/OnlineService/admin/service/AdminCreateOnlineService.jsx'))
const AdminCreateOnlineServicePackages = lazy(() => import('./pages/OnlineService/admin/packges/AdminCreateOnlineServicePackages.jsx'))
const AdminOnlineServicePackages = lazy(() => import('./pages/OnlineService/admin/packges/AdminOnlineServicePackages.jsx'))
const AdminOnlineAddonService = lazy(() => import('./pages/OnlineService/admin/addon/AdminOnlineAddonService.jsx'))
const AdminCreateOnlineAddonService = lazy(() => import('./pages/OnlineService/admin/addon/AdminCreateOnlineAddonService.jsx'))
import ScrollToTopArrow from './component/ScrollToTopArrow.jsx';
import GlobalLoader from './component/GlobalLoader.jsx';
import ServiceCard from './pages/ServiceCard.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import Profile from './pages/Profile.jsx';
import { useLoader } from './context/LoaderContext.jsx';
import { attachGlobalLoader } from './utils/loader.js';
import RouteSeo from './component/Seo.jsx';

const App = () => {
  const location = useLocation();
  const { user, authLoading } = useContext(UserContext);
  const { setGlobalLoading, startRequest, endRequest } = useLoader();

  const hideNavbarRoutes = ["/login", "/forget-password", "/admin","/online-services"];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const isAdminRoute = location.pathname.toLowerCase().startsWith("/admin");

  useEffect(() => {
    const cleanup = attachGlobalLoader({ startRequest, endRequest });
    return cleanup;
  }, [startRequest, endRequest]);

  useEffect(() => {
    if (authLoading) {
      setGlobalLoading(true, 'Your Premium studio is waiting...');
      return;
    }

    setGlobalLoading(true, 'Loading page...');
    const timer = window.setTimeout(() => {
      setGlobalLoading(false);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [authLoading, location.pathname, setGlobalLoading]);

  if (authLoading) {
    return <GlobalLoader />;
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
      <GlobalLoader />
      <ScrollToTop />
      <ScrollToTopArrow />
      <RouteSeo />
      {/* {!shouldHideNavbar && <ServiceIcon />} */}
      {!shouldHideNavbar && <Navbar />}

      <Suspense fallback={<GlobalLoader />}>
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
      </Suspense>
      {!shouldHideNavbar && <Footer />}
      {!shouldHideNavbar && <WhatsappButton />}
    </>
  );
};

export default App;
