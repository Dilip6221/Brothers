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
    return (
        <div className="bg-black text-white">
            <div className="carbon-fiber py-5 mb-5">
                <div className="container text-center">
                    <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "46px", fontWeight: "700" }}>
                        <span style={{ color: "red" }}>L</span>atest Blog Updates
                    </h1>
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
                            <div className="col-md-3 mb-4 d-flex" key={blog._id}>
                                <div className="blog-card">
                                    <img src={blog.thumbnail} alt="Brothers Blog" />
                                    <div className="p-3">
                                        <span className="blog-category">{blog.category}</span>
                                        <h5 className="blog-title mt-3">{blog.title}</h5>
                                        <p className="text-secondary small"
                                            style={{ height: "60px", overflow: "hidden" }}>
                                            {blog.metaDescription}
                                        </p>
                                        <Link
                                            to={`/blog/${blog.slug}`}
                                            className="btn w-100 mt-2"
                                            style={{
                                                background: "#ff6600",
                                                fontWeight: "600",
                                            }}
                                        >
                                            Read More →
                                        </Link>
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
