import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext.jsx";
import "../css/blog.css";

const BlogView = () => {
  const { slug } = useParams();
  const { user } = useContext(UserContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatingLike, setAnimatingLike] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`blog/blogs/${slug}`);
      if (!res.data.success) {
        toast.error(res.data.message);
        navigate("/blog");
        return;
      }
      setBlog(res.data.data);
    } catch (err) {
      console.error("Fetch blog error:", err);
      toast.error("Error fetching blog");
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  /* Share */
  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.metaDescription,
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Blog link copied!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while sharing the blog.");
    }
  };

  /* Like */
  const triggerLikeAnimation = useCallback(() => {
    setAnimatingLike(true);
    setTimeout(() => setAnimatingLike(false), 700);
  }, []);

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await axios.post(`blog/like-toggle/${blog._id}`, { userId: user._id });
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      const likedBy = blog.likedBy || [];
      const alreadyLiked = likedBy.includes(user._id);
      setBlog((prev) => ({
        ...prev,
        likes: res.data.likes,
        likedBy: alreadyLiked ? likedBy.filter((id) => id !== user._id) : [...likedBy, user._id],
      }));
      triggerLikeAnimation();
    } catch (err) {
      console.error(err);
      toast.error("Error toggling like");
    }
  };

  const SmallLoader = () => (
    <div className="d-flex justify-content-center align-items-center bg-black" style={{ height: "100vh" }}>
      <div className="premium-loader"></div>
    </div>
  );

  if (loading) return <SmallLoader />;

  const isLiked = blog.likedBy?.includes(user?._id);

  return (
    <div className="premium-blog-view bg-black text-white">
      <section className="blog-view-hero">
        <Link to="/blog" className="premium-back-btn">
          <i className="bi bi-arrow-left"></i>
        </Link>

        <div className="hero-bg-wrapper">
          <img src={blog.thumbnail.url} alt={blog.title} />
          <div className="hero-overlay"></div>
        </div>

        <div className="container position-relative z-2">
          <div className="hero-content-wrapper">
            <div className="blog-category-chip">{blog.category}</div>

            <h1 className="premium-blog-heading">{blog.title}</h1>

            <div className="premium-meta-box">
              <div className="meta-item">
                <i className="bi bi-calendar3"></i>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="meta-item">
                <i className="bi bi-clock"></i>
                <span>
                  {blog.readTime} {" "}min read
                </span>
              </div>

              <div className="meta-item">
                <i className="bi bi-person"></i>
                <span>RYDAX</span>
              </div>
            </div>

            <div className="hero-action-buttons">
              <button className="hero-btn share-btn" onClick={handleShare}>
                <i className="bi bi-share-fill"></i>
                Share
              </button>

              <button className={`hero-btn like-hero-btn ${isLiked ? "liked" : ""}`} onClick={handleLikeToggle}>
                <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}></i>
                {blog.likes || 0}
              </button>

              <Link to="/blog" className="hero-btn explore-btn">
                Explore Blogs
              </Link>
            </div>
          </div>
        </div>

        {animatingLike && (
          <div className="view-heart-animation">
            <i className="bi bi-heart-fill"></i>
          </div>
        )}
      </section>

      <section className="blog-main-section">
        <div className="container">
          <div className="blog-main-card">
            <div className="featured-image-wrapper" onDoubleClick={handleLikeToggle}>
              <img src={blog.thumbnail.url} alt={blog.title} />
            </div>

            <div className="premium-blog-content-area">
              <div dangerouslySetInnerHTML={{ __html: blog.contentHTML }} className="blog-content"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogView;