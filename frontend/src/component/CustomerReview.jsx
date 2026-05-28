import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import "../css/home.css";

const CustomerReview = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const swiperRef = useRef(null);

  const REVIEW_LIMIT = 155;

  const fetchReviews = async () => {
    try {
      const res = await axios.get("customer-reviews/admin/all");
      if (res.data.success) {
        const approved = res.data.data.filter((r) => r.isApproved);
        setReviews(approved);
      }
    } catch (err) {
      toast.error("Error fetching reviews");
      console.error("Fetch reviews error:", err);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
  if (selectedReview) {
    document.body.classList.add("review-modal-open");
    document.documentElement.classList.add("review-modal-open");
    swiperRef.current?.autoplay?.stop();
  } else {
    document.body.classList.remove("review-modal-open");
    document.documentElement.classList.remove("review-modal-open");
    swiperRef.current?.autoplay?.start();
  }

  return () => {
    document.body.classList.remove("review-modal-open");
    document.documentElement.classList.remove("review-modal-open");
  };
}, [selectedReview]);

  const openReviewModal = (item) => {
    swiperRef.current?.autoplay?.stop();
    setSelectedReview(item);
  };

  const closeReviewModal = () => {
    setSelectedReview(null);
  };
  const shortText = (text = "") => {
    return text.length > REVIEW_LIMIT ? text.slice(0, REVIEW_LIMIT) : text;
  };

  return (
    <section className="customer-review-section">
      <div className="services-heading text-center">
        <div className="section-top-title">
          <span></span>
          <p>Client Testimonials</p>
          <span></span>
        </div>

        <h2 className="services-title">
          Trusted By <span>Car Enthusiasts</span>
        </h2>

        <p className="services-subtitle">
          See what our satisfied clients have to say
        </p>
      </div>

      {reviews.length > 0 && (
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          loop={reviews.length > 3}
          speed={10000}
          spaceBetween={26}
          slidesPerView={3}
          allowTouchMove={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 18 },
            768: { slidesPerView: 2, spaceBetween: 22 },
            1200: { slidesPerView: 3.2, spaceBetween: 26 },
          }}
          className="review-swiper"
        >
          {reviews.map((item, i) => {
            const isLong = item.review?.length > REVIEW_LIMIT;

            return (
              <SwiperSlide key={item._id || i}>
                <div className="testimonial-card">
                  <div className="testimonial-stars">
                    {"★".repeat(item.rating || 5)}
                  </div>

                  <div className="quote-icon">“</div>

                  <p className="testimonial-text">
                    {shortText(item.review)}
                    {isLong && (
                      <>
                        <span className="review-dots">...</span>
                        <button
                          type="button"
                          className="read-more-btn"
                          onClick={() => openReviewModal(item)}
                        >
                          Read More
                        </button>
                      </>
                    )}
                  </p>

                  <div className="testimonial-divider"></div>

                  <div className="testimonial-user">
                    <div className="user-avatar">
                      {item.name?.charAt(0)?.toUpperCase() || "R"}
                    </div>

                    <div>
                      <h4>{item.name || "RyDAX User"}</h4>
                      <p>RyDAX Customer</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {selectedReview && (
        <div className="review-modal-overlay" onClick={closeReviewModal}>
          <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="review-modal-close"
              onClick={closeReviewModal}
            >
              ×
            </button>

            <div className="testimonial-stars modal-stars">
              {"★".repeat(selectedReview.rating || 5)}
            </div>
            <div className="quote-icon modal-quote">“</div>
            <p className="review-modal-text">{selectedReview.review}</p>
            <div className="testimonial-divider"></div>
            <div className="testimonial-user">
              <div className="user-avatar modal-avatar">
                {selectedReview.name?.charAt(0)?.toUpperCase() || "R"}
              </div>
              <div>
                <h4>{selectedReview.name || "RyDAX User"}</h4>
                <p>RYDAX Customer</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomerReview;