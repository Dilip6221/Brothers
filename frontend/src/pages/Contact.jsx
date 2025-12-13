import React from "react";
import "../css/contact.css";

const Contact = () => {
    return (
        <div className="contact-section">
            {/* Header */}
            <div className="carbon-fiber py-5 mb-5">
                <div className="container text-center">
                    <h3 className="section-title section-title-large">
                        <span className="first-letter">C</span>ontact Us
                    </h3>
                </div>
            </div>

            {/* Contact Info + Form */}
            <div className="contact-container">
                {/* Contact Info */}
                <div className="contact-info">
                    <a
                        href="https://www.google.com/maps?q=Navi+Veraval,+Gujarat,+India"
                        target="_blank"
                        className="info-item"
                    >
                        <div className="info-icon">📍</div>
                        <div className="info-text">
                            <h4>Location</h4>
                            <p>Veraval Nani, Jamnagar</p>
                        </div>
                    </a>

                    <a href="mailto:beradilip39@gmail.com" className="info-item">
                        <div className="info-icon">📧</div>
                        <div className="info-text">
                            <h4>Email</h4>
                            <p>beradilip39@gmail.com</p>
                        </div>
                    </a>

                    <a href="tel:919313015917" className="info-item">
                        <div className="info-icon">📱</div>
                        <div className="info-text">
                            <h4>Phone</h4>
                            <p>+91 9313015917</p>
                        </div>
                    </a>

                    <a href="https://calendly.com" target="_blank" className="info-item">
                        <div className="info-icon">📅</div>
                        <div className="info-text">
                            <h4>Schedule Meeting</h4>
                            <p>Book a consultation</p>
                        </div>
                    </a>
                </div>

                {/* Contact Form */}
                <form className="contact-form" id="contactForm">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" name="subject" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" required></textarea>
                    </div>

                    <button type="submit" className="submit-btn">
                        Transmit Message
                    </button>
                </form>
            </div>

            {/* Google Map */}
            <div className="map-container mt-5">
                <iframe
                    title="map"
                    src="https://www.google.com/maps?q=Navi+Veraval,+Gujarat,+India&output=embed"
                    style={{ border: 0, width: "100%", height: "400px", borderRadius: "20px" }}
                    loading="lazy"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default Contact;
