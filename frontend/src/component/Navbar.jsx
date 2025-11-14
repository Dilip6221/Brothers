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
                <a className="btn btn-outline-warning btn-sm px-3" href="#contact_dummy">
                  <i className="bi bi-people-fill me-1"></i> Partner
                </a>
              </li>
              {!user ? (
                <li className="nav-item px-2">
                  <Link className="btn btn-warning btn-sm px-3 text-dark fw-semibold" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </Link>
                </li>
              ) : (
                <li className="nav-item dropdown px-2">
                  <a
                    href="#"
                    className="btn btn-outline-warning btn-sm px-3 d-flex align-items-center"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle me-1"></i> {user.name}
                  </a>
                  <ul
                    className="dropdown-menu border-0 rounded-2 shadow-lg"
                    style={{
                      outline: "1px solid red",
                      minWidth: "220px",
                      marginTop: "0px",
                      background: "#000000",
                      color: "#ffffff",

                    }}
                  >
                    {/* User Info */}
                    <li className="px-3 py-2 border-bottom" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-warning text-dark fw-bold d-flex justify-content-center align-items-center me-2"
                          style={{ width: "35px", height: "35px" }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">{user.name}</h6>
                          <small className="text-secondary">{user.email}</small>
                        </div>
                      </div>
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center py-2"
                        style={{
                          color: "#ffffff",
                          background: "transparent",
                        }}
                      >
                        <i className="bi bi-person me-2 text-primary"></i>
                        View Profile
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={openModal}
                        className="dropdown-item d-flex align-items-center py-2"
                        style={{
                          color: "#ffffff",
                          background: "transparent",
                        }}
                      >
                        <i className="bi bi-key me-2 text-warning"></i>
                        Reset Password
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={logout}
                        className="dropdown-item d-flex align-items-center py-2"
                        style={{
                          color: "#ff4c4c",
                          background: "transparent",
                        }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
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
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "330px" }}>
          <div
            className="modal-content border-0 p-0"
            style={{
              backdropFilter: "blur(20px)",
              background: "rgba(79, 62, 62, 0.15)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 0 25px rgba(0,0,0,0.25)",
            }}
          >
            {/* FORM START */}
            <form onSubmit={handleResetSubmit}>
              <div
                className="p-3 pb-1 border-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
              >
                <h5 className="text-white fw-bold d-flex align-items-center m-0">
                  <i className="bi bi-shield-check me-2 text-warning fs-4"></i>
                  Reset Password
                </h5>

                <button
                  type="button"
                  className="btn-close position-absolute"
                  data-bs-dismiss="modal"
                  style={{ right: "12px", top: "12px", filter: "invert(1)" }}
                ></button>
              </div>

              <div className="modal-body p-3">
                <div className="mb-3">
                  <input
                    type="password"
                    name="currentPassword"
                    className="form-control shadow-none text-white"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "10px",
                    }}
                    placeholder="Current Password"
                    value={resetPassword.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control shadow-none text-white"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "10px",
                    }}
                    placeholder="New Password"
                    value={resetPassword.newPassword}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-2">
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control shadow-none text-white"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "10px",
                    }}
                    placeholder="Confirm Password"
                    value={resetPassword.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="p-3 pt-0">
                <button
                  type="submit"   // VERY IMPORTANT
                  className="w-100 fw-bold py-2 border-0"
                  style={{
                    background: "rgba(53, 31, 31, 0.08)",
                    borderRadius: "12px",
                    color: "#e6e0e0ff",
                    marginTop: "4px",
                    boxShadow: "0 0 10px rgba(6, 0, 2, 1)",
                  }}
                >
                  Change Password
                </button>
              </div>
            </form>
            {/* FORM END */}

          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
