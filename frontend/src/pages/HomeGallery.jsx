import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import "../css/home.css";

const HomeGallery = ({ serviceName = "", featured = true }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  const fetchBeforeAfterGallery = async () => {
    try {
      const params = new URLSearchParams();
      params.append("type", "BEFORE_AFTER");
      if (serviceName) {
        params.append("service", serviceName);
      } else if (featured) {
        params.append("featured", "true");
      }
      const res = await axios.get(`gallery/gallery?${params.toString()}`);
      if (res.data.success) {
        setGalleryItems(res.data.data || []);
      }
    } catch (error) {
      console.error("Before After Gallery Fetch Error:", error);
      toast.error("Failed to load before after gallery");
    }
  };

  useEffect(() => {
    fetchBeforeAfterGallery();
  }, [serviceName, featured]);


  const closeModal = () => {
    if (window.history.state?.galleryModal) {
      window.history.back();
    } else {
      setActiveItem(null);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (activeItem) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [activeItem]);

  useEffect(() => {
    if (!activeItem) return;
    window.history.pushState(
      { galleryModal: true },
      "",
      window.location.href
    );

    const handlePopState = () => {
      setActiveItem(null);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [activeItem]);

  useEffect(() => {
    if (activeItem) {
      document.body.classList.add("gallery-modal-open");
      document.documentElement.classList.add("gallery-modal-open");
    } else {
      document.body.classList.remove("gallery-modal-open");
      document.documentElement.classList.remove("gallery-modal-open");
    }

    return () => {
      document.body.classList.remove("gallery-modal-open");
      document.documentElement.classList.remove("gallery-modal-open");
    };
  }, [activeItem]);

  if (!galleryItems.length) return null;

  return (
    <section className="home-gallery-section">
      <div className="services-heading text-center">
        <div className="section-top-title">
          <span></span>
          <p>Before & After</p>
          <span></span>
        </div>

        <h2 className="services-title">
          Real <span>Transformation</span>
        </h2>

        <p className="services-subtitle">
          See how our detailing experts restore shine, clarity and premium finish.
        </p>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        loop={galleryItems.length > 3}
        speed={900}
        spaceBetween={22}
        slidesPerView={3}
        navigation={true}
        autoplay={{
          delay: 2600,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          320: { slidesPerView: 1.05, spaceBetween: 16 },
          576: { slidesPerView: 1.4, spaceBetween: 18 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1200: { slidesPerView: 3, spaceBetween: 22 },
        }}
        className="home-gallery-swiper"
      >
        {galleryItems.map((item) => (
          <SwiperSlide key={item._id}>
            <div className="before-after-card" onClick={() => setActiveItem(item)}>
              <div className="before-after-images">
                <div className="ba-image-box">
                  <span className="ba-label before-label">Before</span>
                  <img src={item.beforeImage?.url} alt={`${item.title} before`} />
                </div>

                <div className="ba-image-box">
                  <span className="ba-label after-label">After</span>
                  <img src={item.afterImage?.url} alt={`${item.title} after`} />
                </div>
              </div>

              <div className="ba-content">
                <span className="ba-service">{item.service}</span>
                <h3>{item.title || "Premium Transformation"}</h3>
                <button
                  type="button"
                  className="ba-view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveItem(item);
                  }}
                >
                  View Comparison
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {activeItem && (
        <div className="ba-modal-overlay" onClick={closeModal}>
          <div className="ba-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ba-modal-close"
              onClick={closeModal}
            >
              ×
            </button>

            <div className="ba-modal-header">
              <span>{activeItem.service}</span>
              <h3>
                {activeItem.title || "Before / After Result"}
              </h3>
              {activeItem.description && (
                <p>{activeItem.description}</p>
              )}
            </div>

            <div className="ba-modal-images">
              <div>
                <span className="ba-label before-label text-dark">Before</span>
                <img src={activeItem.beforeImage?.url} alt="Before" />
              </div>

              <div>
                <span className="ba-label after-label text-dark">After</span>
                <img src={activeItem.afterImage?.url} alt="After" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeGallery;