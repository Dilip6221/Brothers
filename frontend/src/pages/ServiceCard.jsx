import React from "react";
import ppf from "../assets/images/car-ppf.jpg";
import { Link } from "react-router-dom";

const services = [
    { title: "Paint Protection Film", img: ppf,url: "/ppf" },
    { title: "Full Body Painting", img: "https://pacompro.com/wp-content/uploads/2019/07/websitepaint-and-dent_1.jpg",url: "/paint" },
    { title: "Panel Painting", img: "https://brotomotiv.in/admin/public/uploads/1747660788_s3.png",url: "/paint" },
    { title: "Ceramic & Graphene Coating", img: "https://brotomotiv.in/admin/public/uploads/1747660788_s2.png",url: "/ceramic" },
    { title: "Vinyl Wrap", img: "https://brotomotiv.in/admin/public/uploads/1747660788_s3.png",url: "/vinyl-wrap" },
    { title: "Sound Damping", img: "https://brotomotiv.in/admin/public/uploads/1747660788_s3.png",url: "/sound-damping" },
    { title: "Sunroof and Safety Glazing Film", img: "https://brotomotiv.in/admin/public/uploads/1747660788_s3.png",url: "/sunroof-ppf" },
    { title: "Interior Customization", img: "https://brotomotiv.in/admin/public/uploads/1747660788_s3.png" ,url: "/interior-custmization"},
    { title: "Premium Car Wash", img: "https://brotomotiv.in/admin/public/uploads/1747660788_s3.png",url: "/car-wash" },
    { title: "Others", img: "https://brotomotiv.in/admin/public/uploads/1747660788_s3.png",url: "/other-service" },
];

const Services = () => {
    return (
        <section className="services-section">
            <h2 className="service-main-title">OUR <span className="text-danger">PREMIUM SERVICES</span></h2>
            <div className="services-grid">
                {services.map((s,i)=>(
                    <Link to={s.url} key={i} className="service-card">
                        <h3 className="service-title">{s.title}</h3>
                        <div className="img-box">
                            <img src={s.img} alt={s.title} className="service-img" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Services;
