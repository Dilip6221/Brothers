import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import '../css/gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [categories, setCategories] = useState(["ALL"]);

  const requestIdRef = useRef(0);
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
      if (requestId !== requestIdRef.current) return;
      if (res.data.success) {
        setImages(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Error loading images");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
       const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/service/admin/services`);
        if (res.data.success) {
          const dynamicCats = res.data.data.map(s => s.title);
          setCategories(["ALL", ...dynamicCats]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

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


  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = filename || "image";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Failed to download image");
      console.error("Download failed", error);
    }
  };

  return (

    <div className="bg-black text-white">
      <div className="py-5 text-center">
        <span className="about-badge">
          Our Work
        </span>
        <div className="container text-center">
          <h3 className="section-title section-title-small">
            <span className="first-letter">T</span>he Drive Gallery
          </h3>
          <p className="text-secondary fs-5 mt-2">
            Technology • Community Moments
          </p>
        </div>
      </div>

      <div className="container mb-3">
        <div className="category-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? "active" : ""}`}
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
          <span
            className="premium-fullscreen"
            onClick={(e) => {
              e.stopPropagation();
              const modal = document.querySelector(".premium-modal");
              if (!document.fullscreenElement) {
                modal.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
          >
            ⛶
          </span>
          {activeIndex > 0 && (
            <span className="nav-arrow left" onClick={handlePrev}>❮</span>
          )}
          <img
            src={images[activeIndex].imageUrl}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
          />
          {activeIndex < images.length - 1 && (
            <span className="nav-arrow right" onClick={handleNext}>❯</span>
          )}
          <button
            className="premium-download "
            onClick={(e) => {
              e.stopPropagation();
              downloadImage(
                images[activeIndex].imageUrl,
                images[activeIndex].title
              );
            }}
          >
            <i className="bi bi-download"></i>
          </button>

        </div>
      )}
    </div>
  );
};

export default Gallery;
