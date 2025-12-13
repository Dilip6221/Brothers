import { React, useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const AdminLayout = ({ children }) => {
  const {user,logout} = useContext(UserContext);
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
                to="/admin/inquery"
                onClick={() => window.dispatchEvent(new Event("inquieryClick"))}
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-clipboard-check-fill me-2"></i>Inquiry
              </NavLink>
              <NavLink
                to="/admin/subscribe"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-envelope-arrow-up-fill me-2"></i>Newsletters
              </NavLink>
              <NavLink to="/admin/blogs" onClick={() => window.dispatchEvent(new Event("ourBlogClick"))} className={({ isActive }) =>`nav-item nav-link ${isActive ? "active" : ""}`}>
                <i className="fa fa-keyboard me-2"></i>Our Blogs
              </NavLink>
              <NavLink
                to="/admin/services"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="fa fa-keyboard me-2"></i>Services
              </NavLink>

              <NavLink
                to="/admin/chart"
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="fa fa-chart-bar me-2"></i>Charts
              </NavLink>

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
                  <i className="fa fa-envelope me-lg-2"></i>
                  <span className="d-none d-lg-inline-flex">Message</span>
                </a>

                <div className="dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom m-0">
                  <a href="#" className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <img
                        className="rounded-circle"
                        src="img/user.jpg"
                        alt=""
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div className="ms-2">
                        <h6 className="fw-normal mb-0">Jhon sent you a message</h6>
                        <small>15 minutes ago</small>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="fa fa-user me-lg-2"></i>
                  <span className="d-none d-lg-inline-flex">{user?.name}</span>
                </a>
                <div className="dropdown-menu dropdown-menu-end bg-dark border-0 rounded-0 rounded-bottom m-0">
                  <a href="#" className="dropdown-item">My Profile</a>
                  <a href="#" className="dropdown-item">Settings</a>
                  <a href="#" className="dropdown-item" onClick={logout}>Logout</a>
                  <a href="/" className="dropdown-item"  > Back Portal</a>
                </div>
              </div>
            </div>

          </nav>

          {/* RENDER CHILD COMPONENTS */}
          <div className="p-4">
            {children}
          </div>

        </div>

      </div>
    </>
  );
};

export default AdminLayout;
