import { React, useContext, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "../../css/style.css";
import "../../css/admin.css";
import loginLogo from "../../assets/images/rydax.png";


const AdminLayout = ({ children }) => {
  const { user, logout } = useContext(UserContext);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
  useEffect(() => {
    document.body.classList.add("admin-page");
    return () => document.body.classList.remove("admin-page");
  }, []);
  const isOthersActive =
    location.pathname.includes("blogs") ||
    location.pathname.includes("gallery") ||
    location.pathname.includes("inquery") ||
    location.pathname.includes("subscribe") ||
    location.pathname.includes("customer-reviews") ||
    location.pathname.includes("about-timeline");

  const isOnlineServiceActive =
    location.pathname.includes("online-services-category") ||
    location.pathname.includes("online-services") ||
    location.pathname.includes("online-services-packages") ||
    location.pathname.includes("online-addon-services");
  return (
    <>
      <div className="container-fluid position-relative d-flex p-0">

        <div className="sidebar pe-4 pb-3 bg-dark" style={{ width: "17%" }}>
          <nav className="navbar navbar-dark">
            <NavLink to="/admin/dashboard" className="w-100 d-flex justify-content-center align-items-center ">
                  <img src={loginLogo} alt="Logo" className="admin-logo" />
            </NavLink>
            <div className="navbar-nav w-100">
              <NavLink
                to="/admin/dashboard"
                onClick={() => window.dispatchEvent(new Event("dashboardClick"))}
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="fa fa-tachometer-alt me-2"></i>Dashboard
              </NavLink>

              <NavLink
                to="/admin/users"
                onClick={() => window.dispatchEvent(new Event("ourTeamClick"))}
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-person-badge-fill me-2"></i>Our Team
              </NavLink>
              <NavLink
                to="/admin/services"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-tools me-2"></i>Services
              </NavLink>
              <div
                className={`nav-item ${openMenu === "onlineService" || isOnlineServiceActive ? "open" : ""
                  }`}
              >
                <div
                  className="nav-link submenu-toggle"
                  onClick={() => toggleMenu("onlineService")}
                >
                  <i className="bi bi-card-checklist me-2"></i>
                  Online Service
                  <i className="fa fa-angle-down  float-end"></i>
                </div>

                <div className="submenu">
                  <NavLink
                    to="/admin/online-services-category"
                    className="dropdown-item"
                  >
                    Services Category
                  </NavLink>
                  <NavLink
                    to="/admin/online-services"
                    className="dropdown-item"
                  >
                    Services
                  </NavLink>
                  <NavLink
                    to="/admin/online-services-packages"
                    className="dropdown-item"
                  >
                    Service Packges
                  </NavLink>
                  <NavLink
                    to="/admin/online-addon-services"
                    className="dropdown-item"
                  >
                    Addon Service
                  </NavLink>
                </div>
              </div>

              <NavLink
                to="/admin/user-cars"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-car-front me-2"></i>User Cars
              </NavLink>
              <NavLink
                to="/admin/job-cards"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-card-checklist me-2"></i>Job Cards
              </NavLink>
              <div
                className={`nav-item ${openMenu === "others" || isOthersActive ? "open" : ""
                  }`}
              >
                <div
                  className="nav-link submenu-toggle"
                  onClick={() => toggleMenu("others")}
                >
                  <i className="bi bi-grid me-2"></i>
                  Manage
                  <i className="fa fa-angle-down float-end"></i>
                </div>
                <div className="submenu">
                  <NavLink to="/admin/inquery" className="dropdown-item">
                    Customer Inquiry
                  </NavLink>

                  <NavLink to="/admin/blogs" className="dropdown-item">
                    Our Blogs
                  </NavLink>

                  <NavLink to="/admin/gallery" className="dropdown-item">
                    Gallery
                  </NavLink>

                  <NavLink to="/admin/subscribe" className="dropdown-item">
                    Newsletters
                  </NavLink>

                  <NavLink to="/admin/about-timeline" className="dropdown-item">
                    About Timeline
                  </NavLink>

                  <NavLink to="/admin/customer-reviews" className="dropdown-item">
                    Customer Reviews
                  </NavLink>

                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="content">

          {/* TOP NAV */}
          <nav className="navbar navbar-expand bg-dark navbar-dark sticky-top px-4 py-0">

            <a href="#" className="sidebar-toggler text-danger flex-shrink-0">
              <i className="fa fa-bars"></i>
            </a>

            <form className="d-none d-md-flex ms-4">
              <input
                className="form-control bg-black border-0"
                type="search"
                placeholder="Search"
              />
            </form>
            <div className="navbar-nav align-items-center ms-auto">
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="fa fa-user me-lg-2"></i>
                  <span className="d-none d-lg-inline-flex">{user?.name}</span>
                </a>
                <div className="dropdown-menu dropdown-menu-end bg-dark border-0 rounded-0 rounded-bottom m-0">
                  <a href="#" className="dropdown-item" onClick={logout}>Logout</a>
                  <a href="/" className="dropdown-item"  > Back Portal</a>
                </div>
              </div>
            </div>

          </nav>

          <div className="p-4">
            {children}
          </div>

        </div>

      </div>
    </>
  );
};

export default AdminLayout;
