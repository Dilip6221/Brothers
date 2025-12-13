import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const BlogView = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);//For loading state

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blog/blogs/${slug}`);
      setBlog(res.data.data);
    } catch (err) {
      toast.error("Error fetching Blog data");
    } finally {
      setLoading(false);
    }
  };

 const SmallLoader = () => (
  <div 
    className="d-flex justify-content-center bg-black align-items-center" 
    style={{ height: "50vh" }}
  >
    <div className="spinner-border text-danger" role="status" style={{ width: "3rem", height: "3rem" }}>
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

if (loading) return <SmallLoader />;

  return (
    <div className="bg-black text-white pb-5">
      <div className="carbon-fiber py-5 mb-5 position-relative">
          {/* Back Arrow */}
          <Link to="/blog" className="back-arrow">
            <i className="bi bi-arrow-right-circle"></i>
          </Link>
          <div className="text-center">
            <h1 className="section-title section-title-large">
              <span className="first-letter">{blog.title.charAt(0)}</span>
              {blog.title.slice(1)}
            </h1>
            {/* Meta */}
            <div className="d-flex justify-content-center gap-3 mt-3 meta-box">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-tag-fill text-warning"></i>
                <span className="text-warning">{blog.category}</span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-calendar text-secondary"></i>
                <span className="text-secondary">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-clock text-secondary"></i>
                <span className="text-secondary">{blog.readTime} min read</span>
              </div>
            </div>
          </div>
      </div>

      {/* ================= FEATURED IMAGE ================= */}
      <div className="container">
        <img
          src={blog.thumbnail}
          className="w-100 rounded mb-4 shadow-lg"
          height="400"
          style={{
            objectFit: "cover",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>

      <div className="container" style={{ fontSize: "18px" }}>
        <div
          dangerouslySetInnerHTML={{ __html: blog.contentHTML }}
          className="blog-content"
        ></div>
      </div>

    </div>
  );
};

export default BlogView;
