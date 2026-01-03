import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';

const AdminServiceList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [service, setService] = useState([]);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/service/admin/services`);
            setService(res.data.data);
        } catch (error) {
            toast.error("Error fetching service data");
        }
    };
    useEffect(() => {
        fetchData();
        const handler = () => fetchData();
        window.addEventListener("ourServiceClick", handler);
        return () => window.removeEventListener("ourServiceClick", handler);
    }, []);
    /* On change status */
    // const handleStatusChange = async (serviceId, newStatus) => {
    //     try {
    //         const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/service/admin/update-status`,{ id: serviceId,newStatus });
    //         if (res.data.success) {
    //             toast.success(res.data.message);
    //             fetchData();
    //         } else {
    //             toast.error(res.data.message);
    //         }
    //     } catch (err) {
    //         toast.error("Failed to update status");
    //     }
    // };

    // Filter blogs based on search input
    const filteredBlogs = (service || []).filter(item => {
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
                    <h4 className="text-white border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
                        <span>
                            <i className="bi bi-envelope-arrow-up-fill me-2"></i>
                            Our Services
                        </span>
                        <div className="d-flex align-items-center gap-3">
                            <div className="input-group" style={{ width: "200px" }}>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-white"
                                    name="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Link to="/admin/services/create-service" className="text-decoration-none">
                                <button className="btn btn-outline-danger d-flex align-items-center gap-2 px-3"> <i className="bi bi-plus-circle"></i>Create</button>
                            </Link>
                        </div>
                    </h4>
                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <table className="table table-dark table-hover table-bordered align-middle">
                            <thead className="table-secondary text-dark sticky-top">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Slug</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>DiscountPrice</th>
                                    <th>IsFeatured</th>
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
                                            <td>{item.price}</td>
                                            <td>{item.discountPrice}</td>
                                            <td>{item.isFeatured ? "Yes" : "No"}</td>
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

export default AdminServiceList;
