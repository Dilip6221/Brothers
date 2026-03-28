import React, { useContext,useState } from "react";
import "../css/contact.css";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "../context/UserContext.jsx";

const Contact = () => {
    const { user } = useContext(UserContext);
    const serviceOptions = [
        { value: "PPF", label: "PPF Installation" },
        { value: "PAINT", label: "Full Body Paint" },
        { value: "COTTING", label: "Ceramic Coating" },
    ];
    const carBrandOptions = [
        { value: "Hyundai", label: "Hyundai" },
        { value: "BMW", label: "BMW" },
        { value: "Suzuki", label: "Suzuki" },
    ];

    const carModelOptions = [
        { value: "Creta", label: "Creta" },
        { value: "i20", label: "i20" },
    ];

    const reactSelectStyles = {
        control: (base, state) => ({
        ...base,
        background: "rgba(255,255,255,0.08)",
        border: state.isFocused
            ? "1px solid #254c87c8"
            : "1px solid rgba(255,255,255,0.2)",
        boxShadow: "none",
        minHeight: "44px",
        cursor: "pointer",
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

    const handleEnquiryInputChange = (e) => {
        const { name, value } = e.target;
        setServiceEnquery((prev) => ({ ...prev, [name]: value }));
    };
    const handleEnquirySubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/inquery/service-inquiry`, {
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
            } else {
                toast.error(res.data.message);
            }
            setServiceEnquery({ name: "", phone: "", email: "", city: "", address: "", carBrand: "", carModel: "", services: [], notes: "" });
        } catch (error) {
            console.error("Frontend Error submitting enquiry:", error);
            toast.error(error);
        }
    };
    return (
        <div className="bg-black text-white px-2 px-md-0">

            <div className="py-5 text-center">
                <span className="about-badge">
                    Contact Us
                </span>
                <div className="container text-center">
                    <h3 className="section-title section-title-small">
                        <span className="first-letter">G</span>et in Touch
                    </h3>
                    <p className="text-secondary fs-5 mt-2">
                        Ready to transform your vehicle? Contact us today to book an appointment or learn more about our services.
                    </p>
                </div>
            </div>

            {/* Contact Info + Form */}
            <div className="contact-container  w-100">
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

                   <div className="info-item social-card clean-social">
                        <div className="info-text full-width">
                            <h4 className="social-title">Connect With Us</h4>
                            <div className="social-icons flex-wrap ">
                                <a href="https://youtube.com/@dilipahir6221" target="_blank" rel="noreferrer" aria-label="YouTube">
                                    <i className="bi bi-youtube"></i>
                                </a>
                                <a href="https://wa.me/919313015917" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                                    <i className="bi bi-instagram"></i>
                                </a>
                                <a href="https://x.com/DilipBe00479036" target="_blank" rel="noreferrer" aria-label="Facebook">
                                    <i className="bi bi-twitter-x"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Contact Form */}
                <form className="contact-form" onSubmit={handleEnquirySubmit}>
                    <div className="row g-3 gx-2">
                        <div className="col-md-6 mb-2">
                            <input type="text" name="name" className="form-control shadow-none text-white"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", }}
                                placeholder="Full Name*"
                                autoComplete="off"
                                value={serviceEnquery.name}
                                onChange={handleEnquiryInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-2">
                            <input type="tel" name="phone" inputMode="numeric" className="form-control shadow-none text-white"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", }}
                                placeholder="Phone Number*"
                                autoComplete="off"
                                value={serviceEnquery.phone}
                                onChange={handleEnquiryInputChange}
                            />
                        </div>
                        <div className="col-12 mb-2">
                            <input type="email" name="email" className="form-control shadow-none text-white"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", }}
                                placeholder="Email*"
                                autoComplete="off"
                                value={serviceEnquery.email}
                                onChange={handleEnquiryInputChange}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <input type="text" name="city" className="form-control shadow-none text-white"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", }}
                                placeholder="City*"
                                autoComplete="off"
                                value={serviceEnquery.city}
                                onChange={handleEnquiryInputChange}
                            />
                        </div>

                        <div className="col-md-8 mb-2">
                            <input type="text" name="address" className="form-control shadow-none text-white"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", }}
                                placeholder="Address*"
                                autoComplete="off"
                                value={serviceEnquery.address}
                                onChange={handleEnquiryInputChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <Select
                            options={carBrandOptions}
                            placeholder="Car Manufacturer*"
                            styles={reactSelectStyles}
                            value={carBrandOptions.find(
                                opt => opt.value === serviceEnquery.carBrand
                            )}
                            onChange={(selected) =>
                                handleEnquiryInputChange({
                                    target: {
                                    name: "carBrand",
                                    value: selected ? selected.value : ""
                                    }
                                })
                                }
                            />
                        </div>
                        <div className="col-md-6 mb-2">
                            <Select
                            options={carModelOptions}
                            placeholder="Car Model*"
                            styles={reactSelectStyles}
                            value={carModelOptions.find(
                                opt => opt.value === serviceEnquery.carModel
                            )}
                            onChange={(selected) =>
                                handleEnquiryInputChange({
                                    target: {
                                    name: "carModel",
                                    value: selected ? selected.value : ""
                                    }
                                })
                                }
                            />
                        </div>
                         <div className="col-md-12 mb-2">
                            <Select
                            isMulti
                            options={serviceOptions}
                            placeholder="Required Service*"
                            value={serviceOptions.filter(opt =>
                                serviceEnquery.services.includes(opt.value)
                            )}
                            onChange={(selected) =>
                                setServiceEnquery(prev => ({
                                ...prev,
                                services: selected ? selected.map(s => s.value) : [],
                                }))
                            }
                            styles={reactSelectStyles}
                            />
                        </div>
                        <div className="col-12 mb-4 mb-2">
                            <textarea
                                name="notes"
                                className="form-control shadow-none text-white"
                                style={{
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                }}
                                value={serviceEnquery.notes}
                                onChange={handleEnquiryInputChange}
                                rows="2"
                                placeholder="Comments or Special Requirements"
                            ></textarea>
                        </div>
                    </div>
                    {/* <button type="submit" className="submit-btn">
                        Submit Enquiry
                    </button> */}
                    <button type="submit" className="cont-btn w-100" >
                        Submit Enquiry
                    </button>
                </form>
            </div>
            <div className="map-container mt-4 mt-md-5 px-2 px-md-0">
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
