import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    useEffect(() => {//Refresh blog list on component mount
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => { // For fetching blog data from backend
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/admin/blogs`);
            const publishedBlogs = res.data.data.filter(
                (blog) => blog.status === "PUBLISHED"
            );
            setBlogs(publishedBlogs);
        } catch (err) {
            console.log(err);
            (err);
        }
    };
    const shareMyBlog = async (blog) => {
        const url = `${window.location.origin}/blog/${blog.slug}`;
        if (navigator.canShare && navigator.canShare({ files: [] })) {
            const response = await fetch(blog.thumbnail);
            const blob = await response.blob();
            const file = new File([blob], "thumbnail.jpg", { type: blob.type });

            navigator.share({
                title: blog.title,
                text: blog.metaDescription,
                url: url,
                files: [file],
            }).catch((err) => console.log(err));

        } else if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.metaDescription,
                url: url,
            }).catch((err) => console.log(err));
        } else {
            alert("Sharing not supported in your browser.");
        }
    };


    return (
        <div className="bg-black text-white">
            <div className="carbon-fiber py-5 mb-5">
                <div className="container text-center">
                    <h3 className="section-title section-title-large">
                        <span className="first-letter">L</span>atest Blog Updates
                    </h3>
                    <p className="text-secondary fs-5 mt-2">
                        Automotive • Technology • Future Insights
                    </p>
                </div>
            </div>


            {/* ================= BLOG CARDS ================= */}
            <div className="container pb-5">
                <div className="row">
                    {blogs.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <div className="empty-blog-box">
                                <div className="empty-icon">
                                    <i className="bi bi-journal-x"></i>
                                </div>

                                <h3 className="mt-3 empty-title">No Blogs Available</h3>

                                <p className="empty-text">
                                    We're preparing something exciting for you.<br />
                                    Check back soon for fresh automotive insights!
                                </p>
                                <Link
                                    to="/"
                                    className="btn mt-2"
                                    style={{
                                        background: "#ff6600",
                                        border: "none",
                                        fontWeight: "500",
                                    }}
                                >
                                    Go to Homepage →
                                </Link>
                            </div>
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <div
                                className="col-md-3 mb-4 d-flex"
                                key={blog._id}
                                onClick={(e) => {
                                        window.location.href = `/blog/${blog.slug}`;
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="blog-card">
                                    <img src={blog.thumbnail} alt={blog.title} />
                                    <div className="p-3">
                                        <span className="blog-category">{blog.category}</span>
                                        <h5 className="blog-title mt-3">{blog.title}</h5>
                                        <p
                                            className="text-secondary small"
                                            style={{ height: "60px", overflow: "hidden" }}
                                        >
                                            {blog.metaDescription}
                                        </p>
                                        <div className="d-flex mt-2 gap-2">
                                            <Link
                                                to={`/blog/${blog.slug}`}
                                                className="btn btn-sm"
                                                style={{background: "#ff6600", fontWeight: "600", flex: "1"}}
                                            >
                                                Read More →
                                            </Link>

                                            <button
                                                className="btn btn-sm share-btn"
                                                style={{
                                                    background: "#ff6600",
                                                    fontWeight: "600",
                                                    width: "40px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // card click ko rokta hai
                                                    shareMyBlog(blog);
                                                }}
                                            >
                                                <i className="bi bi-share-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>

    );
};

export default Blog;
