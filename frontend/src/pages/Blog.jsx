import React, {
    useEffect,
    useState,
    useContext,
    useCallback,
    useMemo,
    useRef
} from "react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import toast from "react-hot-toast";
import "../css/blog.css";
import LoginDrawer from "../component/LoginDrawer.jsx";

const Blog = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const loginDrawerRef = useRef(null);
    const [blogs, setBlogs] = useState([]);
    const [animatingId, setAnimatingId] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchBlogs();
    }, []);
    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await axios.post("blog/admin/blogs");
            const publishedBlogs =
                res.data.data.filter(
                    (blog) =>
                        blog.status === "PUBLISHED"
                );
            setBlogs(publishedBlogs);
        } catch (err) {
            console.error(err);
            toast.error("Error fetching blogs");
        } finally {
            setLoading(false);
        }
    };
   
    const shareMyBlog = async (blog) => {
        const url = `${window.location.origin}/blog/${blog.slug}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: blog.title,
                    text: blog.metaDescription || blog.title,
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success("Blog URL copied!");
            }
        } catch (err) {
            console.log(err);
            toast.error("Error sharing blog");
        }
    };
    const handleLikeToggle = async (blogId) => {
        if (!user) {
            loginDrawerRef.current?.open();
            return;
        }
        try {
            const res = await axios.post(`blog/like-toggle/${blogId}`, { userId: user._id });
            if (!res.data.success) {
                toast.error(res.data.message);
                return;
            }
            setBlogs((prev) =>
                prev.map((blog) => {
                    if (
                        blog._id !== blogId
                    ) return blog;

                    const likedBy =
                        blog.likedBy || [];

                    const alreadyLiked =
                        likedBy.includes(user._id);
                    return {
                        ...blog,
                        likes: res.data.likes,
                        likedBy:
                            alreadyLiked
                                ? likedBy.filter(
                                    (id) =>
                                        id !==
                                        user._id
                                )
                                : [
                                    ...likedBy,
                                    user._id
                                ]
                    };
                })
            );
        } catch (err) {
            console.error(err);
            toast.error("Error toggling like");
        }
    };
    const triggerLikeAnimation =
        useCallback((blogId) => {
            setAnimatingId(blogId);
            setTimeout(() => {
                setAnimatingId(null);
            }, 700);
        }, []);
    const likeAndAnimate = (
        blogId
    ) => {
        handleLikeToggle(blogId);
        triggerLikeAnimation(blogId);
    };
    return (
        <div className="premium-blog-section bg-black text-white">
            <div className="blog-hero text-center">
                {/* <span className="about-badge">
                    OUR BLOGS
                </span> */}
                {/* <div className="container">
                    <h2 className="blog-main-title">
                        Automotive
                        <span>
                            {" "}
                            Stories & Insights
                        </span>

                    </h2>
                    <p className="blog-subtitle">
                        Explore luxury detailing,
                        car care tips,
                        performance upgrades
                        and future automotive trends.
                    </p>
                </div> */}
                <div className="services-heading text-center">
                    <div className="section-top-title">
                        <span></span>
                        <p>OUR BLOGS</p>
                        <span></span>
                    </div>

                    <h2 className="services-title">
                        Automotive <span>Stories & Insights</span>
                    </h2>
                    {/* <p className="services-subtitle">
                        Discover expert car care tips, premium detailing guides,
                        performance upgrades, and the latest trends in luxury automotive culture.
                    </p> */}
                </div>
            </div>
            
            <div className="container pb-5">
                {loading ? (
                    <div className="row">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                className="col-lg-3 col-md-6 mb-4"
                                key={i}
                            >
                                <div className="blog-skeleton"></div>
                            </div>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <div className="empty-blog-box">
                            <div className="empty-icon">
                                <i className="bi bi-journal-x"></i>
                            </div>
                            <h3 className="mt-3">No Blogs Available</h3>
                            <p className="empty-text">
                                We're preparing something exciting for you.
                                <br />
                                Check back soon for fresh automotive insights!
                            </p>
                            {/* <Link to="/" className="btn mt-2" style={{background: "#ff6600",fontWeight: 500,}}>
                                    Go to Homepage →
                                </Link> */}
                        
                            <div className="notfound-actions">
                                <button
                                    className="back-btn-404"
                                    onClick={() => navigate("/")}
                                >
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Go to Home
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {blogs.map((blog) => {
                            const isLiked = blog.likedBy?.includes(user?._id);
                            return (
                                <div
                                    className="col-xl-4 col-md-6 mb-4 d-flex"
                                    key={blog._id}
                                >
                                    <div className="ultra-blog-card">
                                        <div
                                            className="ultra-blog-image"
                                            onDoubleClick={() =>
                                                likeAndAnimate(blog._id)
                                            }
                                        >
                                            <img
                                                src={blog.thumbnail.url}
                                                alt={blog.title}
                                                loading="lazy"
                                            />
                                            <span className="ultra-blog-badge">
                                                {blog.category}
                                            </span>
                                            <div className="blog-meta-float">
                                                <span className="meta-chip">
                                                    <i className="bi bi-clock"></i>
                                                    {" "}
                                                    {blog.readTime} min
                                                </span>
                                                <span className="meta-chip">
                                                    <i className="bi bi-person"></i>
                                                    {" "}
                                                    RYDAX
                                                </span>
                                            </div>
                                            {animatingId === blog._id && (
                                                <i className="bi bi-heart-fill double-like-heart"></i>
                                            )}
                                        </div>
                                        <div className="ultra-blog-content">
                                            <h3 className="ultra-blog-title">
                                                {blog.title}
                                            </h3>
                                            <p className="ultra-blog-desc">
                                                {blog.metaDescription?.slice(0, 110)}...
                                            </p>
                                            <div className="ultra-blog-actions">
                                                <Link
                                                    to={`/blog/${blog.slug}`}
                                                    className="garage-btn"
                                                >
                                                    Read Article
                                                    <i className="bi bi-arrow-right"></i>
                                                </Link>
                                                <button
                                                    className="glass-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        shareMyBlog(blog);
                                                    }}
                                                >
                                                    <i className="bi bi-share-fill"></i>
                                                </button>
                                                <button
                                                    className={`glass-btn like-btn ${isLiked
                                                        ? "liked"
                                                        : ""
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        likeAndAnimate(blog._id);
                                                    }}
                                                >
                                                    <i className={`bi ${isLiked
                                                        ? "bi-heart-fill"
                                                        : "bi-heart"
                                                        }`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
                }
            </div >
            <LoginDrawer ref={loginDrawerRef} />
        </div >
    );
};

export default Blog;