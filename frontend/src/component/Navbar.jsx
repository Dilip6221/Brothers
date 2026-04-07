import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import loginLogo from "../assets/images/brand.png";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import * as bootstrap from "bootstrap";
import Select from "react-select";
// import "../css/header.css";

const Navbar = () => {
  const { user, logout, token } = useContext(UserContext);
  const [carBrandOptions, setCarBrandOptions] = useState([]);
  const [carModelOptions, setCarModelOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);

  const modalRef = useRef(null);
  const bsModalRef = useRef(null);
  const serviceModalRef = useRef(null);
  const bsServiceModalRef = useRef(null);
  const location = useLocation();
  const offcanvasRef = useRef(null);
  const bsOffcanvasRef = useRef(null);
  const [mobileDropdown, setMobileDropdown] = useState({
    services: false,
    more: false,
  });
  const toggleMobileMenu = (menu) => {
    setMobileDropdown((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  useEffect(() => {
    if (offcanvasRef.current) {
      bsOffcanvasRef.current = new bootstrap.Offcanvas(offcanvasRef.current);
    }
  }, []);
  useEffect(() => {
    if (bsOffcanvasRef.current) {
      bsOffcanvasRef.current.hide();
    }
  }, [location.pathname]);
  // Common React Select Styles (Single + Multi)
  const reactSelectStyles = {
    control: (base, state) => ({
      ...base,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.2)",
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": {
        border: "1px solid rgba(255,255,255,0.2)",
      }
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
      backgroundColor: state.isSelected
        ? "#254c87"
        : state.isFocused
          ? "#444"
          : "#222",
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

  /* For Service and More Dropdowns */
  const ROUTE_GROUPS = {
    services: ["/ceramic", "/ppf", "/paint", "/detailing", "/premium-car-wash",],
    more: ["/blog", "/gallery", "/contact-us", "/my-car-vault", "/faqs"],
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
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/car-companies/companies`);
        const options = res.data.data.map(c => ({
          value: c._id,
          label: c.name
        }));
        setCarBrandOptions(options);
      } catch (err) {
        console.error("Frontend Error Fetching Companies:", err);
        toast.error(err.message || "Failed to load car companies");
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/service/admin/services`);
        const options = res.data.data.map(c => ({
          value: c.title,
          label: c.title
        }));
        setServiceOptions(options);
      } catch (err) {
        console.error("Frontend Error Fetching Services:", err);
        toast.error(err.message || "Failed to load services");
      }
    };
    fetchServices();
  }, []);

  const handleBrandChange = async (selected) => {
    const companyId = selected?.value || "";
    setServiceEnquery(prev => ({
      ...prev,
      carBrand: selected?.label || "",
      carModel: ""
    }));
    setCarModelOptions([]);
    if (!companyId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/car-companies/${companyId}/car-models`);
      const options = res.data.data.map(m => ({
        value: m.name,
        label: m.name
      }));
      setCarModelOptions(options);
    } catch (err) {
      console.error("Frontend Error Fetching Models:", err);
      toast.error(err.message || "Failed to load car models");
    }
  };

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
      <div className="navbar-wrapper fixed-top">
        <div className="container d-flex align-items-center justify-content-between">
          <a href="/" className="navbar-brand">
            <img src={loginLogo} alt="Logo" className="navbar-logo" />
          </a>
          <button
            className="mobile-menu-btn d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
          >
            <i className="bi bi-list"></i>
          </button>

          <nav className="navbar navbar-expand-lg navbar-dark p-0 d-none d-lg-flex">
            <ul className="navbar-nav align-items-center gap-4">
              <li className="nav-item">
                <NavLink to="/" className="nav-link cool-link">Home</NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/about" className="nav-link cool-link">About</NavLink>
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
              <li className="nav-item ms-4">
                <button
                  className="btn btn-warning btn-sm px-3 text-dark fw-semibold"
                  onClick={openServiceModal}
                >
                  <i className="bi-tools me-1"></i> Service Enquiry
                </button>
              </li>
              {!user ? (
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn btn-outline-warning btn-sm fw-semibold px-3"
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </Link>
                </li>
              ) : (
                <li className="nav-item dropdown user-dropdown">
                  <button className="btn btn-outline-warning btn-sm px-3">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.name}
                  </button>

                  <div className="dropdown-menu-custom">

                    <div className="user-info">
                      <div className="avatar">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h6>{user.name}</h6>
                        <small>{user.email}</small>
                      </div>
                    </div>
                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin/dashboard"
                        className="dropdown-item-custom text-decoration-none"
                      >
                        <i className="bi bi-speedometer2"></i> Admin Dashboard
                      </Link>
                    )}
                    <button className="dropdown-item-custom">
                      <i className="bi bi-person"></i> View Profile
                    </button>

                    <button
                      className="dropdown-item-custom"
                      onClick={openModal}
                    >
                      <i className="bi bi-key"></i> Reset Password
                    </button>

                    <button
                      className="dropdown-item-custom logout"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>

                  </div>
                </li>
              )}
            </ul>
          </nav>
        </div>
        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabIndex="-1"
          id="mobileMenu"
          ref={offcanvasRef}
        >
          <div className="offcanvas-header">
            {/* <h5>Menu</h5> */}
             <a href="/" >
              <img src={loginLogo} alt="Logo" className="mobile-navbar-logo" />
            </a>
            <button type="button" className="btn-close mb-5 btn-close-white" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/about" className="nav-link">
                  About
                </NavLink>
              </li>

              {/* SERVICES DROPDOWN */}
              <li className="nav-item">
                <div
                  className="nav-link d-flex justify-content-between align-items-center"
                  onClick={() => toggleMobileMenu("services")}
                >
                  Services
                  <i className={`bi ${mobileDropdown.services ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                </div>
                {mobileDropdown.services && (
                  <ul className="mobile-submenu">
                    {SERVICE_MENU.map((item) => (
                      <li key={item.to}>
                        <NavLink to={item.to} className="nav-link ps-4">
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li className="nav-item">
                <div
                  className="nav-link d-flex justify-content-between align-items-center"
                  onClick={() => toggleMobileMenu("more")}
                >
                  More
                  <i className={`bi ${mobileDropdown.more ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                </div>

                {mobileDropdown.more && (
                  <ul className="mobile-submenu">
                    {MORE_MENU.map((item) => (
                      <li key={item.to}>
                        <NavLink to={item.to} className="nav-link ps-4">
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li className="nav-item mt-3">
                <button className="btn btn-warning w-100" onClick={openServiceModal}>
                  Service Enquiry
                </button>
              </li>

              {!user ? (
                <li className="nav-item mt-2">
                  <Link to="/login" className="btn btn-outline-warning w-100">
                    Login
                  </Link>
                </li>
              ) : (
                <>
                  <li className="nav-item mt-2">
                    <button className="btn btn-outline-warning w-100">
                      {user.name}
                    </button>
                  </li>

                  <li className="nav-item mt-2">
                    <button className="btn btn-outline-danger w-100" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
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
                <h3 className="text-white d-flex m-0 reset-title align-items-center">
                  <i className="bi-tools me-2 fs-4"></i>
                  <span className="text-danger">S</span>ervice Enquiry
                </h3>
                <button
                  type="button"
                  className="btn-close position-absolute"
                  data-bs-dismiss="modal"
                />
              </div>
              <div className="modal-body p-3">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" name="name" className="form-control service-input shadow-none text-white"
                      placeholder="Full Name*"
                      autoComplete="off"
                      value={serviceEnquery.name}
                      onChange={handleEnquiryInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      name="phone"
                      className="form-control service-input shadow-none text-white"
                      placeholder="Phone Number*"
                      value={serviceEnquery.phone}
                      onChange={handleEnquiryInputChange}
                    />
                  </div>

                  <div className="col-12">
                    <input
                      type="email"
                      name="email"
                      className="form-control service-input shadow-none text-white"
                      placeholder="Email*"
                      value={serviceEnquery.email}
                      onChange={handleEnquiryInputChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      type="text"
                      name="city"
                      className="form-control service-input shadow-none text-white"
                      placeholder="City*"
                      value={serviceEnquery.city}
                      onChange={handleEnquiryInputChange}
                    />
                  </div>

                  <div className="col-md-8">
                    <input
                      type="text"
                      name="address"
                      className="form-control service-input shadow-none text-white"
                      placeholder="Address"
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
                      onChange={handleBrandChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <Select
                      options={carModelOptions}
                      key={serviceEnquery.carBrand}
                      placeholder="Car Model*"
                      styles={reactSelectStyles}
                      value={carModelOptions.find(
                        opt => opt.value === serviceEnquery.carModel
                      )}
                      onChange={(selected) =>
                        handleEnquiryInputChange({
                          target: {
                            name: "carModel",
                            value: selected ? selected.value : ""
                          }
                        })
                      }
                    />
                  </div>
                  <div className="col-md-12">
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
                      className="form-control service-input shadow-none text-white"
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
