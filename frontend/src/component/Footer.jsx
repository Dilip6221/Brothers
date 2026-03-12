import React, { useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/footer.css";

const Footer = () => {
    const [email, setEmail] = useState("");
    useEffect(() => {
        // Tooltip setup
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            new bootstrap.Tooltip(tooltipTriggerEl, { html: true });
        });

        // BROTHER'S zoom animation setup
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const el = entry.target;
                    if (entry.isIntersecting) {
                        el.classList.add("animate");
                    } else {
                        el.classList.remove("animate");
                    }
                });
            },
            { threshold: 0.9 }
        );
        const brand = document.querySelector(".brand-zoom");
        if (brand) observer.observe(brand);
        return () => {
            if (brand) observer.unobserve(brand);
        };
    }, []);

    const handlerSubsciptionSub = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/subscribe/subscribe`, { email });
            if (res.data.success) {
                toast.success(res.data.message);
                setEmail('');
            } else {
                toast.error(res.data.message)
                setEmail('');
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <>
            <footer className="footer-section text-light pt-4 pb-3" >

                <div className="footer-top-border">
                    <div className="container" >
                        <div className="row gy-4">
                            <div className="col-lg-3 col-md-6 col-12 footer-brand-box">

                                {/* Brand */}
                                <h1 className="footer-brand">
                                    <span className="brand-red">B</span>ROTHER'S
                                </h1>
                                <div className="footer-line"></div>
                                <div className="footer-social">
                                    <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
                                    <a href="#" className="social-icon"><i className="bi bi-instagram"></i></a>
                                    <a href="#" className="social-icon"><i className="bi bi-youtube"></i></a>
                                    <a href="#" className="social-icon"><i className="bi bi-whatsapp"></i></a>
                                </div>

                                <p className="footer-slogan">
                                    <i className="bi bi-wrench-adjustable text-danger me-2"></i>
                                    At <span className="brand-highlight">BROTHER'S</span> we don’t just fix cars —
                                    <span className="trust-text"> we build trust.</span>
                                </p>

                                {/* Social Icons */}

                            </div>
                            {/* ===== Quick Links ===== */}
                            <div className="col-lg-3 col-md-6 col-12">
                                <h5 className="footer-title">
                                    <i className="bi bi-link-45deg text-danger"></i>
                                    Quick Links
                                </h5>
                                <div className="footer-line"></div>

                                <ul className="footer-links">
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/about">About Us</a></li>
                                    <li><a href="/services">Services</a></li>
                                    <li><a href="/blog">Blog</a></li>
                                    <li><a href="/gallery">Gallery</a></li>
                                    <li><a href="/contact-us">Contact Us</a></li>
                                    <li><a href="/faqs">Faqs</a></li>
                                </ul>
                            </div>

                            {/* ===== Services ===== */}
                            <div className="col-lg-3 col-md-6 col-12">
                                <h5 className="footer-title">
                                    <i className="bi bi-tools text-danger"></i>
                                    Our Services
                                </h5>
                                <div className="footer-line"></div>

                                <ul className="footer-links">
                                    <li><a href="/ppf">PPF Installation</a></li>
                                    <li><a href="/paint">Full Body Painting</a></li>
                                    <li><a href="/panel-paint">Panel Painting</a></li>
                                    <li><a href="/ceramic">Ceramic & Graphene Coating</a></li>
                                    <li><a href="/sound-damping">Sound Damping</a></li>
                                    <li><a href="/vinyl-wrap">Vinyl Wrap</a></li>
                                    <li><a href="/film">Safety Glazing Film</a></li>
                                    <li><a href="/sunroof-ppf">Sunroof Protection Film</a></li>
                                    <li><a href="/Miscellaneous">Alloy & Caliper Paint</a></li>
                                    <li><a href="/Miscellaneous">Detailing</a></li>
                                    <li><a href="/car-wash">Premium Car Wash</a></li>
                                    <li><a href="/car-wash">Tyre polish</a></li>
                                    <li><a href="/car-wash">Accessories</a></li>
                                    <li><a href="/interior-custmization">Interior Customization</a></li>
                                </ul>
                            </div>

                            {/* ===== Newsletter ===== */}
                            <div className="col-lg-3 col-md-6 col-12">
                                <h5 className="footer-title">
                                    <i className="bi bi-envelope-arrow-up-fill text-danger me-2"></i>
                                    Subscribe Newsletter
                                </h5>
                                <div className="footer-line"></div>

                                <p className="small">Get latest updates, offers & car care tips.</p>

                                <form onSubmit={handlerSubsciptionSub} className="newsletter-form">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button className="btn btn-danger">Subscribe</button>
                                </form>

                                {/* ===== Location Section ===== */}
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
                                        className="direction-btn"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Open in Google Maps"
                                    >
                                        <i className="bi bi-geo-alt-fill me-2"></i>
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="footer-bottom mt-4">
                            <div className="row align-items-center gy-3">
                                <div className="col-lg-4 col-md-12 text-center text-lg-start">
                                    <a className="footer-contact" href="mailto:beradilip39@gmail.com">
                                        <i className="bi bi-envelope me-1"></i> beradilip39@gmail.com
                                    </a>
                                    <a className="footer-contact ms-lg-3" href="tel:9313015917">
                                        <i className="bi bi-phone me-1"></i> 9313015917
                                    </a>
                                </div>

                                <div className="col-lg-4 col-md-12 text-center">
                                    Copyright © {new Date().getFullYear()}
                                    <span className="text-warning"> BROTHER'S </span>
                                    . All Rights Reserved.
                                </div>

                                <div className="col-lg-4 col-md-12 text-center text-lg-end">
                                    <a href="#" className="footer-policy">Terms & Conditions</a>
                                    <a href="#" className="footer-policy ms-3">Privacy Policy</a>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
