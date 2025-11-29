import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const About = () => {
  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section className="text-center py-5">
        <h1 className="fw-bold display-4 text-danger">ABOUT US</h1>
        <p className="lead mt-3 text-light">
          We provide premium car care services with advanced technology & professional experience.
        </p>
      </section>

      {/* Info Section */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4">
            <img
              src="https://images.pexels.com/photos/4489732/pexels-photo-4489732.jpeg" // Aap yaha apni image laga sakte ho
              alt="Car Service"
              className="img-fluid rounded"
              style={{ boxShadow: "0 0 15px red" }}
            />
          </div>

          <div className="col-md-6">
            <h2 className="text-danger mb-3 fw-bold">Why Choose Us?</h2>
            <p className="text-light">
              Humari team years of experience ke sath car protection & restoration services provide karti hai.
              Hum quality materials with premium finishing use karte hai taaki aapki car hamesha shine kare.
            </p>

            <ul className="text-light">
              <li>🚗 Premium PPF Installation</li>
              <li>🎨 Professional Car Paint Protection</li>
              <li>🧽 Detailing, Polishing & Restoration</li>
              <li>💯 Genuine Material & Guaranteed Quality</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-5" style={{ backgroundColor: "#111" }}>
        <div className="container text-center">
          <h2 className="fw-bold text-danger mb-4">Our Specialized Services</h2>

          <div className="row">
            {[
              { title: "PPF Protection", desc: "Car Paint ko scratches & damage se bachata hai." },
              { title: "Ceramic Coating", desc: "Glass-like shine & long-lasting protection." },
              { title: "Premium Car Paint", desc: "Professional finish and color perfection." }
            ].map((service, i) => (
              <div key={i} className="col-md-4 mb-4">
                <div className="p-4 border rounded border-danger">
                  <h4 className="text-danger">{service.title}</h4>
                  <p className="text-light mt-2">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
