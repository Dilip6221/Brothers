import React from "react";
import { Link } from "react-router-dom";
import "../css/home.css";

const HomeCta = () => {
  return (
    <section className="home-cta-section">
      <div className="home-cta-overlay"></div>

      <div className="container position-relative">
        <div className="home-cta-content">
          <span className="cta-badge">
            Premium Car Care Experience
          </span>

          <h2>
            Ready To Transform <span>Your Car?</span>
          </h2>

          {/* <p>
            Give your vehicle the premium treatment it deserves with expert
            detailing, ceramic coating, graphene protection and luxury car care
            services.
          </p> */}

          <div className="home-cta-buttons">
            <Link to="/contact-us" className="cta-primary-btn">
              Book Consultation
              <i className="bi bi-arrow-right"></i>
            </Link>

            <a
              href="https://wa.me/919313015917"
              target="_blank"
              rel="noreferrer"
              className="cta-secondary-btn"
            >
              <i className="bi bi-whatsapp"></i>
              WhatsApp Us
            </a>
          </div>

          <div className="cta-mini-info">
            <div>
              <i className="bi bi-shield-check"></i>
              Premium Quality
            </div>

            <div>
              <i className="bi bi-lightning-charge"></i>
              Fast Service
            </div>

            <div>
              <i className="bi bi-star-fill"></i>
              Trusted Experts
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCta;