import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import letsStartLogo from "../assets/images/loginimage.webp";
import loginLogo from "../assets/images/brand.png";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import * as bootstrap from "bootstrap";
import Select from "react-select";

const Navbar = () => {
  const { user, logout, token, fetchUser } = useContext(UserContext);
  const [carBrandOptions, setCarBrandOptions] = useState([]);
  const [carModelOptions, setCarModelOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  const [loginStep, setLoginStep] = useState("PHONE");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const intervalRef = useRef(null);
  const otpRefs = useRef([]);

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
    if (newOtp.length === 6 && !newOtp.includes("")) {
      verifyOtp(newOtp.join(""));
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };
  const sendOtp = async () => { //send otp to user phone number
    if (!mobile || mobile.length !== 10) {
      return toast.error("Enter valid mobile number");
    }
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/send-otp`, {
        phone: mobile
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setLoginStep("OTP");
        startTimer();
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP Error:", err);
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };
  const handlePaste = (e) => { // Otp copy paste handler
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasteData.length === 6) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      const inputs = e.target.parentNode.querySelectorAll("input");
      inputs[5].focus();
      verifyOtp(pasteData);
    }
  };

  useEffect(() => {  // Auto focus first OTP input when step changes to OTP
  if (loginStep === "OTP") {
    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 100);
  }
}, [loginStep]);

  const resendOtp = async () => { // Resend OTP handler with limit of 3 times
    if (resendCount >= 3) {
      return toast.error("Maximum resend limit reached");
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/send-otp`,
        { phone: mobile }
      );
      if (res.data.success) {
        toast.success("OTP resent");
        setResendCount(prev => prev + 1);
        setCanResend(false);
        startTimer();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Error resending OTP");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { // Cleanup timer on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const verifyOtp = async (otpValue) => { // Verify OTP handler for both manual input and paste
    try {
      setLoading(true);
      const finalOtp = otpValue || otp.join("");
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-otp`, { phone: mobile,  otp: finalOtp });
      if (res.data.success) {
        if (res.data.isNewUser) {
          setLoginStep("PROFILE");
        } else {
          toast.success("Login successful");
          await fetchUser();
          setShowLogin(false);
          setLoginStep("PHONE");
          setMobile("");
          setOtp(Array(6).fill(""));
        }
      } else {
        toast.error(res.data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async () => { // Complete profile handler for new users after OTP verification
    if (!name || !email) {
      return toast.error("Please enter name and email");
    }
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/complete-profile`, { phone: mobile, name, email });
      if (res.data.success) {
        toast.success(res.data.message);
        await fetchUser();
        setShowLogin(false);
        setLoginStep("PHONE");
        setMobile("");
        setOtp(Array(6).fill(""));
      }
    } catch (err) {
      console.error("Complete Profile Error:", err);
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

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
      console.error("Password Reset Error:", error);
      toast.error("Something went wrong. Please try again.");
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
  const handleEnquirySubmit = async (e) => { // Submit service enquiry form
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
                <NavLink to="/online-services" className="nav-link cool-link">Online Services</NavLink>
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
                  {/* <Link
                    to="/login"
                    className="btn btn-outline-warning btn-sm fw-semibold px-3"
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </Link> */}
                  <button
                    className="btn btn-outline-warning btn-sm fw-semibold px-3"
                    onClick={() => {
                      setShowLogin(true);
                      setLoginStep("PHONE");
                      setMobile("");
                      setOtp(Array(6).fill(""));
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </button>
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

                    {/* <button
                      className="dropdown-item-custom"
                      onClick={openModal}
                    >
                      <i className="bi bi-key"></i> Reset Password
                    </button> */}

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
                // <li className="nav-item mt-2">
                //   <Link to="/login" className="btn btn-outline-warning w-100">
                //     Login
                //   </Link>
                // </li>
                <button
                  className="btn btn-outline-warning w-100"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
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
      {/* <div
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
      </div> */}
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
                      maxMenuHeight={180}
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
                      maxMenuHeight={180}
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
                      maxMenuHeight={180}
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
      {showLogin && (
        <div className="login-overlay" onClick={() => setShowLogin(false)}></div>
      )}
      <div className={`login-drawer ${showLogin ? "open" : ""}`}>
        <div className="drawer-content">
          <button
            className="close-btn"
            onClick={() => setShowLogin(false)}
          >
            ✕
          </button>
          <img src={letsStartLogo} alt="Logo" className="login-image" />
          <h4 className="login-title">Let’s get started</h4>
          {loginStep === "PHONE" && (
            <>
              <div className="mobile-input-wrapper">
                <span>+91</span>
                <input
                  type="number"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <button
                className="cont-btn w-100"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? "Sending..." : "CONTINUE"}
              </button>
            </>
          )}
          {loginStep === "OTP" && (
            <>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-box"
                    value={digit}
                    ref={(el) => (otpRefs.current[index] = el)} 
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                  />
                ))}
              </div>
              <button
                className="cont-btn w-100"
                onClick={verifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "VERIFY OTP"}
              </button>
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                {!canResend ? (
                  <p style={{ color: "#aaa" }}>
                    Resend OTP in {timer}s
                  </p>
                ) : resendCount < 3 ? (
                  <button
                    onClick={resendOtp}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ffc107",
                      cursor: "pointer"
                    }}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p style={{ color: "red" }}>
                    Max resend limit reached
                  </p>
                )}
              </div>
            </>
          )}
          {loginStep === "PROFILE" && (
            <>
              <input
                type="text"
                className="profile-input"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className="profile-input"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="cont-btn w-100"
                onClick={completeProfile}
              >
                COMPLETE PROFILE
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
