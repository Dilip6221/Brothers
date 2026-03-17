import React from "react";

const WhatsappButton = () => {

  const phoneNumber = "919313015917";
  const message = "Hi, I want to know about your car services and how to book an appointment.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      title="Chat on WhatsApp"
    >
      <i className="bi bi-whatsapp"></i>
      <span className="whatsapp-text">Hi, how can I help?</span>
    </a>
  );
};

export default WhatsappButton;