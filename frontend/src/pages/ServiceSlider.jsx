import React, { useEffect, useRef, useState } from "react";
import "../css/slider.css";

const portfolioData = [
  {
    id: 1,
    title: "Neural Network",
    description: "Advanced AI system with deep learning capabilities.",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/053/733/179/small/every-detail-of-a-sleek-modern-car-captured-in-close-up-photo.jpg",
    tech: ["TensorFlow", "Python", "CUDA"],
  },
  {
    id: 2,
    title: "Quantum Cloud",
    description: "Next-generation cloud infrastructure.",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/053/733/179/small/every-detail-of-a-sleek-modern-car-captured-in-close-up-photo.jpg",
    tech: ["AWS", "Docker", "Kubernetes"],
  },
  {
    id: 3,
    title: "Blockchain Vault",
    description: "Secure decentralized storage solution.",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/053/733/179/small/every-detail-of-a-sleek-modern-car-captured-in-close-up-photo.jpg",
    tech: ["Ethereum", "Solidity", "Web3"],
  },
  {
    id: 4,
    title: "Cyber Defense",
    description: "Military-grade cybersecurity framework.",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/053/733/179/small/every-detail-of-a-sleek-modern-car-captured-in-close-up-photo.jpg",
    tech: ["Zero Trust", "AI Defense"],
  },
  {
    id: 5,
    title: "Data Nexus",
    description: "Big data processing platform.",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/053/733/179/small/every-detail-of-a-sleek-modern-car-captured-in-close-up-photo.jpg",
    tech: ["Spark", "Kafka", "Hadoop"],
  },
];

const ServiceSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    updateCarousel();
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateCarousel = () => {
    if (!carouselRef.current) return;

    const items =
      carouselRef.current.querySelectorAll(".carousel-item");
    const total = items.length;

    items.forEach((item, index) => {
      let offset = index - currentIndex;

      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const abs = Math.abs(offset);
      const sign = offset < 0 ? -1 : 1;

      item.style.opacity = "1";
      item.style.zIndex = "1";

      if (abs === 0) {
        item.style.transform =
          "translate(-50%, -50%) scale(1)";
        item.style.zIndex = "10";
      } else if (abs === 1) {
        item.style.transform = `translate(-50%, -50%) translateX(${
          sign * 350
        }px) rotateY(${-sign * 30}deg) scale(0.85)`;
        item.style.opacity = "0.8";
      } else if (abs === 2) {
        item.style.transform = `translate(-50%, -50%) translateX(${
          sign * 600
        }px) rotateY(${-sign * 40}deg) scale(0.7)`;
        item.style.opacity = "0.5";
      } else {
        item.style.opacity = "0";
        item.style.transform =
          "translate(-50%, -50%) scale(0.5)";
      }
    });
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % portfolioData.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + portfolioData.length) %
        portfolioData.length
    );
  };

  return (
    <section className="hero">
      <div className="carousel-container">
        <div className="service-carousel" ref={carouselRef}>
          {portfolioData.map((item) => (
            <div className="carousel-item" key={item.id}>
              <div className="card">
                <div className="card-number">
                  0{item.id}
                </div>

                <div className="card-image">
                  <img
                    src={item.image}
                    alt={item.title}
                  />
                </div>

                <h3 className="card-title">
                  {item.title}
                </h3>
                <p className="card-description">
                  {item.description}
                </p>

                <div className="card-tech">
                  {item.tech.map((t, i) => (
                    <span
                      className="tech-badge"
                      key={i}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <button className="card-cta">
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-controls">
          <button
            className="carousel-btn"
            onClick={prevSlide}
          >
            ‹
          </button>
          <button
            className="carousel-btn"
            onClick={nextSlide}
          >
            ›
          </button>
        </div>

        <div className="carousel-indicators">
          {portfolioData.map((_, i) => (
            <div
              key={i}
              className={`indicator ${
                i === currentIndex ? "active" : ""
              }`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSlider;
