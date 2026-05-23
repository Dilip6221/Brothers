import React, { useContext, useState, useEffect, useRef } from "react";
import "../css/contact.css";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "../context/UserContext.jsx";
import { validateForm } from "../utils/formValidation.js";
import { submitInquiryValidationRules } from "../utils/validationRules.js";

const Contact = () => {
    const { user } = useContext(UserContext);
    const [carBrandOptions, setCarBrandOptions] = useState([]);
    const [carModelOptions, setCarModelOptions] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([]);

    const reactSelectStyles = {
        control: (base, state) => ({
            ...base,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "none",
            cursor: "pointer",
            "&:hover": {
                border: "1px solid rgba(255,255,255,0.2)",
            }
        }),
        singleValue: (base) => ({
            ...base,
            color: "white",
        }),
        menu: (base) => ({
            ...base,
            background: "#222",
            borderRadius: "6px",
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "#254c87"
                : state.isFocused
                    ? "#444"
                    : "#222",
            color: "white",
            cursor: "pointer",
        }),
        placeholder: (base) => ({
            ...base,
            color: "#ccc",
        }),

        indicatorSeparator: () => ({ display: "none" }),
        dropdownIndicator: (base) => ({
            ...base,
            color: "#ccc",
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: "black",
        }),
    };
    const [serviceEnquery, setServiceEnquery] = useState({
        name: user ? user.name : "",
        phone: user ? user.phone : "",
        email: user ? user.email : "",
        city: "",
        address: "",
        carBrand: "",
        carModel: "",
        services: [],
        notes: ""
    });

    const inputRefs = {
        name: useRef(),
        phone: useRef(),
        email: useRef(),
        city: useRef(),
        address: useRef(),
        carBrand: useRef(),
        carModel: useRef(),
        services: useRef(),
        notes: useRef()
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get("car-companies/companies");
                const options = res.data.data.map(c => ({
                    value: c._id,
                    label: c.name
                }));
                setCarBrandOptions(options);
            } catch (err) {
                console.error("Frontend Error Fetching Companies:", err);
                toast.error(err.message || "Failed to load car companies");
            }
        };
        fetchCompanies();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get("service/admin/services");
                const options = res.data.data.map(c => ({
                    value: c.title,
                    label: c.title
                }));
                setServiceOptions(options);
            } catch (err) {
                console.error("Frontend Error Fetching Services:", err);
                toast.error(err.message || "Failed to load services");
            }
        };
        fetchServices();
    }, []);

    const handleBrandChange = async (selected) => {
        const companyId = selected?.value || "";
        setServiceEnquery(prev => ({
            ...prev,
            carBrand: selected?.label || "",
            carModel: ""
        }));
        setCarModelOptions([]);
        if (!companyId) return;
        try {
            const res = await axios.get(`car-companies/${companyId}/car-models`);
            const options = res.data.data.map(m => ({
                value: m.name,
                label: m.name
            }));
            setCarModelOptions(options);
        } catch (err) {
            console.error("Frontend Error Fetching Models:", err);
            toast.error(err.message || "Failed to load car models");
        }
    };

    const handleEnquiryInputChange = (e) => {
        const { name, value } = e.target;
        setServiceEnquery((prev) => ({ ...prev, [name]: value }));
    };
    const handleEnquirySubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm({
            values: serviceEnquery,
            validationRules: submitInquiryValidationRules,
            inputRefs
        });
        if (!isValid) return;
        try {
            const res = await axios.post("inquery/service-inquiry", {
                name: serviceEnquery.name,
                phone: serviceEnquery.phone,
                email: serviceEnquery.email,
                city: serviceEnquery.city,
                address: serviceEnquery.address,
                carBrand: serviceEnquery.carBrand,
                carModel: serviceEnquery.carModel,
                services: serviceEnquery.services,
                notes: serviceEnquery.notes,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setServiceEnquery({ name: user ? user.name : "", phone: user ? user.phone : "", email: user ? user.email : "", city: "", address: "", carBrand: "", carModel: "", services: [], notes: "" });
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Frontend Error submitting enquiry:", error);
            toast.error("Something went wrong");
        }
    };
    return (
        <div className="premium-contact-page text-white">
            <div className="contact-hero text-center">
                {/* <span className="about-badge">
                    Contact Us
                </span>
                <div className="container">
                    <h3 className="section-title section-title-small">
                        <span className="first-letter">G</span>et in Touch
                    </h3>
                    <p className="text-secondary fs-5 mt-3">
                        Premium automotive care starts with one conversation.
                    </p>
                </div> */}
                <div className="services-heading text-center">
                    <div className="section-top-title">
                        <span></span>
                        <p>Get In Touch With RyDAX</p>
                        <span></span>
                    </div>

                    <h2 className="services-title">
                        Contact <span>Us</span>
                    </h2>

                    <p className="services-subtitle">
                        Have questions about detailing, ceramic coating, PPF, or premium car care?
                        Our experts are here to help you choose the perfect service for your vehicle.
                    </p>
                </div>
            </div>
            <div className="premium-contact-layout container">
                <div className="premium-contact-info">
                    <a
                        href="https://www.google.com/maps?q=Navi+Veraval,+Gujarat,+India"
                        target="_blank"
                        rel="noreferrer"
                        className="info-item"
                    >
                        <div className="info-icon">
                            <i className="bi bi-geo-alt-fill"></i>
                        </div>

                        <div className="info-text">
                            <h4>Workshop Location</h4>
                            <p>
                                Veraval Nani,
                                <br />
                                Jamnagar, Gujarat
                            </p>
                        </div>
                    </a>
                    <a
                        href="mailto:beradilip39@gmail.com"
                        className="info-item"
                    >
                        <div className="info-icon">
                            <i className="bi bi-envelope-fill"></i>
                        </div>
                        <div className="info-text">
                            <h4>Email Support</h4>
                            <p>
                                beradilip39@gmail.com
                            </p>
                        </div>
                    </a>
                    <a
                        href="tel:919313015917"
                        className="info-item"
                    >
                        <div className="info-icon">
                            <i className="bi bi-telephone-fill"></i>
                        </div>
                        <div className="info-text">
                            <h4>Call Us</h4>
                            <p>
                                +91 9313015917
                            </p>
                        </div>
                    </a>
                    <div className="info-item clean-social">
                        <div className="info-text w-100">
                            <h4 className="social-title">
                                Connect With Us
                            </h4>

                            <div className="social-icons">

                                <a
                                    href="https://youtube.com/@dilipahir6221"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="bi bi-youtube"></i>
                                </a>

                                <a
                                    href="https://wa.me/919313015917"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="bi bi-whatsapp"></i>
                                </a>

                                <a
                                    href="https://www.instagram.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="bi bi-instagram"></i>
                                </a>

                                <a
                                    href="https://x.com/DilipBe00479036"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="bi bi-twitter-x"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <form
                    className="premium-contact-form"
                    onSubmit={handleEnquirySubmit}
                >

                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="name"
                                className="form-control service-input shadow-none"
                                placeholder="Full Name*"
                                autoComplete="off"
                                ref={inputRefs.name}
                                value={serviceEnquery.name}
                                onChange={handleEnquiryInputChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="tel"
                                name="phone"
                                inputMode="numeric"
                                className="form-control service-input shadow-none"
                                placeholder="Phone Number*"
                                autoComplete="off"
                                ref={inputRefs.phone}
                                value={serviceEnquery.phone}
                                onChange={handleEnquiryInputChange}
                            />
                        </div>
                        <div className="col-12">
                            <input
                                type="email"
                                name="email"
                                className="form-control service-input shadow-none"
                                placeholder="Email Address*"
                                autoComplete="off"
                                ref={inputRefs.email}
                                value={serviceEnquery.email}
                                onChange={handleEnquiryInputChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="city"
                                className="form-control service-input shadow-none"
                                placeholder="City*"
                                autoComplete="off"
                                ref={inputRefs.city}
                                value={serviceEnquery.city}
                                onChange={handleEnquiryInputChange}
                            />
                        </div>
                        <div className="col-md-8">
                            <input
                                type="text"
                                name="address"
                                className="form-control service-input shadow-none"
                                placeholder="Address"
                                autoComplete="off"
                                ref={inputRefs.address}
                                value={serviceEnquery.address}
                                onChange={handleEnquiryInputChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                                options={carBrandOptions}
                                classNamePrefix="react-select"
                                placeholder="Car Manufacturer*"
                                styles={reactSelectStyles}
                                ref={inputRefs.carBrand}
                                maxMenuHeight={180}
                                value={carBrandOptions.find(
                                    opt =>
                                        opt.label ===
                                        serviceEnquery.carBrand
                                )}
                                onChange={handleBrandChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                                options={carModelOptions}
                                classNamePrefix="react-select"
                                key={serviceEnquery.carBrand}
                                placeholder="Car Model*"
                                styles={reactSelectStyles}
                                ref={inputRefs.carModel}
                                maxMenuHeight={180}
                                value={carModelOptions.find(
                                    opt =>
                                        opt.value ===
                                        serviceEnquery.carModel
                                )}
                                onChange={(selected) =>
                                    handleEnquiryInputChange({
                                        target: {
                                            name: "carModel",
                                            value: selected
                                                ? selected.value
                                                : ""
                                        }
                                    })
                                }
                            />
                        </div>
                        <div className="col-12">
                            <Select
                                isMulti
                                options={serviceOptions}
                                classNamePrefix="react-select"
                                placeholder="Required Services*"
                                ref={inputRefs.services}
                                maxMenuHeight={120}
                                value={serviceOptions.filter(opt =>
                                    serviceEnquery.services.includes(
                                        opt.value
                                    )
                                )}
                                onChange={(selected) =>
                                    setServiceEnquery(prev => ({
                                        ...prev,
                                        services: selected
                                            ? selected.map(
                                                s => s.value
                                            )
                                            : [],
                                    }))
                                }
                                styles={reactSelectStyles}
                            />
                        </div>
                        <div className="col-12">
                            <textarea
                                name="notes"
                                rows="2"
                                className="form-control service-input shadow-none"
                                placeholder="Comments or Special Requirements"
                                ref={inputRefs.notes}
                                value={serviceEnquery.notes}
                                onChange={handleEnquiryInputChange}
                            ></textarea>

                        </div>

                    </div>
                    <div className="booking-note">
                        <i className="bi bi-shield-check"></i>
                        Your details are securely protected
                    </div>
                    <button
                        type="submit"
                        className="garage-btn"
                    >
                        <span>
                            Book Premium Consultation
                        </span>
                        <i className="bi bi-arrow-right"></i>
                    </button>

                </form>

            </div>

            {/* MAP */}
            <div className="container pb-5">
                <div className="map-container">
                    <iframe
                        title="map"
                        src="https://www.google.com/maps?q=Navi+Veraval,+Gujarat,+India&output=embed"
                        style={{
                            border: 0,
                            width: "100%",
                            height: "420px"
                        }}
                        loading="lazy"
                        allowFullScreen
                    ></iframe>

                </div>
            </div>
        </div>
    );
};

export default Contact;
