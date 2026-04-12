import React, { useState, useRef } from "react";
import cars from "../assets/images/11.png";
import { useNavigate } from "react-router-dom";
import hornSound from "../assets/vidoes/horn-sound.mp3";

const Faq = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const audioRef = useRef(null);
    const faqs = [
        {
            question: "How do I book a slot for car treatment?",
            answer:
                "Slot booking can be done through email, you can call our workshop to make a booking or you can walk-in our shop as well."
        },
        {
            question: "What are your opening hours?",
            answer:
                "Our workshop is open from 9:00 AM to 7:00 PM Monday to Saturday."
        },
        {
            question: "What payment methods do you accept?",
            answer:
                "We accept Cash, UPI, Debit/Credit Cards and Online Payments."
        },
        {
            question: "How much do you charge?",
            answer:
                "Pricing depends on the service type and car model. Contact us for an exact quote."
        },
        {
            question: "Can you collect and deliver my car?",
            answer:
                "Yes, we provide pickup and drop services depending on your location."
        },
        {
            question: "Are you insured?",
            answer:
                "Yes, vehicles are fully protected while they are in our workshop."
        },
        {
            question: "Do I get a warranty or guarantee?",
            answer:
                "Yes, selected services and parts come with a warranty."
        },
        {
            question: "What is detailing?",
            answer:
                "Car detailing is a deep cleaning and restoration process that makes your vehicle look brand new."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const leftFaq = faqs.slice(0, 4);
    const rightFaq = faqs.slice(4);

    const renderFaq = (faqList, startIndex) =>
        faqList.map((faq, i) => {
            const index = startIndex + i;
            return (
                <div
                    key={index}
                    className={`faq-item ${activeIndex === index ? "active" : ""}`}
                >
                    <div
                        className="faq-question"
                        onClick={() => toggleFAQ(index)}
                    >
                        <span>Q. {faq.question}</span>
                        <div className={`arrow ${activeIndex === index ? "rotate" : ""}`}>
                            ▼
                        </div>
                    </div>
                    <div
                        className={`faq-answer ${activeIndex === index ? "show" : ""
                            }`}
                    >
                        <p>{faq.answer}</p>
                    </div>
                </div>
            );
        });
    return (
        <div className="bg-black text-white">

            {/* Header same */}
            <div className="py-5 text-center">
                <span className="about-badge">
                    FAQS
                </span>

                <div className="container text-center">
                    <h3 className="section-title section-title-small">
                        <span className="first-letter">B</span>rother's FAQS
                    </h3>

                    <p className="text-secondary fs-5 mt-2">
                        Everything you need to know about our car services
                    </p>
                </div>
            </div>


            {/* FAQ Section */}
            <div className="container pb-5">
                <div className="faq-grid">
                    <div>{renderFaq(leftFaq, 0)}</div>
                    <div>{renderFaq(rightFaq, 4)}</div>
                </div>
            </div>
            {/* Contact CTA Section */}

            <div className="faq-contact-section">
                <div className="container">
                    <div className="faq-contact-grid">
                        <div className="faq-contact-text">
                            <h2>
                                SOME OF THE VERY FREQUENTLY ASKED
                                QUESTIONS ARE ANSWERED HERE.
                            </h2>
                            <p>If you are still confused</p>
                            <button className="cont-btn" onClick={() => navigate("/contact-us")}>
                                Contact Us!
                            </button>
                        </div>
                        <div className="faq-contact-image">
                            <img
                                src={cars}
                                alt="BROTHER'S GARAGE"
                                onClick={() => {
                                    if (audioRef.current) {
                                        audioRef.current.currentTime = 0;
                                        audioRef.current.play();
                                    }
                                }}
                            />
                            <audio ref={audioRef} src={hornSound} preload="auto" />
                            <p className="footer-slogan">
                                - At <span className="brand-highlight">BROTHER'S</span> we don’t just fix cars —
                                <span className="trust-text"> we build trust.</span>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faq;