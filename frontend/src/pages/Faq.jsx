import React, { useState, useRef } from "react";
import cars from "../assets/images/rydax-car.png";
import { useNavigate } from "react-router-dom";
import hornSound from "../assets/vidoes/horn-sound.mp3";

const Faq = () => {

    const navigate = useNavigate();

    const audioRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const faqs = [
        {
            question: "How do I book a slot for car treatment?",
            answer:
                "Slot booking can be done through email, phone call, or direct workshop visit. Our support team will help schedule the best time for your vehicle."
        },
        {
            question: "What are your opening hours?",
            answer:
                "Our workshop is open Monday to Saturday from 9:00 AM to 7:00 PM with dedicated premium support assistance."
        },
        {
            question: "What payment methods do you accept?",
            answer:
                "We accept UPI, Debit/Credit Cards, Net Banking, Cash and major digital payment methods."
        },
        {
            question: "How much do you charge?",
            answer:
                "Pricing depends on your vehicle type, treatment package and service requirements."
        },
        {
            question: "Can you collect and deliver my car?",
            answer:
                "Yes. We offer pickup and drop services for selected locations."
        },
        {
            question: "Are you insured?",
            answer:
                "Absolutely. Every vehicle is professionally handled and protected."
        },
        {
            question: "Do I get a warranty or guarantee?",
            answer:
                "Yes. Selected detailing services and parts come with warranty coverage."
        },
        {
            question: "What is detailing?",
            answer:
                "Detailing is a premium restoration and deep cleaning process for your vehicle."
        }
    ];

    const toggleFAQ = (index) => {

        setActiveIndex(
            activeIndex === index
                ? null
                : index
        );
    };

    return (

        <div className="faq-wrapper bg-black text-white">

            {/* HEADER */}

            <div className="faq-header text-center">

                <span className="about-badge">
                    FAQS
                </span>

                <div className="container">

                    <h2 className="section-title section-title-small">

                        <span className="first-letter">
                            R
                        </span>

                        ydax FAQS

                    </h2>

                    <p className="text-secondary fs-5 mt-3">

                        Everything you need to know about
                        our premium automotive services.

                    </p>

                </div>

            </div>

            {/* FAQS */}

            <div className="container pb-5">

                <div className="faq-grid">

                    {faqs.map((faq, index) => (

                        <div
                            key={index}
                            className={`faq-item ${
                                activeIndex === index
                                    ? "active"
                                    : ""
                            }`}
                        >

                            {/* QUESTION */}

                            <div
                                className="faq-question"
                                onClick={() =>
                                    toggleFAQ(index)
                                }
                            >

                                <div className="faq-left">

                                    <div className="faq-number">

                                        {String(index + 1).padStart(2, "0")}

                                    </div>

                                    <span>
                                        {faq.question}
                                    </span>

                                </div>

                                <div
                                    className={`faq-icon ${
                                        activeIndex === index
                                            ? "rotate"
                                            : ""
                                    }`}
                                >

                                    <i className="bi bi-plus-lg"></i>

                                </div>

                            </div>

                            {/* ANSWER */}

                            <div
                                className={`faq-answer ${
                                    activeIndex === index
                                        ? "show"
                                        : ""
                                }`}
                            >

                                <div className="faq-answer-content">

                                    <p>
                                        {faq.answer}
                                    </p>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

            {/* CTA */}

            <div className="faq-contact-section">

                <div className="container">

                    <div className="faq-contact-grid">

                        {/* LEFT */}

                        <div className="faq-contact-text">

                            <h2>

                                SOME OF THE VERY

                                <span>
                                    {" "}FREQUENTLY ASKED{" "}
                                </span>

                                QUESTIONS ARE ANSWERED HERE.

                            </h2>

                            <p>

                                Still confused?
                                Our premium support team
                                is ready to help you.

                            </p>

                            <button
                                className="premium-faq-btn"
                                onClick={() =>
                                    navigate("/contact-us")
                                }
                            >

                                Contact Us

                            </button>

                        </div>

                        {/* RIGHT */}

                        <div className="faq-contact-image">

                            <img
                                src={cars}
                                alt="RYDAX"
                                onClick={() => {

                                    if (audioRef.current) {

                                        audioRef.current.currentTime = 0;

                                        audioRef.current.play();
                                    }
                                }}
                            />

                            <audio
                                ref={audioRef}
                                src={hornSound}
                                preload="auto"
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Faq;