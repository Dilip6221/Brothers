import React, { useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/footer.css";
import { NavLink } from "react-router-dom";

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
                                    <li><NavLink to="/">Home</NavLink></li>
                                    <li><NavLink to="/about">About Us</NavLink></li>
                                    <li><NavLink to="/services">Services</NavLink></li>
                                    <li><NavLink to="/blog">Blog</NavLink></li>
                                    <li><NavLink to="/gallery">Gallery</NavLink></li>
                                    <li><NavLink to="/contact-us">Contact Us</NavLink></li>
                                    <li><NavLink to="/faqs">Faqs</NavLink></li>
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
                                    <li><NavLink to="/ppf">PPF Installation</NavLink></li>
                                    <li><NavLink to="/paint">Full Body Painting</NavLink></li>
                                    <li><NavLink to="/panel-paint">Panel Painting</NavLink></li>
                                    <li><NavLink to="/ceramic">Ceramic & Graphene Coating</NavLink></li>
                                    <li><NavLink to="/sound-damping">Sound Damping</NavLink></li>
                                    <li><NavLink to="/vinyl-wrap">Vinyl Wrap</NavLink></li>
                                    <li><NavLink to="/film">Safety Glazing Film</NavLink></li>
                                    <li><NavLink to="/sunroof-ppf">Sunroof Protection Film</NavLink></li>
                                    <li><NavLink to="/Miscellaneous">Alloy & Caliper Paint</NavLink></li>
                                    <li><NavLink to="/Miscellaneous">Detailing</NavLink></li>
                                    <li><NavLink to="/car-wash">Premium Car Wash</NavLink></li>
                                    <li><NavLink to="/car-wash">Tyre polish</NavLink></li>
                                    <li><NavLink to="/car-wash">Accessories</NavLink></li>
                                    <li><NavLink to="/interior-custmization">Interior Customization</ NavLink></li>
                                </ul>
                            </div>
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
