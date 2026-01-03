import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import toast from "react-hot-toast";

const Blog = () => {
    const { user } = useContext(UserContext);//find login user

    const [blogs, setBlogs] = useState([]); // Store published blogs
    const [animatingId, setAnimatingId] = useState(null); // For like animation
    const navigate = useNavigate();

    useEffect(() => {
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
            console.error(err);
            toast.error("Error fetching blogs");
        }
    };

    /* ================= SHARE ================= */
    const shareMyBlog = async (blog) => {
        const url = `${window.location.origin}/blog/${blog.slug}`;
        try {
            if (navigator.canShare && navigator.canShare({ files: [] })) {
                const response = await fetch(blog.thumbnail);
                const blob = await response.blob();
                const file = new File([blob], "thumbnail.jpg", {
                    type: blob.type,
                });

                await navigator.share({
                    title: blog.title,
                    text: blog.metaDescription,
                    url,
                    files: [file],
                });
            } else if (navigator.share) {
                await navigator.share({
                    title: blog.title,
                    text: blog.metaDescription,
                    url,
                });
            } else {
                console.log("Web Share API not supported in this browser.");
                await navigator.clipboard.writeText(url);
                toast.success("Blog URL copied to clipboard!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error sharing the blog");
        }
    };

    /* ================= LIKE TOGGLE ================= */
    const handleLikeToggle = async (blogId) => {
        if (!user) {
            toast.error("Login required to like");
            navigate("/login");
            return;
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/like-toggle/${blogId}`, { userId: user._id });
            if (!res.data.success) {
                toast.error(res.data.message);
                return;
            }
            setBlogs((prev) =>
                prev.map((blog) => {
                    if (blog._id !== blogId) return blog;
                    const likedBy = blog.likedBy || [];
                    const alreadyLiked = likedBy.includes(user._id);
                    return {
                        ...blog,
                        likes: res.data.likes,
                        likedBy: alreadyLiked
                            ? likedBy.filter((id) => id !== user._id)
                            : [...likedBy, user._id],
                    };
                })
            );
        } catch (err) {
            toast.error(err.response?.data?.message || "Error toggling like");
        }
    };

    /* ================= ANIMATION ================= */
    const triggerLikeAnimation = useCallback((blogId) => {
        setAnimatingId(blogId);
        setTimeout(() => setAnimatingId(null), 700);
    }, []);

    /* ================= LIKE + ANIMATE ================= */
    const likeAndAnimate = (blogId) => {
        handleLikeToggle(blogId);
        triggerLikeAnimation(blogId);
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
                                    We're preparing something exciting for you.
                                    <br />
                                    Check back soon for fresh automotive insights!
                                </p>
                                <Link to="/" className="btn mt-2" style={{background: "#ff6600",fontWeight: 500,}}>
                                    Go to Homepage →
                                </Link>
                            </div>
                        </div>
                    ) : (
                        blogs.map((blog) => {
                            const isLiked = blog.likedBy?.includes(user?._id);
                            return (
                                <div className="col-md-3 mb-4 d-flex" key={blog._id}>
                                    <div className="blog-card">
                                        <div className="blog-image-wrapper" onDoubleClick={() => likeAndAnimate(blog._id)}>
                                            <img src={blog.thumbnail} alt={blog.title} />
                                            {animatingId === blog._id && (<i className="bi bi-heart-fill double-like-heart"></i>)}

                                            <span className="blog-category badge-on-image">
                                                {blog.category}
                                            </span>
                                        </div>

                                        {/* CONTENT */}
                                        <div className="blog-content-wrapper">
                                            <div className="blog-meta-inline">
                                                <span>
                                                    <i className="bi bi-clock"></i>{" "}
                                                    {blog.readTime} min
                                                </span>
                                                <span>
                                                    <i className="bi bi-person"></i>{" "}
                                                    BROTHER'S
                                                </span>
                                            </div>

                                            <h5 className="blog-title">
                                                {blog.title}
                                            </h5>

                                            <div className="blog-actions">
                                                <Link to={`/blog/${blog.slug}`} className="btn btn-sm" style={{ background: "#ff6600", fontWeight: 600 }}>
                                                    Read More →
                                                </Link>
                                                <button className="btn btn-sm share-btn" style={{background: "#ff6600"}} onClick={(e) => {e.stopPropagation();shareMyBlog(blog);}}>
                                                    <i className="bi bi-share-fill"></i>
                                                </button>
                                                <button className={`like-btn ${isLiked ? "liked" : ""}`}
                                                    onClick={(e) => {e.stopPropagation();likeAndAnimate(blog._id);}}>   
                                                    <i className={` bi ${isLiked ? " bi-heart-fill" : "bi-heart"}`}></i>
                                                    <span>{blog.likes}</span>
                                                </button>
                                                 {/* <Link
                                                    to={`/blog/${blog.slug}`}
                                                    className="comment-btn"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <i className="bi bi-chat-dots "></i>
                                                    <span>{blog.commentCount || 0}</span>
                                                </Link> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blog;
