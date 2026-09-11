import React, { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/gallery.css";
import "../css/about.css";

const PAGE_SIZE = 12;

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [categories, setCategories] = useState(["ALL"]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const requestIdRef = useRef(0);
  const loadMoreRef = useRef(null);
  const modalHistoryRef = useRef(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const fetchImages = useCallback(async (category, nextPage = 1, replace = false) => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);

    try {
      const res = await axios.get("gallery/gallery", {
        params: {
          service: category !== "ALL" ? category : undefined,
          type: "SINGLE",
          page: nextPage,
          limit: PAGE_SIZE,
        },
      });

      if (requestId !== requestIdRef.current) return;

      if (res.data.success) {
        const nextImages = res.data.data || [];
        setImages((currentImages) => {
          if (replace) return nextImages;

          const existingIds = new Set(currentImages.map((image) => image._id));
          return [...currentImages, ...nextImages.filter((image) => !existingIds.has(image._id))];
        });
        setPage(nextPage);
        setHasMore(res.data.pagination?.hasMore ?? nextImages.length === PAGE_SIZE);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Error loading images");
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

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
    setPage(1);
    setHasMore(true);
    fetchImages(activeCategory, 1, true);
  }, [activeCategory, fetchImages]);

  useEffect(() => {
    const loadMore = loadMoreRef.current;
    if (!loadMore || !hasMore || images.length === 0) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          fetchImages(activeCategory, page + 1);
        }
      },
      { rootMargin: "480px 0px" }
    );

    observer.observe(loadMore);
    return () => observer.disconnect();
  }, [activeCategory, fetchImages, hasMore, images.length, isLoading, page]);

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

          <h1 className="services-title">
            Our <span>Gallery</span>
          </h1>
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
          {isLoading && images.length === 0 &&
            Array.from({ length: PAGE_SIZE }, (_, index) => (
              <div key={`gallery-skeleton-${index}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="gallery-skeleton" aria-hidden="true" />
              </div>
            ))}

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

        {!isLoading && images.length === 0 && (
          <div className="gallery-empty-state">No work found in this category.</div>
        )}

        <div ref={loadMoreRef} className="gallery-load-status" aria-live="polite">
          {isLoading && images.length > 0 && <span className="gallery-loader" />}
          {!isLoading && images.length > 0 && !hasMore && <span>You've reached the end of our work.</span>}
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