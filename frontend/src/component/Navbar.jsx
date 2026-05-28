import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import letsStartLogo from "../assets/images/loginimage.webp";
import loginLogo from "../assets/images/rydax.png";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { validateForm } from "../utils/formValidation.js";
import {otpValidationRules,completeProfileValidationRules} from "../utils/validationRules.js";

const Navbar = () => {
  const { user, logout, fetchUser } = useContext(UserContext);
  const location = useLocation();

  const intervalRef = useRef(null);
  const otpRefs = useRef([]);

  const mobileInputRefs = {
    mobile: useRef(null),
  };

  const completeProfileInputRefs = {
    name: useRef(null),
    email: useRef(null),
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const [services, setServices] = useState([]);

  const [mobileDropdown, setMobileDropdown] = useState({
    services: false,
    more: false,
  });

  const fetchServices = async () => {
  try {
    const res = await axios.get("service/admin/services");
    if (res.data.success) {
      const activeServices = res.data.data.filter(
        (item) => item.status === "ACTIVE"
      );
      setServices(activeServices);
    }
  } catch (error) {
    console.error("Navbar service fetch error:", error);
  }
};
useEffect(() => {
  fetchServices();
}, []);
  const MORE_MENU = [
    ...(user ? [{ to: "/my-car-vault", label: "My Car Vault" }] : []),
    { to: "/blog", label: "Blog" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact-us", label: "Contact Us" },
    { to: "/faqs", label: "FAQS" },
  ];

  const isRouteActive = (routes) =>
    routes.some((route) => location.pathname.startsWith(route));

  const isServiceActive = services.some((service) =>
  location.pathname.startsWith(`/${service.slug}`)
);

  const isMoreActive = isRouteActive([
    "/blog",
    "/gallery",
    "/contact-us",
    "/my-car-vault",
    "/faqs",
  ]);

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openLoginDrawer = () => {
    closeMobileMenu();

    setLoginStep("PHONE");
    setMobile("");
    setOtp(Array(6).fill(""));
    setShowLogin(true);

    setTimeout(() => {
      mobileInputRefs.mobile.current?.focus();
    }, 300);
  };

  const closeLoginDrawer = () => {
    setShowLogin(false);
    setLoginStep("PHONE");
    setMobile("");
    setOtp(Array(6).fill(""));
    setName("");
    setEmail("");
  };

  const toggleMobileMenu = (menu) => {
  setMobileDropdown((prev) => ({
    services: menu === "services" ? !prev.services : false,
    more: menu === "more" ? !prev.more : false,
  }));
};

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen || showLogin) {
      document.body.classList.add("menu-lock");
      document.documentElement.classList.add("menu-lock");
    } else {
      document.body.classList.remove("menu-lock");
      document.documentElement.classList.remove("menu-lock");
    }

    return () => {
      document.body.classList.remove("menu-lock");
      document.documentElement.classList.remove("menu-lock");
    };
  }, [isMobileMenuOpen, showLogin]);

  useEffect(() => {
    if (loginStep === "OTP") {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [loginStep]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);

    if (intervalRef.current) clearInterval(intervalRef.current);

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

  const sendOtp = async () => {
    const isValid = validateForm({
      values: { mobile },
      validationRules: otpValidationRules,
      inputRefs: mobileInputRefs,
    });
    if (!isValid) return;
    try {
      setLoading(true);
      const res = await axios.post("auth/send-otp", {
        phone: mobile,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setLoginStep("OTP");
        startTimer();
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpValue) => {
    try {
      setLoading(true);

      const finalOtp = otpValue || otp.join("");

      const res = await axios.post("auth/verify-otp", {
        phone: mobile,
        otp: finalOtp,
      });

      if (res.data.success) {
        if (res.data.isNewUser) {
          setLoginStep("PROFILE");
          setName("");
          setEmail("");
        } else {
          toast.success("Login successful");
          await fetchUser();
          closeLoginDrawer();
        }
      } else {
        toast.error(res.data.message || "OTP verification failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendCount >= 3) {
      toast.error("Maximum resend limit reached");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("auth/send-otp", {
        phone: mobile,
      });

      if (res.data.success) {
        toast.success("OTP resent");
        setResendCount((prev) => prev + 1);
        setOtp(Array(6).fill(""));
        startTimer();
      } else {
        toast.error(res.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error("Error resending OTP");
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async () => {
    const isValid = validateForm({
      values: { name, email },
      validationRules: completeProfileValidationRules,
      inputRefs: completeProfileInputRefs,
    });

    if (!isValid) return;

    try {
      setLoading(true);

      const res = await axios.post("auth/complete-profile", {
        phone: mobile,
        name,
        email,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        await fetchUser();
        closeLoginDrawer();
      } else {
        toast.error(res.data.message || "Failed to complete profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pasteData.length === 6) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
      verifyOtp(pasteData);
    }
  };
const MegaDropdown = ({title,isActive,items,mainLink = null}) => (
  <li className="nav-item mega-dropdown">
    {mainLink ? (
      <NavLink to={mainLink} className={`nav-link cool-link ${isActive ? "active" : ""}`}>
        {title}
      </NavLink>
    ) : (
      <span className={`nav-link cool-link ${isActive ? "active" : ""}`}>
        {title}
      </span>
    )}

    <div className="mega-menu">
      <ul className="mega-list">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `mega-item text-decoration-none ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="arrow">›</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  </li>
);
  return (
    <>
      <div className="navbar-wrapper fixed-top">
        <div className="container d-flex align-items-center justify-content-between">
          <NavLink to="/">
            <img src={loginLogo} alt="Logo" className="navbar-logo" />
          </NavLink>

          <button
            className="mobile-menu-btn d-lg-none"
            type="button"
            onClick={openMobileMenu}
          >
            <i className="bi bi-list"></i>
          </button>

          <nav className="navbar navbar-expand-lg navbar-dark p-0 d-none d-lg-flex">
            <ul className="navbar-nav align-items-center gap-4">
              <li>
                <NavLink to="/" className="nav-link cool-link">
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink to="/online-services" className="nav-link cool-link">
                  Online Services
                </NavLink>
              </li>

              <li>
                <NavLink to="/about" className="nav-link cool-link">
                  About
                </NavLink>
              </li>

              <MegaDropdown
                title="Services"
                mainLink="/services"
                isActive={isServiceActive}
                items={services.map((service) => ({
                  to: `/${service.slug}`,
                  label: service.title,
                }))}
              />

              <MegaDropdown title="More" isActive={isMoreActive} items={MORE_MENU} />

              {!user ? (
                <li>
                  <button
                    className="btn btn-outline-warning btn-sm fw-semibold px-3"
                    onClick={openLoginDrawer}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </button>
                </li>
              ) : (
                <li className="dropdown user-dropdown">
                  <button className="btn btn-outline-warning btn-sm px-3">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.name}
                  </button>

                  <div className="dropdown-menu-custom">
                    <div className="user-info">
                      <div className="avatar">{user.name?.charAt(0)}</div>
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
                        <i className="bi bi-speedometer2"></i>
                        Admin Dashboard
                      </Link>
                    )}

                    <button className="dropdown-item-custom">
                      <i className="bi bi-person"></i>
                      View Profile
                    </button>

                    <button className="dropdown-item-custom logout" onClick={logout}>
                      <i className="bi bi-box-arrow-right"></i>
                      Logout
                    </button>
                  </div>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      <div className={`mobile-offcanvas ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-offcanvas-header">
          <NavLink to="/" className="mobile-brand" onClick={closeMobileMenu}>
            <img src={loginLogo} alt="Logo" />
          </NavLink>

          <button
            type="button"
            className="mobile-close-btn"
            onClick={closeMobileMenu}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="mobile-offcanvas-body">
          <NavLink to="/" className="mobile-menu-link" onClick={closeMobileMenu}>
            <i className="bi bi-house-door"></i>
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/online-services"
            className="mobile-menu-link"
            onClick={closeMobileMenu}
          >
            <i className="bi bi-calendar-check"></i>
            <span>Online Services</span>
          </NavLink>

          <NavLink
            to="/about"
            className="mobile-menu-link"
            onClick={closeMobileMenu}
          >
            <i className="bi bi-info-circle"></i>
            <span>About</span>
          </NavLink>

          <button
            type="button"
            className="mobile-menu-link mobile-dropdown-btn"
            onClick={() => toggleMobileMenu("services")}
          >
            <span>
              <i className="bi bi-tools"></i>
              Services
            </span>
            <i
              className={`bi ${
                mobileDropdown.services ? "bi-chevron-up" : "bi-chevron-down"
              }`}
            ></i>
          </button>

          {mobileDropdown.services && (
            <div className="mobile-submenu-new">
              {services.map((service) => (
                <NavLink key={service._id} to={`/${service.slug}`} onClick={closeMobileMenu}>
                  {service.title}
                </NavLink>
              ))}
            </div>
          )}

          <button
            type="button"
            className="mobile-menu-link mobile-dropdown-btn"
            onClick={() => toggleMobileMenu("more")}
          >
            <span>
              <i className="bi bi-grid"></i>
              More
            </span>
            <i
              className={`bi ${
                mobileDropdown.more ? "bi-chevron-up" : "bi-chevron-down"
              }`}
            ></i>
          </button>

          {mobileDropdown.more && (
            <div className="mobile-submenu-new">
              {MORE_MENU.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={closeMobileMenu}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}

          <div className="mobile-menu-footer">
            {!user ? (
              <button className="mobile-login-btn" onClick={openLoginDrawer}>
                <i className="bi bi-box-arrow-in-right"></i>
                Login
              </button>
            ) : (
              <>
                <button className="mobile-user-btn">
                  <i className="bi bi-person-circle"></i>
                  {user.name}
                </button>

                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin/dashboard"
                    className="mobile-user-btn text-decoration-none"
                    onClick={closeMobileMenu}
                  >
                    <i className="bi bi-speedometer2"></i>
                    Admin Dashboard
                  </Link>
                )}

                <button
                  className="mobile-logout-btn"
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showLogin && <div className="login-overlay" onClick={closeLoginDrawer}></div>}

      <div className={`login-drawer ${showLogin ? "open" : ""}`}>
        <div className="drawer-content">
          <button className="close-btn" onClick={closeLoginDrawer}>
            ✕
          </button>
          <img src={letsStartLogo} alt="Logo" className="login-image" />
          <h4 className="login-title">Let’s get started</h4>
          {loginStep === "PHONE" && (
            <>
              <div className="mobile-input-wrapper">
                <span>+91</span>

                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  ref={mobileInputRefs.mobile}
                />
              </div>

              <button className="garage-btn" onClick={sendOtp} disabled={loading}>
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
                    inputMode="numeric"
                    maxLength="1"
                    className="otp-box"
                    value={digit}
                    ref={(el) => (otpRefs.current[index] = el)}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onPaste={handleOtpPaste}
                  />
                ))}
              </div>

              <button
                className="garage-btn"
                onClick={() => verifyOtp()}
                disabled={loading}
              >
                {loading ? "Verifying..." : "VERIFY OTP"}
              </button>

              <div style={{ textAlign: "center", marginTop: "10px" }}>
                {!canResend ? (
                  <p style={{ color: "#aaa" }}>Resend OTP in {timer}s</p>
                ) : resendCount < 3 ? (
                  <button
                    onClick={resendOtp}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff5107",
                      cursor: "pointer",
                    }}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p style={{ color: "red" }}>Max resend limit reached</p>
                )}
              </div>
            </>
          )}

          {loginStep === "PROFILE" && (
            <>
              <input
                type="text"
                className="profile-input"
                placeholder="Enter Name*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                ref={completeProfileInputRefs.name}
              />
              <input
                type="email"
                className="profile-input"
                placeholder="Enter Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={completeProfileInputRefs.email}
              />

              <button
                className="garage-btn"
                onClick={completeProfile}
                disabled={loading}
              >
                {loading ? "Saving..." : "COMPLETE PROFILE"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
