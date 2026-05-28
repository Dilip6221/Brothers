import "../css/about.css";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const About = () => {
  const [timeline, setTimeline] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchTimeline = async () => {
    try {
      const res = await axios.get("about-timeline/about-timeline");

      if (res.data.success) {
        setTimeline(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch timeline data");
      console.error("Timeline fetch error", error);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  useEffect(() => {
    if (timeline.length > 0 && !activeId) {
      setActiveId(timeline[0]._id);
      setActiveImage(timeline[0].images?.[0]?.url || null);
    }
  }, [timeline, activeId]);

  const activeStory = useMemo(() => {
    return timeline.find((item) => item._id === activeId) || timeline[0];
  }, [timeline, activeId]);

  const previewImages = activeStory?.images || [];

  const handleSelectStory = (item) => {
    setActiveId(item._id);
    setActiveImage(item.images?.[0]?.url || null);
  };

  const openPreview = (url) => {
    setPreview(url);
  };

  const closePreview = () => {
    setPreview(null);
  };

  const changePreviewImage = (direction) => {
    if (!previewImages.length || !preview) return;

    const currentIndex = previewImages.findIndex((img) => img.url === preview);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;

    let nextIndex = safeIndex + direction;

    if (nextIndex < 0) nextIndex = previewImages.length - 1;
    if (nextIndex >= previewImages.length) nextIndex = 0;

    setPreview(previewImages[nextIndex].url);
    setActiveImage(previewImages[nextIndex].url);
  };

  useEffect(() => {
    if (preview) {
      document.body.classList.add("about-preview-open");
      document.documentElement.classList.add("about-preview-open");
    } else {
      document.body.classList.remove("about-preview-open");
      document.documentElement.classList.remove("about-preview-open");
    }

    return () => {
      document.body.classList.remove("about-preview-open");
      document.documentElement.classList.remove("about-preview-open");
    };
  }, [preview]);

  const coreValues = [
    {
      icon: "bi bi-award",
      title: "Quality",
      desc: "Uncompromising standards in every service using premium products and techniques.",
    },
    {
      icon: "bi bi-heart",
      title: "Customer Relationship",
      desc: "Building lasting relationships through exceptional service and personalized car care.",
    },
    {
      icon: "bi bi-lightbulb",
      title: "Innovation",
      desc: "Adopting modern technologies and advanced detailing methods for better results.",
    },
    {
      icon: "bi bi-lightning-charge",
      title: "Passion",
      desc: "Driven by genuine love for automobiles and commitment to perfection in every detail.",
    },
  ];

  const visionCards = [
    {
      icon: "bi bi-globe",
      title: "Pan-India Presence",
      desc: "Expanding our footprint with consistent premium quality.",
    },
    {
      icon: "bi bi-gear",
      title: "Innovation First",
      desc: "Adopting global technologies and advanced automotive solutions.",
    },
    {
      icon: "bi bi-star",
      title: "Unmatched Excellence",
      desc: "Setting new benchmarks in quality, trust and customer satisfaction.",
    },
  ];

  const StoryDetail = ({ story }) => {
    const firstImage = story.images?.[0]?.url || null;
    const selectedImage =
      activeId === story._id ? activeImage || firstImage : firstImage;

    return (
      <div className="mobile-story-detail">
        <p>{story.description}</p>

        {selectedImage && (
          <div className="mobile-story-image" onClick={() => openPreview(selectedImage)}>
            <img src={selectedImage} alt={story.title} />
            <span>
              <i className="bi bi-arrows-fullscreen"></i>
              View
            </span>
          </div>
        )}

        {story.images?.length > 0 && (
          <div className="mobile-story-thumbs">
            {story.images.map((img, index) => (
              <button
                type="button"
                key={index}
                className={`mobile-story-thumb ${
                  selectedImage === img.url ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(img.url);
                }}
              >
                <img src={img.url} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="about-page">
      <section className="about-hero-section">
        <div className="container text-center">
          <div className="section-top-title">
            <span></span>
            <p>About RyDAX</p>
            <span></span>
          </div>

          <h1 className="about-main-title">
            Built With <span>Passion</span> For Cars
          </h1>

          <p className="about-main-subtitle">
            From premium detailing to advanced automotive protection, RyDAX is
            built with passion, precision and trust.
          </p>
        </div>
      </section>

      <section className="about-journey-section">
        <div className="container">
          <div className="services-heading text-center">
            <div className="section-top-title">
              <span></span>
              <p>Our Story</p>
              <span></span>
            </div>
            <h2 className="services-title">
              RYDAX <span>Journey</span>
            </h2>
            <p className="services-subtitle">
              A visual story of how RyDAX evolved with trust, quality and
              premium automotive care.
            </p>
          </div>

          {activeStory && (
            <>
              <div className="journey-showcase desktop-journey-view">
                <div className="journey-feature-card">
                  <div className="journey-card-header">
                    <div>
                      <span className="journey-year">{activeStory.year}</span>
                      <h3>{activeStory.title}</h3>
                    </div>

                    <div className="journey-image-count">
                      <i className="bi bi-images"></i>
                      {activeStory.images?.length || 0}
                    </div>
                  </div>

                  <p>{activeStory.description}</p>

                  {activeImage && (
                    <div
                      className="journey-main-image"
                      onClick={() => openPreview(activeImage)}
                    >
                      <img src={activeImage} alt={activeStory.title} />
                      <div className="journey-image-overlay">
                        <i className="bi bi-arrows-fullscreen"></i>
                        View Image
                      </div>
                    </div>
                  )}

                  {activeStory.images?.length > 0 && (
                    <div className="journey-thumbs">
                      {activeStory.images.map((img, index) => (
                        <button
                          type="button"
                          key={index}
                          className={`journey-thumb ${
                            activeImage === img.url ? "active" : ""
                          }`}
                          onClick={() => setActiveImage(img.url)}
                        >
                          <img src={img.url} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="journey-rail">
                  {timeline.map((item, index) => (
                    <button
                      type="button"
                      key={item._id}
                      className={`journey-rail-item ${
                        activeId === item._id ? "active" : ""
                      }`}
                      onClick={() => handleSelectStory(item)}
                    >
                      <span className="rail-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <small>{item.year}</small>
                        <strong>{item.title}</strong>
                      </div>

                      <i className="bi bi-chevron-right"></i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mobile-journey-view">
                {timeline.map((item, index) => {
                  const isActive = activeId === item._id;

                  return (
                    <div className={`mobile-story-item ${isActive ? "active" : ""}`} key={item._id}>
                      <button
                        type="button"
                        className="mobile-story-head"
                        onClick={() => handleSelectStory(item)}
                      >
                        <span className="rail-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <small>{item.year}</small>
                          <strong>{item.title}</strong>
                        </div>

                        <i className={`bi ${isActive ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                      </button>

                      {isActive && <StoryDetail story={item} />}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
      <section className="about-core-section">
        <div className="container">
          <div className="services-heading text-center">
            <div className="section-top-title">
              <span></span>
              <p>What Defines Us</p>
              <span></span>
            </div>
            <h2 className="services-title">
              Our Core <span>Values</span>
            </h2>
          </div>

          <div className="about-core-grid">
            {coreValues.map((item, index) => (
              <div className="about-core-card" key={index}>
                <div className="about-core-icon">
                  <i className={item.icon}></i>
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-vision-section">
        <div className="container text-center">
          <div className="section-top-title">
            <span></span>
            <p>Our Vision</p>
            <span></span>
          </div>

          <h2 className="services-title">
            Driving The Future Of <span>Automotive Excellence</span>
          </h2>

          <p className="services-subtitle">
            Our vision is to become India’s most trusted and innovative
            automotive detailing brand, delivering world-class quality,
            advanced technology and unmatched customer experiences.
          </p>

          <div className="about-vision-grid">
            {visionCards.map((item, index) => (
              <div className="about-vision-card" key={index}>
                <i className={item.icon}></i>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {preview && (
        <div className="about-image-preview" onClick={closePreview}>
          {previewImages.length > 1 && (
            <>
              <button
                type="button"
                className="preview-nav preview-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  changePreviewImage(-1);
                }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              <button
                type="button"
                className="preview-nav preview-next"
                onClick={(e) => {
                  e.stopPropagation();
                  changePreviewImage(1);
                }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}

          <button type="button" className="about-preview-close" onClick={closePreview}>
            ×
          </button>

          <img src={preview} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default About;