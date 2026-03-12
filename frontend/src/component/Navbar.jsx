import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import loginLogo from "../assets/images/brand.png";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import * as bootstrap from "bootstrap";
import Select from "react-select";

const Navbar = () => {
  const { user, logout, token } = useContext(UserContext);

  const modalRef = useRef(null);
  const bsModalRef = useRef(null);
  const serviceModalRef = useRef(null);
  const bsServiceModalRef = useRef(null);
  const location = useLocation();

  // Common React Select Styles (Single + Multi)
  const reactSelectStyles = {
    control: (base, state) => ({
      ...base,
      background: "rgba(255,255,255,0.08)",
      border: state.isFocused
        ? "1px solid #0d6efd"
        : "1px solid rgba(255,255,255,0.2)",
      boxShadow: "none",
      minHeight: "44px",
      cursor: "pointer",
    }),

    singleValue: (base) => ({
      ...base,
      color: "white",
    }),

    menu: (base) => ({
      ...base,
      background: "#222",
      borderRadius: "6px",
    }),

    option: (base, state) => ({
      ...base,
      background: state.isFocused ? "#444" : "#222",
      color: "white",
      cursor: "pointer",
    }),

    placeholder: (base) => ({
      ...base,
      color: "#ccc",
    }),

    indicatorSeparator: () => ({ display: "none" }),

    dropdownIndicator: (base) => ({
      ...base,
      color: "#ccc",
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: "black",
    }),
  };

  const carBrandOptions = [
    { value: "Hyundai", label: "Hyundai" },
    { value: "BMW", label: "BMW" },
    { value: "Suzuki", label: "Suzuki" },
  ];

  const carModelOptions = [
    { value: "Creta", label: "Creta" },
    { value: "i20", label: "i20" },
  ];


  /* For Service and More Dropdowns */
  const ROUTE_GROUPS = {
    services: ["/ceramic", "/ppf", "/paint", "/detailing", "/premium-car-wash",],
    more: ["/blog", "/gallery", "/contact-us","/my-car-vault", "/faqs"],
  };
  const isRouteActive = (routes) => routes.some(route => location.pathname.startsWith(route));
  const isServiceActive = isRouteActive(ROUTE_GROUPS.services);
  const isMoreActive = isRouteActive(ROUTE_GROUPS.more);
  const SERVICE_MENU = [
    { to: "/ceramic", label: "Ceramic Coating" },
    { to: "/ppf", label: "Paint Protection Film" },
    { to: "/paint", label: "Full Body Painting" },
    { to: "/detailing", label: "Detailing (Interior / Exterior)" },
    { to: "/premium-car-wash", label: "Premium Car Wash" },
  ];
  const MORE_MENU = [
    ...(user ? [{ to: "/my-car-vault", label: "My Car Vault" }] : []),
    { to: "/blog", label: "Blog" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact-us", label: "Contact Us" },
    { to: "/faqs", label: "FAQS" },
  ];

  const MegaDropdown = ({ title, isActive, items }) => (
    <li className="nav-item mega-dropdown">
      <span className={`nav-link cool-link ${isActive ? "active" : ""}`}>
        {title}
      </span>
      <div className="mega-menu">
        <ul className="mega-list">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => `mega-item text-decoration-none ${isActive ? "active" : ""}`}>
                <span className="arrow">›</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );

  /* For Service and More Dropdowns */

  const [resetPassword, setResetPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [serviceEnquery, setServiceEnquery] = useState({
    name: user ? user.name : "",
    phone: user ? user.phone : "",
    email: user ? user.email : "",
    city: "",
    address: "",
    carBrand: "",
    carModel: "",
    services: [],
    notes: ""
  });
  useEffect(() => {
    if (user) {
      setServiceEnquery((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);
  const serviceOptions = [
    { value: "PPF", label: "PPF Installation" },
    { value: "PAINT", label: "Full Body Paint" },
    { value: "COTTING", label: "Ceramic Coating" },
  ];
  useEffect(() => {
    if (modalRef.current) {
      bsModalRef.current = new bootstrap.Modal(modalRef.current, {
        backdrop: true,
        keyboard: true,
      });
    }
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
  useEffect(() => {
    if (serviceModalRef.current) {
      bsServiceModalRef.current = new bootstrap.Modal(serviceModalRef.current, {
        backdrop: true,
        keyboard: true,
      });
    }
  }, []);

  const openServiceModal = () => {
    if (bsServiceModalRef.current) {
      setServiceEnquery({ name: user?.name || "", phone: user?.phone || "", email: user?.email || "", city: "", carBrand: "", carModel: "", services: [], address: "", notes: "" });
    }
    bsServiceModalRef.current.show();
  };
  const closeServiceModal = () => {
    if (bsServiceModalRef.current) {
      bsServiceModalRef.current.hide();
    }
  };

  const handleEnquiryInputChange = (e) => {
    const { name, value } = e.target;
    setServiceEnquery((prev) => ({ ...prev, [name]: value }));
  };
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/inquery/service-inquiry`, {
        name: serviceEnquery.name,
        phone: serviceEnquery.phone,
        email: serviceEnquery.email,
        city: serviceEnquery.city,
        address: serviceEnquery.address,
        carBrand: serviceEnquery.carBrand,
        carModel: serviceEnquery.carModel,
        services: serviceEnquery.services,
        notes: serviceEnquery.notes,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setServiceEnquery({ name: "", phone: "", email: "", city: "", carBrand: "", carModel: "", services: [], address: "", notes: "" });
        closeServiceModal();
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
                <a className="nav-link social-icons" href="https://x.com/DilipBe00479036" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-twitter-x"></i>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link social-icons" href="https://www.instagram.com/brotomotiv.in" target="_blank" rel="noreferrer">
                  <i className="bi bi-instagram"></i>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link social-icons" href="https://youtube.com/@dilipahir6221" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-youtube"></i>
                </a>
              </li>
              {user?.role === 'ADMIN' && (
                <li className="nav-item px-2">
                  <Link className="btn btn-outline-warning btn-sm px-3" to="/admin/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Admin
                  </Link>
                </li>
              )}
              {!user ? (
                <li className="nav-item px-2">
                  <Link className="btn btn-outline-warning btn-sm px-3 d-flex align-items-center" target="_blank" rel="noopener noreferrer" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </Link>
                </li>
              ) : (
                <li className="nav-item dropdown px-2">
                  <a href="#" className="btn btn-outline-warning btn-sm px-3 d-flex align-items-center" id="userDropdown" role="button" data-bs-display="static">
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
                    <NavLink to="/about" className={({ isActive }) => `nav-link cool-link ${isActive ? "active" : ""}`}>About</NavLink>
                  </li>
                  <MegaDropdown
                    title="Services"
                    isActive={isServiceActive}
                    items={SERVICE_MENU}
                  />
                  <MegaDropdown
                    title="More"
                    isActive={isMoreActive}
                    items={MORE_MENU}
                  />
                  <li className="nav-item px-5 mt-2">
                    <button
                      className="btn btn-warning btn-sm px-3 text-dark fw-semibold"
                      onClick={openServiceModal}
                    >
                      <i className="bi-tools me-1"></i> Service Enquiry
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
      {/* RESET PASSWORD MODAL */}
      <div
        className="modal fade"
        id="resetModal"
        tabIndex="-1"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered reset-modal">
          <div className="modal-content reset-modal-content">
            <form onSubmit={handleResetSubmit}>
              <div className="p-3 pb-1 border-0 reset-header">
                <h4 className="text-white d-flex m-0 reset-title">
                  <i className="bi bi-shield-check me-2"></i>
                  <span className="text-danger">R</span>eset Password
                </h4>
                <button
                  type="button"
                  className="btn-close position-absolute"
                  data-bs-dismiss="modal"
                />
              </div>

              <div className="modal-body p-3">
                <div className="mb-3">
                  <input
                    type="password"
                    name="currentPassword"
                    className="form-control reset-input"
                    placeholder="Current Password"
                    value={resetPassword.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control reset-input"
                    placeholder="New Password"
                    value={resetPassword.newPassword}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-2">
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control reset-input"
                    placeholder="Confirm Password"
                    value={resetPassword.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="p-3 pt-0">
                <button type="submit" className="w-100 btn btn-outline-danger">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="serviceEnquiryModal"
        tabIndex="-1"
        aria-hidden="true"
        ref={serviceModalRef}
      >
        <div className="modal-dialog modal-dialog-centered service-modal">
          <div className="modal-content service-modal-content">
            <form onSubmit={handleEnquirySubmit}>
              <div className="p-3 pb-1 border-0 reset-header">
                <h4 className="text-white d-flex m-0 reset-title">
                  <i className="bi-tools me-2 fs-4"></i>
                  <span className="text-danger">S</span>ervice Enquiry
                </h4>
                <button
                  type="button"
                  className="btn-close position-absolute"
                  data-bs-dismiss="modal"
                />
              </div>
              <div className="modal-body p-3">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      className="form-control service-input"
                      placeholder="Full Name*"
                      value={serviceEnquery.name}
                      onChange={handleEnquiryInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      name="phone"
                      className="form-control service-input"
                      placeholder="Phone Number*"
                      value={serviceEnquery.phone}
                      onChange={handleEnquiryInputChange}
                    />
                  </div>

                  <div className="col-12">
                    <input
                      type="email"
                      name="email"
                      className="form-control service-input"
                      placeholder="Email*"
                      value={serviceEnquery.email}
                      onChange={handleEnquiryInputChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      type="text"
                      name="city"
                      className="form-control service-input"
                      placeholder="City*"
                      value={serviceEnquery.city}
                      onChange={handleEnquiryInputChange}
                    />
                  </div>

                  <div className="col-md-8">
                    <input
                      type="text"
                      name="address"
                      className="form-control service-input"
                      placeholder="Address*"
                      value={serviceEnquery.address}
                      onChange={handleEnquiryInputChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <Select
                      options={carBrandOptions}
                      placeholder="Car Manufacturer*"
                      styles={reactSelectStyles}
                      value={carBrandOptions.find(
                        opt => opt.value === serviceEnquery.carBrand
                      )}
                      onChange={(selected) =>
                        setServiceEnquery(prev => ({
                          ...prev,
                          carBrand: selected ? selected.value : "",
                        }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <Select
                      options={carModelOptions}
                      placeholder="Model Name*"
                      styles={reactSelectStyles}
                      value={carModelOptions.find(
                        opt => opt.value === serviceEnquery.carModel
                      )}
                      onChange={(selected) =>
                        setServiceEnquery(prev => ({
                          ...prev,
                          carModel: selected ? selected.value : "",
                        }))
                      }
                    />
                  </div>


                  <div className="col-12">
                    <Select
                      isMulti
                      options={serviceOptions}
                      placeholder="Required Service*"
                      value={serviceOptions.filter(opt =>
                        serviceEnquery.services.includes(opt.value)
                      )}
                      onChange={(selected) =>
                        setServiceEnquery(prev => ({
                          ...prev,
                          services: selected ? selected.map(s => s.value) : [],
                        }))
                      }
                      styles={reactSelectStyles}
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      name="notes"
                      rows="2"
                      className="form-control service-input"
                      placeholder="Comments or Special Requirements"
                      value={serviceEnquery.notes}
                      onChange={handleEnquiryInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="p-3 pt-0 d-flex justify-content-end">
                <button type="submit" className="btn btn-outline-danger px-3">
                  Submit Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
