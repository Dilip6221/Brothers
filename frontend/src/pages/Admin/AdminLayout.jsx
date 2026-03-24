import { React, useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "../../css/style.css";
import "../../css/admin.css";

const AdminLayout = ({ children }) => {
  const { user, logout } = useContext(UserContext);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
  const isOthersActive =
    location.pathname.includes("blogs") ||
    location.pathname.includes("gallery") ||
    location.pathname.includes("inquery") ||
    location.pathname.includes("subscribe") ||
    location.pathname.includes("customer-reviews") ||
    location.pathname.includes("about-timeline");

  return (
    <>
      <div className="container-fluid position-relative d-flex p-0">

        {/* ------------ SIDEBAR ------------ */}
        <div className="sidebar pe-4 pb-3 bg-dark">
          <nav className="navbar navbar-dark">
            <NavLink to="/admin/dashboard" className="navbar-brand mx-4 mb-3">

              <h3 className="section-title mb-1 mt-1">
                <span className="first-letter">B</span>
                ROTHER'S
              </h3>
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

              {/* <NavLink
                to="/admin/inquery"
                onClick={() => window.dispatchEvent(new Event("inquieryClick"))}
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-clipboard-check-fill me-2"></i>Inquiry
              </NavLink> */}
              {/* <NavLink
                to="/admin/subscribe"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-envelope-arrow-up-fill me-2"></i>Newsletters
              </NavLink> */}
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

              {/* <NavLink to="/admin/blogs" onClick={() => window.dispatchEvent(new Event("ourBlogClick"))} className={({ isActive }) => `nav-item nav-link ${isActive ? "active" : ""}`}>
                <i className="fa fa-keyboard me-2"></i>Our Blogs
              </NavLink> */}
              {/* <NavLink
                to="/admin/gallery"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-images me-2"></i>Gallery
              </NavLink> */}
              {/* <NavLink
                to="/admin/customer-reviews"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-chat-dots me-2"></i>Reviews
              </NavLink> */}
              {/* <NavLink
                to="/admin/about-timeline"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-clock-history me-2"></i>About Timeline
              </NavLink> */}

            </div>
          </nav>
        </div>

        {/* ------------ MAIN CONTENT ------------ */}
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
