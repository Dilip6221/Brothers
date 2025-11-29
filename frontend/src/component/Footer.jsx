import React, { useEffect, useState } from "react";
import logo from "../assets/images/brand.png";
import * as bootstrap from "bootstrap";
import axios from "axios";
import toast from "react-hot-toast";

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
        <footer className="bg-black text-light pt-5 pb-3 ">
            <div className="container">
                <div className="row gy-4">
                    {/* ====== Logo + Location ====== */}
                    <div className="col-md-3">
                        <a href="/">
                            <img src={logo} alt="Logo" className="mb-3" style={{ width: "140px" }} />
                        </a>
                        <div className="col-md-12 px-0 text-center">
                            <a
                                href="https://www.google.com/maps?q=Navi+Veraval,+Gujarat,+India"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none d-block"
                            >
                                <div
                                    className="position-relative w-100 d-flex justify-content-center"
                                    style={{ marginLeft: "-85px", marginTop: "-30px" }}
                                >
                                    <span
                                        className="d-inline-flex align-items-center border border-danger rounded-pill px-3 py-2 text-light fw-bold"
                                        style={{
                                            fontSize: "16px",
                                            letterSpacing: "0.5px",
                                            cursor: "pointer",
                                        }}
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title='<i class="bi bi-geo-alt-fill text-danger"></i> Navi Veraval, Gujarat, India'
                                    >
                                        <i className="bi bi-geo-alt-fill me-2"></i> BROTHER'S STUDIO
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* ====== Quick Links ====== */}
                    <div className="col-md-3">
                        <h5 className="mb-3 text-uppercase fw-bold d-flex align-items-center gap-2" style={{ color: "#f8f9fa", letterSpacing: "1px", fontFamily: "'Poppins', sans-serif" }}>
                            <i className="bi bi-link-45deg text-danger" style={{ fontSize: "20px", filter: "drop-shadow(0 0 4px rgba(225,6,0,0.5))" }}></i>
                            Quick Links
                        </h5>
                        <div
                            style={{ height: "3px", width: "80px", background: "linear-gradient(90deg, #e10600, #ff4d00)", borderRadius: "2px", marginTop: "-5px", marginBottom: "10px" }}
                        ></div>
                        <ul className="list-unstyled small">
                            <li><a href="/" className="nav-link social-icon mb-2">Home</a></li>
                            <li><a href="/about" className="nav-link social-icon mb-2">About Us</a></li>
                            <li><a href="/services" className="nav-link social-icon mb-2">Services</a></li>
                            <li><a href="/gallery" className="nav-link social-icon mb-2">Gallery</a></li>
                            <li><a href="/blog" className="nav-link social-icon mb-2">Blog</a></li>
                            <li><a href="/contact" className="nav-link social-icon mb-2">Contact</a></li>
                        </ul>
                    </div>

                    {/* ====== Services ====== */}
                    <div className="col-md-3">
                        <h5 className="mb-3 text-uppercase fw-bold d-flex align-items-center gap-2" style={{ color: "#f8f9fa", letterSpacing: "1px", fontFamily: "'Poppins', sans-serif" }}>
                            <i className="bi bi-tools text-danger" style={{ fontSize: "20px", filter: "drop-shadow(0 0 4px rgba(225,6,0,0.5))" }}></i>
                            Our Services
                        </h5>
                        <div
                            style={{ height: "3px", width: "80px", background: "linear-gradient(90deg, #e10600, #ff4d00)", borderRadius: "2px", marginTop: "-5px", marginBottom: "10px" }}
                        ></div>

                        <ul className="list-unstyled small">
                            <li><a href="/ppf" className="nav-link social-icon mb-2">PPF Installation</a></li>
                            <li><a href="/ceramic" className="nav-link social-icon mb-2">Ceramic & Graphene Coating</a></li>
                            <li><a href="/paint" className="nav-link social-icon mb-2">Full Body Painting</a></li>
                            <li><a href="/panel-paint" className="nav-link social-icon mb-2">Panel Painting</a></li>
                            <li><a href="/sound-damping" className="nav-link social-icon mb-2">Sound Damping</a></li>
                            <li><a href="/vinyl-wrap" className="nav-link social-icon mb-2">Vinyl Wrap</a></li>
                            <li><a href="/film" className="nav-link social-icon mb-2">Safety Glazing Film</a></li>
                            <li><a href="/sunroof-ppf" className="nav-link social-icon mb-2">Sunroof Protection Film</a></li>
                            <li><a href="/Miscellaneous" className="nav-link social-icon mb-2">Car Wrap</a></li>
                            <li><a href="/Miscellaneous" className="nav-link social-icon mb-2">Alloy & Caliper Paint</a></li>
                            <li><a href="/Miscellaneous" className="nav-link social-icon mb-2">Detailing (Interior/Exterior)</a></li>
                            <li><a href="/car-wash" className="nav-link social-icon mb-2">Premium Car Wash</a></li>
                            <li><a href="/car-wash" className="nav-link social-icon mb-2">Tyre polish</a></li>
                            <li><a href="/car-wash" className="nav-link social-icon mb-2">Accessories</a></li>
                            <li><a href="/car-wash" className="nav-link social-icon mb-2">Interior Customization</a></li>
                        </ul>
                    </div>

                    {/* ====== Newsletter + Slogan ====== */}
                    <div className="col-md-3">
                        <h5 className="mb-3 text-uppercase fw-bold d-flex align-items-center " style={{ color: "#f8f9fa", letterSpacing: "1px", fontFamily: "'Poppins', sans-serif" }}>
                            <i className="bi bi-envelope-arrow-up-fill text-danger me-1" style={{ fontSize: "19px", filter: "drop-shadow(0 0 4px rgba(225,6,0,0.5))" }}></i>
                            Subscribe Newsletter
                        </h5>
                        <div
                            style={{ height: "3px", width: "80px", background: "linear-gradient(90deg, #e10600, #ff4d00)", borderRadius: "2px", marginTop: "-5px", marginBottom: "10px" }}
                        ></div>
                        <p className="small">Get latest updates, offers & car care tips.</p>

                        <form onSubmit={handlerSubsciptionSub} className="d-flex">
                            <input
                                type="email"
                                className="form-control form-control-sm me-2"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <button className="btn btn-danger btn-sm">Subscribe</button>
                        </form>

                        {/* === Animated slogan === */}
                        <div className="text-center mt-4">
                            <div className="slogan-box d-inline-block px-4 py-2 fw-semibold text-uppercase position-relative" style={{ color: "#f5f5f5", letterSpacing: "1px", fontSize: "13px", border: "1px solid #e10600", borderRadius: "8px", boxShadow: "0 4px 10px rgba(225,6,0,0.3)", fontFamily: "'Poppins', sans-serif" }}>
                                <i className="bi bi-wrench-adjustable me-2 text-danger"></i>
                                At{" "}
                                <span style={{ color: "#e10600", fontSize: "17px" }} className="brand-zoom">
                                    BROTHER'S
                                </span>
                                , We Don’t Just Fix Cars – We Build Trust
                            </div>
                        </div>
                    </div>
                </div>
                {/* <button className="btn-custom">PROCEED TO CHECKOUT</button> */}

                {/* ====== Contact Info ====== */}
                {/* ====== Bottom Bar (Only Top Border + Full Width) ====== */}
                <div className="mt-4 w-100 border-top border-danger pt-3 pb-2">
                    <div className="container">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-center text-md-start">

                            <div>
                                <ul className="nav justify-content-center justify-content-md-start align-items-center">
                                    <li className="nav-item">
                                        <a className="nav-link social-icon" href="mailto:beradilip39@gmail.com">
                                            <i className="bi bi-envelope me-1"></i> beradilip39@gmail.com
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link social-icon" href="tel:9313015917">
                                            <i className="bi bi-phone me-1"></i> 9313015917
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="my-2 my-md-0">
                                Copyright © {new Date().getFullYear()}
                                <span className="text-warning"> BROTHER'S </span>. All Rights Reserved.
                            </div>
                            <div>
                                <a href="#" className="nav-link social-icon">Terms & Conditions</a> 
                                <a href="#" className="nav-link social-icon">Privacy Policy</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
