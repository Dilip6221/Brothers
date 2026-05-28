import React from "react";
import { Link } from "react-router-dom";
import "../css/home.css";

const HeroSection = () => {
  return (
    <section className="hero-luxury-section">
      <div className="hero-luxury-overlay"></div>

      <div className="hero-luxury-content">
        <span className="hero-trust-badge">
          Trusted by premium car owners
        </span>

        <h1>
          India’s Premium <span>Car Detailing</span> Studio
        </h1>

        <p>
          Experience professional ceramic coating, PPF, detailing and premium
          car care services with expert technicians.
        </p>

        <div className="hero-luxury-buttons">
          <Link to="/contact-us" className="hero-main-btn">
            Book Consultation
            <i className="bi bi-arrow-right"></i>
          </Link>

          <Link to="/services" className="hero-outline-btn">
            Explore Services
          </Link>
        </div>

        <div className="hero-luxury-stats">
          <div>
            <h3>10K+</h3>
            <p>Cars Serviced</p>
          </div>

          <div>
            <h3>5+</h3>
            <p>Years Experience</p>
          </div>

          <div>
            <h3>98%</h3>
            <p>Happy Customers</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;