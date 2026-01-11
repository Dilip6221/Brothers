import React from "react";
import '../css/about.css';

const About = () => {
  return (
    <div className="bg-black text-white">
      <div className="py-5 text-center">
        <span className="about-badge">
          About BROTHER'S
        </span>

        <div className="container text-center">
          <h3 className="section-title section-title-large">
            <span className="first-letter">O</span>ur Journey to Excellence
          </h3>
          <p className="text-secondary fs-5 mt-2">
            From a small waterless car wash service to India's premier automotive detailing and modification brand.
          </p>
        </div>
      </div>
      {/* OUR STORY SECTION */}
      <div className="container">
        <h2 className="text-center mb-2 story-title">Our Story</h2>
        <div className="timeline">
          <div className="timeline-item left">
            <div className="timeline-content">
              <span className="year">2019</span>
              <h4>The Beginning</h4>
              <p>
                Started as a small waterless car wash service with a dream to
                redefine automotive care in India.
              </p>
            </div>
          </div>
          <div className="timeline-item right">
            <div className="timeline-content">
              <span className="year">2021</span>
              <h4>Building Trust</h4>
              <p>
                Earned customer trust through quality workmanship and transparent
                service delivery.
              </p>
            </div>
          </div>
          <div className="timeline-item left">
            <div className="timeline-content">
              <span className="year">2023</span>
              <h4>Premium Expansion</h4>
              <p>
                Introduced ceramic coating, PPF and detailing services using global
                standard products.
              </p>
            </div>
          </div>
          <div className="timeline-item right">
            <div className="timeline-content">
              <span className="year">Today</span>
              <h4>BROTHER'S Automotive</h4>
              <p>
                Recognized as a premium automotive detailing and modification brand
                trusted by car enthusiasts.
              </p>
            </div>
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

  );
};

export default About;
