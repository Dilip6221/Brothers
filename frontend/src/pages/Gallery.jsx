import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/gallery.css";
import "../css/about.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [categories, setCategories] = useState(["ALL"]);

  const requestIdRef = useRef(0);
  const modalHistoryRef = useRef(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const fetchImages = async (category) => {
    const requestId = ++requestIdRef.current;

    try {
      const res = await axios.get("gallery/gallery", {
        params: {
          service: category !== "ALL" ? category : undefined,
          type: "SINGLE",
        },
      });

      if (requestId !== requestIdRef.current) return;

      if (res.data.success) {
        setImages(res.data.data || []);
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
        const res = await axios.get("service/admin/services");

        if (res.data.success) {
          const dynamicCats = res.data.data.map((s) => s.title);
          setCategories(["ALL", ...dynamicCats]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setImages([]);
    setActiveIndex(null);
    fetchImages(activeCategory);
  }, [activeCategory]);

  const openModal = (index) => {
    setActiveIndex(index);

    if (!modalHistoryRef.current) {
      window.history.pushState({ galleryModal: true }, "");
      modalHistoryRef.current = true;
    }
  };

  const closeModal = () => {
    setActiveIndex(null);

    if (modalHistoryRef.current && window.history.state?.galleryModal) {
      modalHistoryRef.current = false;
      window.history.back();
    } else {
      modalHistoryRef.current = false;
    }
  };

  const closeModalOnly = () => {
    setActiveIndex(null);
    modalHistoryRef.current = false;
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (!images.length) return;

    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (!images.length) return;

    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (activeIndex === null || images.length <= 1) return;

    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) < 50) return;

    if (distance > 0) {
      handleNext();
    } else {
      handlePrev();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeIndex === null) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext(e);
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev(e);
      }

      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length]);

  useEffect(() => {
    const handlePopState = () => {
      if (activeIndex !== null) {
        closeModalOnly();
      }
    };

    if (activeIndex !== null) {
      document.body.classList.add("gallery-preview-open");
      document.documentElement.classList.add("gallery-preview-open");
      window.addEventListener("popstate", handlePopState);
    } else {
      document.body.classList.remove("gallery-preview-open");
      document.documentElement.classList.remove("gallery-preview-open");
      window.removeEventListener("popstate", handlePopState);
    }

    return () => {
      document.body.classList.remove("gallery-preview-open");
      document.documentElement.classList.remove("gallery-preview-open");
      window.removeEventListener("popstate", handlePopState);
    };
  }, [activeIndex]);

  const downloadImage = async (url, filename) => {
    try {
      if (!url) return;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${filename || "rydax-gallery"}.jpg`;
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
    <div className="text-white dot-wrapper">
      <div className="py-5 text-center">
        <div className="services-heading text-center">
          <div className="section-top-title">
            <span></span>
            <p>Explore Our Work</p>
            <span></span>
          </div>

          <h2 className="services-title">
            Our <span>Gallery</span>
          </h2>
        </div>
      </div>

      <div className="container mb-3">
        <div className="category-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? "active" : ""
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
                onClick={() => openModal(index)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || "RYDAX Studio"}
                  loading="lazy"
                />

                <div className="premium-overlay">
                  <h5>{item.title || "RYDAX Studio"}</h5>
                  <p>{item.service}</p>
                </div>

                <div className="gallery-card-view">
                  <i className="bi bi-arrows-fullscreen"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeIndex !== null && images[activeIndex] && (
        <div className="gallery-preview-modal" onClick={closeModal}>
          <div
            className="gallery-preview-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-preview-nav gallery-preview-prev"
                  onClick={handlePrev}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>

                <button
                  type="button"
                  className="gallery-preview-nav gallery-preview-next"
                  onClick={handleNext}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </>
            )}

            <button
              type="button"
              className="gallery-preview-close"
              onClick={closeModal}
            >
              ×
            </button>

            <button
              type="button"
              className="gallery-preview-download"
              onClick={(e) => {
                e.stopPropagation();
                downloadImage(
                  images[activeIndex].imageUrl,
                  images[activeIndex].title || `rydax-gallery-${activeIndex + 1}`
                );
              }}
            >
              <i className="bi bi-download"></i>
            </button>

            <img
              src={images[activeIndex].imageUrl}
              alt={images[activeIndex].title || "Preview"}
            />

            <div className="gallery-preview-counter">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;