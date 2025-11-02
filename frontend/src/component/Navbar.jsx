import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import loginLogo from "../assets/brand.png";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import * as bootstrap from "bootstrap";

const Navbar = () => {
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);
  const { user, logout, token } = useContext(UserContext);
  const [resetPassword, setResetPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (modalRef.current) {
      bsModalRef.current = new bootstrap.Modal(modalRef.current, {
        backdrop: true,
        keyboard: true,
      });
    }
    return () => {
      if (bsModalRef.current) {
        bsModalRef.current.dispose();
        bsModalRef.current = null;
      }
    };
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResetPassword((prev) => ({ ...prev, [name]: value }));
  };
  const openModal = () => {
    if (bsModalRef.current) {
      setResetPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      bsModalRef.current.show();
    }
  };

  const closeModal = () => {
    if (bsModalRef.current) {
      bsModalRef.current.hide();
    }
  };
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/reset-password`, {
        currentPassword: resetPassword.currentPassword,
        newPassword: resetPassword.newPassword,
        confirmPassword: resetPassword.confirmPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setResetPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
        closeModal();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <>
      {/* Wrapper */}
      {/* <div className="navbar-wrapper bg-black text-light "> */}
        <div className="navbar-wrapper fixed-top">

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
              {!user ? (
                <li className="nav-item px-2">
                  <Link className="btn btn-warning btn-sm rounded-pill px-3 text-dark fw-semibold" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </Link>
                </li>
              ) : (
                <li className="nav-item dropdown px-2">
                  <a href="#" className="btn btn-outline-warning btn-sm rounded-pill px-3 d-flex align-items-center" id="userDropdown" role="button">
                    <i className="bi bi-person-circle me-1"></i> {user.name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu shadow-lg border-0 rounded-1" style={{ minWidth: "220px", marginTop: "0px" }}>
                    <li className="px-3 py-2 border-bottom">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-warning text-dark fw-bold d-flex justify-content-center align-items-center me-2" style={{ width: "35px", height: "35px" }}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h6 className="mb-0">{user.name}</h6>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </li>
                    <li>
                      <button className="dropdown-item d-flex align-items-center rounded-3 py-2">
                        <i className="bi bi-person me-2 text-primary"></i> View Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={openModal}
                        className="dropdown-item d-flex align-items-center rounded-3 py-2"
                      >
                        <i className="bi bi-key me-2 text-warning"></i> Reset Password
                      </button>
                    </li>
                    <li>
                      <button onClick={logout} className="dropdown-item d-flex align-items-center text-danger rounded-3 py-2">
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              )}
            </ul>

            {/* --- Bottom Navbar --- */}
            <nav className="navbar navbar-expand-lg navbar-dark p-0" style={{ marginLeft: '-150px' }}>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="mainNavbar">
                <ul className="navbar-nav gap-4" style={{ fontSize: '18px' }}>
                  <li className="nav-item">
                    <NavLink to="/" className={({ isActive }) => `nav-link cool-link ${isActive ? "active" : ""}`}>Home</NavLink>
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
      <div className="modal fade" id="resetModal" tabIndex="-1" aria-hidden="true" ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered modal-sm mt-0">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-warning text-dark">
              <h5 className="modal-title"><i className="bi bi-key me-2"></i> Reset Password</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <input type="password" name="currentPassword" className="form-control bg-light" placeholder="Currenct password" value={resetPassword.currentPassword} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <input type="password" name="newPassword" className="form-control bg-light" placeholder="New password" value={resetPassword.newPassword} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <input type="password" name="confirmPassword" className="form-control bg-light" placeholder="Confirm password" value={resetPassword.confirmPassword} onChange={handleInputChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light w-100 fw-bold" style={{ background: "linear-gradient(90deg, #ff4b2b, #72545bff)" }} onClick={handleResetSubmit}>
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
