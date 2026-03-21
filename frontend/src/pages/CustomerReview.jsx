import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";


const CustomerReview = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/customer-reviews/admin/all`
      );
      if (res.data.success) {
        const approved = res.data.data.filter((r) => r.isApproved);
        setReviews(approved);
      }
    } catch (err) {
      toast.error("Error fetching reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="review-section">
      <h2>
        CUSTOMER <span>REVIEW</span>
      </h2>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        navigation
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {reviews.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="review-card">
              <div className="stars">
                {"★".repeat(item.rating || 5)}
              </div>

              <p>
                {item.review.slice(0, 90)}...
                <span
                  className="read-more"
                  onClick={() => setSelectedReview(item)}
                >
                  Read More
                </span>
              </p>

              <h4>{item.name}</h4>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {selectedReview && (
        <div className="modal-overlay">
          <div className="review-modal">
            <span
              className="close"
              onClick={() => setSelectedReview(null)}
            >
              ×
            </span>

            <div className="stars big">
              {"★".repeat(selectedReview.rating || 5)}
            </div>

            <p>{selectedReview.review}</p>

            <h4>{selectedReview.name}</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReview;
