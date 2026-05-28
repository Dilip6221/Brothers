import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "../css/home.css";

const ServiceCard = () => {
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
      console.error("Fetch services error:", error);
      toast.error("Failed to load services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <section className="premium-service-section">
      <div className="services-heading text-center">
        <div className="section-top-title">
          <span></span>
          <p>What We Offer</p>
          <span></span>
        </div>

        <h2 className="services-title">
          Our <span>Services</span>
        </h2>

        <p className="services-subtitle">
          Professional car care services delivered by certified experts
        </p>
      </div>

      <div className="premium-service-grid">
        {services.map((service) => (
          <div className="premium-service-card" key={service._id}>
            <div className="service-img-box">
              <img
                src={service.image?.url}
                alt={service.title}
                className="premium-service-img"
              />
              <div className="service-img-overlay"></div>
            </div>

            <div className="premium-service-content">
              <h3>{service.title}</h3>

              <p className="service-short-desc">
                {service.shortDescription}
              </p>

              {service.cardFeatures?.length > 0 && (
                <ul className="service-feature-list">
                  {service.cardFeatures.slice(0, 3).map((feature, index) => (
                    <li key={index}>
                      <i className="bi bi-check-circle-fill"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <Link to={`/${service.slug}`} className="service-read-more">
                Read More <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceCard;