import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';

const AdminBlogs = () => {
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
                                                {item.status === "DRAFT" && (
                                                    <span className="badge bg-warning">Draft</span>
                                                )}
                                                {item.status === "PUBLISHED" && (
                                                    <span className="badge bg-success text-dark">Published</span>
                                                )}
                                                {item.status === "ARCHIVED" && (
                                                    <span className="badge bg-danger text-dark">Archived</span>
                                                )}
                                            </td>
                                            <td>{new Date(item.createdAt).toLocaleString()}</td>
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
