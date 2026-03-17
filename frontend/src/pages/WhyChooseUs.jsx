import React from "react";

const features = [
  {
    icon: "🚗",
    title: "Advanced Equipment",
    desc: "We use professional tools and modern technology to ensure safe and effective car cleaning.",
  },
  {
    icon: "👨‍🔧",
    title: "Expert Technicians",
    desc: "Our trained team handles every vehicle with precision and professional care.",
  },
  {
    icon: "🌱",
    title: "Eco Friendly Products",
    desc: "Safe and eco friendly cleaning solutions that protect your car and environment.",
  },
  {
    icon: "⚡",
    title: "Quick Service",
    desc: "Fast and efficient car service without compromising on quality.",
  },
  {
    icon: "💰",
    title: "Affordable Pricing",
    desc: "Premium quality service at competitive and transparent pricing.",
  },
  {
    icon: "⭐",
    title: "Customer Satisfaction",
    desc: "Our goal is to deliver the best car care experience every time.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="why-section">
      <div className="why-container">

        <div className="why-header">
          <h2>
            Why <span>Choose Us</span>
          </h2>
          <p>
            Professional car care with advanced equipment and experienced
            technicians delivering exceptional results.
          </p>
        </div>

        <div className="why-grid">
          {features.map((item, index) => (
            <div className="why-card" key={index}>
              <div className="why-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="why-stats">
          <div className="stat">
            <h3>10K+</h3>
            <p>Cars Serviced</p>
          </div>

          <div className="stat">
            <h3>5+</h3>
            <p>Years Experience</p>
          </div>

          <div className="stat">
            <h3>98%</h3>
            <p>Happy Customers</p>
          </div>

          <div className="stat">
            <h3>24/7</h3>
            <p>Support</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;