import '../css/about.css';
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const About = () => {
  const [timeline, setTimeline] = useState([]);
  const [activeImages, setActiveImages] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const handleOpenGallery = (images, id) => {
    if (!images || images.length === 0) return;
    setActiveImages(images);
    setActiveId(id);
  };

  const closeGallery = () => {
    setActiveImages([]);
    setActiveId(null);
  };
  const fetchTimeline = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/about-timeline/about-timeline`);
      if (res.data.success) {
        setTimeline(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch timeline data");
      console.error("Timeline fetch error");
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);
  return (
    <div className="bg-black text-white">
      <div className="py-5 text-center">
        <span className="about-badge">
          About BROTHER'S
        </span>

        <div className="container text-center">
          <h3 className="section-title section-title-small">
            <span className="first-letter">O</span>ur Journey to Excellence
          </h3>
          <p className="text-secondary fs-5 mt-2">
            From a small waterless car wash service to India's premier automotive detailing and modification brand.
          </p>
        </div>
      </div>
      <div className="container">
        <h2 className="text-center mb-4 story-title">Our Journey</h2>
        <div className="timeline-wrapper">
          {/* LEFT SIDE TIMELINE */}
          <div className="timeline">
            {timeline.map((item, index) => (
              <div
                key={item._id}
                className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
              >
                <div className="timeline-content">
                  <span className="year">{item.year}</span>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>

                {item.images?.length > 0 && (
                  <button
                    className={`timeline-plus ${activeId === item._id ? "active" : ""}`}
                    onClick={() => handleOpenGallery(item.images, item._id)}
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className={`timeline-gallery ${activeImages.length ? "open" : ""}`}>
            <div className="gallery-header">
              <h5>Gallery</h5>
              <span onClick={closeGallery}>×</span>
            </div>
            <div className="gallery-grid">
              {activeImages.map((img, index) => (
                <img key={index} src={img.url} alt="" />
              ))}
            </div>
          </div>
        </div>
        <div className="core-values-section py-5">
          <div className="container">
            <h2 className="text-center mb-5 core-title">Our Core Values</h2>
            <div className="row g-4">
              {/* Quality */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="core-card">
                  <div className="core-icon">
                    <i className="bi bi-award"></i>
                  </div>
                  <h4>Quality</h4>
                  <p>
                    Uncompromising standards in every service we deliver, using only
                    premium products and techniques.
                  </p>
                </div>
              </div>

              {/* Customer Relationship */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="core-card">
                  <div className="core-icon">
                    <i className="bi bi-heart"></i>
                  </div>
                  <h4>Customer Relationship</h4>
                  <p>
                    Building lasting relationships through exceptional service and
                    personalized automotive care.
                  </p>
                </div>
              </div>

              {/* Innovation */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="core-card">
                  <div className="core-icon">
                    <i className="bi bi-lightbulb"></i>
                  </div>
                  <h4>Innovation</h4>
                  <p>
                    Continuously adopting cutting-edge technologies and methods in
                    automotive detailing.
                  </p>
                </div>
              </div>

              {/* Passion */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="core-card">
                  <div className="core-icon">
                    <i className="bi bi-lightning"></i>
                  </div>
                  <h4>Passion</h4>
                  <p>
                    Driven by genuine love for automobiles and commitment to perfection
                    in every detail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* OUR VISION SECTION */}
        <div className="vision-section py-5">
          <div className="container text-center">
            <span className="badge vision-badge mb-3">Our Vision</span>

            <h2 className="vision-title">
              Driving the Future of Automotive Excellence
            </h2>

            <p className="vision-text mx-auto mt-3">
              Our vision is to become India’s most trusted and innovative automotive
              detailing and modification brand, delivering world-class quality,
              cutting-edge technology, and unmatched customer experiences — driven by
              passion, precision, and performance.
            </p>

            <div className="row mt-5 g-4">
              <div className="col-12 col-md-4">
                <div className="vision-card">
                  <i className="bi bi-globe"></i>
                  <h5>Pan-India Presence</h5>
                  <p>Expanding our footprint across India with consistent premium quality.</p>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="vision-card">
                  <i className="bi bi-gear"></i>
                  <h5>Innovation First</h5>
                  <p>Adopting global technologies and advanced automotive solutions.</p>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="vision-card">
                  <i className="bi bi-star"></i>
                  <h5>Unmatched Excellence</h5>
                  <p>Setting new benchmarks in quality, trust, and customer satisfaction.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default About;
