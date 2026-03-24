import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminAboutTimeLine = () => {
    const navigate = useNavigate();
    const [timeline, setTimeline] = useState([]);
    const [search, setSearch] = useState("");
    const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/about-timeline/about-timeline`);
            setTimeline(res.data.data);
        } catch (error) {
            toast.error("Error fetching timeline data");
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const filteredData = (timeline || []).filter((item) => {
        if (!search.trim()) return true;
        const text = search.toLowerCase();
        return (
            item.year?.toLowerCase().includes(text) ||
            item.title?.toLowerCase().includes(text) ||
            item.description?.toLowerCase().includes(text)
        );
    });
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete?")) return;
        try {
            const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/about-timeline/admin/delete-about-timeline/${id}`);
            if (res.data.success) {
                toast.success(res.data.message);
                fetchData();
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Delete failed");
        }
    };
    const handleDeleteImage = async (timelineId, public_id) => {
        if (!window.confirm("Delete this image?")) return;

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/about-timeline/admin/delete-timeline-image`, { timelineId, public_id });
            if (res.data.success) {
                toast.success("Image deleted");
                fetchData();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Image delete failed");
        }
    };

    return (
        <AdminLayout>
            <div className="container-fluid">
                <div className="bg-dark rounded p-4">
                    <h4 className="text-white border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
                        <span>
                            <i className="bi bi-clock-history me-2"></i>
                            Timeline Management
                        </span>
                        <div className="d-flex align-items-center gap-3">
                            {/* Search */}
                            <div className="input-group" style={{ width: "200px" }}>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-white"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            {/* Create */}
                            <Link to="/admin/about-timeline/create" className="text-decoration-none">
                                <button className="btn btn-outline-danger d-flex align-items-center gap-2 px-3">
                                    <i className="bi bi-plus-circle"></i>
                                    Create
                                </button>
                            </Link>
                        </div>
                    </h4>

                    {/* Table */}
                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <table className="table table-dark table-hover table-bordered align-middle">

                            <thead className="table-secondary text-dark sticky-top">
                                <tr>
                                    <th>#</th>
                                    <th>Year</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Images</th>
                                    <th>Order</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>{item.year}</td>
                                            <td>{item.title}</td>

                                            {/* Short description */}
                                            <td style={{ maxWidth: "250px" }}>
                                                {item.description?.slice(0, 60)}...
                                            </td>

                                            {/* Images preview */}
                                            <td>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    {item.images?.map((img, i) => (
                                                        <div key={i} style={{ position: "relative" }}>
                                                            <img
                                                                src={img.url}
                                                                alt=""
                                                                width="50"
                                                                height="50"
                                                                style={{ objectFit: "cover" }}
                                                                className="rounded"
                                                            />
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteImage(item._id, img.public_id)
                                                                }
                                                                style={{
                                                                    position: "absolute",
                                                                    top: "-6px",
                                                                    right: "-2px",
                                                                    background: "white",
                                                                    color: "black",
                                                                    border: "none",
                                                                    borderRadius: "50%",
                                                                    width: "15px",
                                                                    height: "15px",
                                                                    fontSize: "10px",
                                                                    cursor: "pointer"
                                                                }}
                                                            >
                                                                ×
                                                            </button>

                                                        </div>
                                                    ))}

                                                </div>
                                            </td>
                                            <td>{item.order}</td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-3">
                                                    <i
                                                        className="fa-solid fa-pen-to-square text-warning"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() =>
                                                            navigate(`/admin/about-timeline/edit/${item._id}`)
                                                        }
                                                    ></i>
                                                    {/* Delete */}
                                                    <i
                                                        className="fa-solid fa-trash text-danger"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleDelete(item._id)}
                                                    ></i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-white">
                                            No Timeline Found...
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

export default AdminAboutTimeLine;