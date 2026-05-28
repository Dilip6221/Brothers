import React from "react";
import "../css/home.css";

const features = [
  {
    icon: "bi bi-car-front-fill",
    title: "Advanced Equipment",
    desc: "Professional tools and modern technology for safe, deep and premium car cleaning.",
  },
  {
    icon: "bi bi-person-gear",
    title: "Expert Technicians",
    desc: "Trained specialists handle every vehicle with precision, care and detailing expertise.",
  },
  {
    icon: "bi bi-leaf-fill",
    title: "Eco Friendly Products",
    desc: "Safe cleaning solutions that protect your car finish and the environment.",
  },
  {
    icon: "bi bi-lightning-charge-fill",
    title: "Quick Service",
    desc: "Fast and efficient service without compromising premium quality standards.",
  },
  {
    icon: "bi bi-wallet2",
    title: "Transparent Pricing",
    desc: "Premium car care packages with honest, competitive and clear pricing.",
  },
  {
    icon: "bi bi-star-fill",
    title: "Customer Satisfaction",
    desc: "We focus on delivering a smooth, reliable and satisfying experience every time.",
  },
];

const stats = [
  { value: "10K+", label: "Cars Serviced" },
  { value: "5+", label: "Years Experience" },
  { value: "98%", label: "Happy Customers" },
  { value: "24/7", label: "Support" },
];

const WhyChooseUs = () => {
  return (
    <section className="why-premium-section">
      <div className="why-premium-container">
        <div className="services-heading text-center">
          <div className="section-top-title">
            <span></span>
            <p>Why Choose Us</p>
            <span></span>
          </div>

          <h2 className="services-title">
            Premium <span>Car Care</span>
          </h2>

          <p className="services-subtitle">
            Professional detailing, advanced equipment and expert technicians
            delivering showroom-level results.
          </p>
        </div>

        <div className="why-premium-grid">
          {features.map((item, index) => (
            <div className="why-premium-card" key={index}>
              <div className="why-premium-icon">
                <i className={item.icon}></i>
              </div>

              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="why-premium-stats">
          {stats.map((item, index) => (
            <div className="why-stat-card" key={index}>
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;