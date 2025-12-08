import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';

const AdminBlogs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/admin/blogs`);
            setBlogs(res.data.data);
        } catch (error) {
            toast.error("Error fetching blog data");
        }
    };
    useEffect(() => {
        fetchData();
        const handler = () => fetchData();
        window.addEventListener("ourBlogClick", handler);
        return () => window.removeEventListener("ourBlogClick", handler);
    }, []);
    /* On change status */
    const handleStatusChange = async (blogId, newStatus) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/admin/update-status`,{ id: blogId,newStatus });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchData();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    // Filter blogs based on search input
    const filteredBlogs = (blogs || []).filter(item => {
        if (!search.trim()) return true;
        const text = search.toLowerCase();
        return (
            item.title?.toLowerCase().includes(text) ||
            item.slug?.toLowerCase().includes(text) ||
            item.category?.toLowerCase().includes(text) ||
            item.status?.toLowerCase().includes(text)
        );
    });

    return (
        <AdminLayout>
            <div className="container-fluid">
                <div className="bg-dark rounded p-4">
                    <h4 className="text-white border-bottom pb-2 mb-5 d-flex justify-content-between align-items-center">
                        <span>
                            <i className="bi bi-envelope-arrow-up-fill me-2"></i>
                            Our Blogs
                        </span>
                        <div className="d-flex align-items-center gap-3">
                            <div className="input-group" style={{ width: "200px" }}>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-danger"
                                    name="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Link to="/admin/blogs/create" className="text-decoration-none">
                                <button className="btn btn-outline-danger d-flex align-items-center gap-2 px-3"> <i className="bi bi-plus-circle"></i>Create</button>
                            </Link>
                        </div>
                    </h4>
                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <table className="table table-dark table-hover table-bordered align-middle">
                            <thead className="table-secondary text-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Slug</th>
                                    <th>Category</th>
                                    <th>Tags</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBlogs.length > 0 ? (
                                    filteredBlogs.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.title}</td>
                                            <td>{item.slug}</td>
                                            <td>{item.category}</td>
                                            <td>{item.tags?.join(", ")}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-1">
                                                    <div className="dropdown">
                                                        <button
                                                            className={`btn btn-sm dropdown-toggle d-flex align-items-center justify-content-between`}
                                                            type="button"
                                                            id={`statusDropdown${item._id}`}
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                            style={{
                                                                backgroundColor:item.status === "DRAFT" ? "#ffc107": item.status === "PUBLISHED"? "#198754": "black",
                                                                color: 'white',
                                                                minWidth: "90px",
                                                            }}
                                                        >
                                                            {item.status}
                                                        </button>

                                                        <ul className="dropdown-menu" aria-labelledby={`statusDropdown${item._id}`}>
                                                            {item.status !== "DRAFT" && (
                                                                <li>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        onClick={() => handleStatusChange(item._id, "DRAFT")}
                                                                    >
                                                                        DRAFT
                                                                    </button>
                                                                </li>
                                                            )}
                                                            {item.status !== "PUBLISHED" && (
                                                                <li>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        onClick={() => handleStatusChange(item._id, "PUBLISHED")}
                                                                    >
                                                                        PUBLISHED
                                                                    </button>
                                                                </li>
                                                            )}
                                                            {item.status !== "ARCHIVED" && (
                                                                <li>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        onClick={() => handleStatusChange(item._id, "ARCHIVED")}
                                                                    >
                                                                        ARCHIVED
                                                                    </button>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{new Date(item.createdAt).toLocaleString()}</td>
                                            <td className="text-center">
                                                <i
                                                    className="fa-solid fa-pen-to-square text-warning"
                                                    style={{ cursor: "pointer", fontSize: "18px" }}
                                                    onClick={() => navigate(`/admin/blogs/edit/${item._id}`)}
                                                ></i>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-white">
                                            No Data Found...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminBlogs;
