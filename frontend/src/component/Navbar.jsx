import React from "react";
import { Link ,NavLink } from "react-router-dom";
import loginLogo from "../assets/brand.png";

const Navbar = () => {
  return (
    <>
      {/* Wrapper */}
      <div className="navbar-wrapper bg-black text-light">
        <div className="container d-flex align-items-center justify-content-between">
          {/* Logo */}
          <a href="/" className="navbar-brand d-flex align-items-center">
            <img src={loginLogo} alt="Logo" className="navbar-logo" />
          </a>

          {/* Right Side Navbars */}
          <div className="d-flex flex-column text-end">
            {/* --- Top Navbar --- */}
            <ul className="nav justify-content-end align-items-center small mb-2">
              <li className="nav-item">
                <a className="nav-link cool-link" href="mailto:beradilip39@gmail.com">
                  <i className="bi bi-envelope "></i> beradilip39@gmail.com
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link cool-link " href="tel:9313015917">
                  <i className="bi bi-phone "></i> 9313015917
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link social-icon" href="https://x.com/DilipBe00479036" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-twitter-x"></i>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link social-icon" href="https://www.instagram.com/brotomotiv.in" target="_blank" rel="noreferrer">
                  <i className="bi bi-instagram"></i>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link social-icon" href="https://youtube.com/@dilipahir6221" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-youtube"></i>
                </a>
              </li>
              <li className="nav-item px-2">
                <a className="btn btn-outline-warning btn-sm rounded-pill px-3" href="#contact_dummy">
                  <i className="bi bi-people-fill me-1"></i> Collab
                </a>
              </li>
              <li className="nav-item px-2">
                <Link className="btn btn-warning btn-sm rounded-pill px-3 text-dark fw-semibold" to="login" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link> 
              </li>
            </ul>

            {/* --- Bottom Navbar --- */}
            <nav className="navbar navbar-expand-lg navbar-dark p-0" style={{marginLeft:'-150px'}}>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="mainNavbar">
                <ul className="navbar-nav gap-4" style={{ fontSize: '18px'}}>
                  <li className="nav-item">
                    <NavLink  to="/" className={({ isActive }) => `nav-link cool-link ${isActive ? "active" : ""}`}>Home</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/about" className={({ isActive }) => `nav-link cool-link ${isActive ? "active" : ""}`}>About Us</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/services" className={({ isActive }) => `nav-link cool-link ${isActive ? "active" : ""}`}>Services</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/franchise" className={({ isActive }) => `nav-link cool-link ${isActive ? "active" : ""}`}>Franchise</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/stores" className={({ isActive }) => `nav-link cool-link ${isActive ? "active" : ""}`}>Our Stores</NavLink>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
