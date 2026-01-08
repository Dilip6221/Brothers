import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CATEGORY_LIST = [
  "ALL",
  "PPF",
  "PAINT",
  "WRAP",
  "WINDOW TINT",
  "CERAMIC COATING",
  "ACCESSORIES",
];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");

  // 🔐 race-condition killer
  const requestIdRef = useRef(0);

  /* ================= FETCH ALL IMAGES ================= */
  const fetchImages = async (category) => {
    const requestId = ++requestIdRef.current;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/gallery/gallery`,
        {
          params: {
            service: category !== "ALL" ? category : undefined,
          },
        }
      );

      // ignore outdated response
      if (requestId !== requestIdRef.current) return;

      if (res.data.success) {
        setImages(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (requestId === requestIdRef.current) {
        toast.error("Error loading images");
      }
    }
  };

  /* ================= CATEGORY CHANGE ================= */
  useEffect(() => {
    setImages([]);
    setActiveIndex(null);
    fetchImages(activeCategory);
  }, [activeCategory]);

  /* ================= KEYBOARD CONTROLS ================= */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeIndex === null) return;
      if (e.key === "ArrowRight" && activeIndex < images.length - 1) {
        setActiveIndex((prev) => prev + 1);
      }
      if (e.key === "ArrowLeft" && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length]);

  const handleNext = (e) => {
    e.stopPropagation();
    if (activeIndex < images.length - 1) setActiveIndex(activeIndex + 1);
  };
  const handlePrev = (e) => {
    e.stopPropagation();
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };
  return (

    <div className="bg-black text-white">
      <div className="carbon-fiber py-5 mb-3">
        <div className="container text-center">
          <h3 className="section-title section-title-large">
            <span className="first-letter">G</span>allery
          </h3>
          <p className="text-secondary fs-5 mt-2">
            Technology • Community Moments
          </p>
        </div>
      </div>

      <div className="container mb-3">
        <div className="category-bar">
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${
                activeCategory === cat ? "active" : ""
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="container pb-5">
        <div className="row g-4">
          {images.map((item, index) => (
            <div key={item._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div
                className="premium-card fade-up"
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || "BROTHER'S"}
                  loading="lazy"
                />
                <div className="premium-overlay">
                  <h5>{item.title || "BROTHER'S"}</h5>
                  <p>{item.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeIndex !== null && images[activeIndex] && (
        <div className="premium-modal" onClick={() => setActiveIndex(null)}>
          <span className="premium-close">✕</span>

          {activeIndex > 0 && (
            <span className="nav-arrow left" onClick={handlePrev}>
              ❮
            </span>
          )}
          <img
            src={images[activeIndex].imageUrl}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
          />
          {activeIndex < images.length - 1 && (
            <span className="nav-arrow right" onClick={handleNext}>
              ❯
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
