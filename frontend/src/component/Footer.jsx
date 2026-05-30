import React, { useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/footer.css";
import { NavLink } from "react-router-dom";
import loginLogo from "../assets/images/rydax.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [services, setServices] = useState([]);

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
      toast.error("Failed to load services");  
      console.error("Footer service fetch error:", error);
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);

  const handlerSubsciptionSub = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("subscribe/subscribe", { email });
      if (res.data.success) {
        toast.success(res.data.message);
        setEmail("");
      } else {
        toast.error(res.data.message);
        setEmail("");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Subscription error", error);
      setEmail("");
    }
  };

  return (
    <footer className="footer-section text-light pt-4 pb-3">
      <div className="footer-top-border">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6 col-12 footer-brand-box">
              <NavLink to="/">
                <img src={loginLogo} alt="Logo" className="footer-logo" />
              </NavLink>

              <div className="footer-social">
                <a href="#" className="social-icon">
                  <i className="bi bi-facebook"></i>
                </a>

                <a href="#" className="social-icon">
                  <i className="bi bi-instagram"></i>
                </a>

                <a href="#" className="social-icon">
                  <i className="bi bi-youtube"></i>
                </a>

                <a href="#" className="social-icon">
                  <i className="bi bi-whatsapp"></i>
                </a>
              </div>

              <p className="footer-slogan">
                <i className="bi bi-wrench-adjustable text-danger me-2"></i>
                At <span className="brand-highlight">RYDAX</span> we don’t just
                fix cars —
                <span className="trust-text"> we build trust.</span>
              </p>
            </div>

            <div className="col-lg-3 col-md-6 col-12">
              <h5 className="footer-title">
                <i className="bi bi-link-45deg text-danger"></i>
                Quick Links
              </h5>

              <div className="footer-line"></div>

              <ul className="footer-links">
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>

                <li>
                  <NavLink to="/about">About Us</NavLink>
                </li>

                <li>
                  <NavLink to="/services">Services</NavLink>
                </li>

                <li>
                  <NavLink to="/blog">Blog</NavLink>
                </li>

                <li>
                  <NavLink to="/gallery">Gallery</NavLink>
                </li>

                <li>
                  <NavLink to="/contact-us">Contact Us</NavLink>
                </li>

                <li>
                  <NavLink to="/faqs">Faqs</NavLink>
                </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 col-12">
              <h5 className="footer-title">
                <i className="bi bi-tools text-danger"></i>
                Our Services
              </h5>

              <div className="footer-line"></div>

              <ul className="footer-links">
                {services.length > 0 ? (
                  services.map((service) => (
                    <li key={service._id}>
                      <NavLink to={`/service/${service.slug}`}>
                        {service.title}
                      </NavLink>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="text-secondary">No services found</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 col-12">
              <h5 className="footer-title">
                <i className="bi bi-envelope-arrow-up-fill text-danger me-2"></i>
                Subscribe Newsletter
              </h5>

              <div className="footer-line"></div>

              <p className="small">Get latest updates, offers & car care tips.</p>

              <form
                onSubmit={handlerSubsciptionSub}
                className="newsletter-form"
              >
                <input
                  type="email"
                  className="form-control bg-black text-white border-secondary"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button className="btn btn-danger">Subscribe</button>
              </form>

              <div className="footer-location mt-4">
                <h5 className="footer-title">
                  <i className="bi bi-geo-alt text-danger me-2"></i>
                  Our Location
                </h5>

                <div className="footer-line"></div>

                <p className="location-text">
                  Veraval Nani, Lalpur <br />
                  Jamnagar, Gujarat – 361170
                </p>

                <a
                  href="https://www.google.com/maps?q=Navi+Veraval,+Gujarat,+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="direction-link"
                >
                  Get Directions
                  <i className="bi bi-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom mt-4">
            <div className="row align-items-center gy-3">
              <div className="col-lg-4 col-md-12 text-center text-lg-start">
                <a
                  className="footer-contact"
                  href="mailto:beradilip39@gmail.com"
                >
                  <i className="bi bi-envelope me-1"></i>
                  beradilip39@gmail.com
                </a>

                <a className="footer-contact ms-lg-3" href="tel:9313015917">
                  <i className="bi bi-phone me-1"></i>
                  9313015917
                </a>
              </div>

              <div className="col-lg-4 col-md-12 text-center">
                Copyright © {new Date().getFullYear()}
                <span className="text-warning"> RYDAX </span>. All Rights
                Reserved.
              </div>

              <div className="col-lg-4 col-md-12 text-center text-lg-end">
                <a href="#" className="footer-policy">
                  Terms & Conditions
                </a>

                <a href="#" className="footer-policy ms-3">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;