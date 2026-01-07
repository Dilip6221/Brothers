import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminGallery = () => {
    const [images, setImages] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);// For display Gallery create model
    const [newImage, setNewImage] = useState({//Create new user
        title: "",
        service: "",
        file: null,
    });

    const fetchData = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/gallery/gallery`
            );
            setImages(res.data.data || []);
        } catch (error) {
            toast.error("Error fetching gallery data");
        }
    };
    const deleteGalleryImage = (id) => async () => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;
        try {
            const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/gallery/admin/${id}`);
            if (res.data.success) {
                toast.success(res.data.message);
                fetchData();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Error deleting image");
        }
    };

    const handleUploadImage = async (e) => {
        e.preventDefault();
        if (!newImage.file) {
            toast.error("Please select an image");
            return;
        }
        const formData = new FormData();
        formData.append("title", newImage.title);
        formData.append("service", newImage.service);
        formData.append("file", newImage.file);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/gallery/admin/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                setShowCreateModal(false);
                setNewImage({ title: "", service: "", file: null });
                fetchData();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Creation failed.");
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AdminLayout>
            <div className="container-fluid">
                <div className="bg-dark rounded p-4">
                    <h4 className="text-white border-bottom pb-2 mb-3 d-flex align-items-center">
                        <span className="d-flex align-items-center gap-2">
                            <i className="bi bi-images"></i>
                            Our Gallery
                        </span>

                        {/* push button to last */}
                        <div className="ms-auto">
                            <button className="btn btn-outline-danger d-flex align-items-center gap-2 px-3" onClick={() => { setShowCreateModal(true); }}>
                                <i className="bi bi-plus-circle"></i>
                                Upload New Image
                            </button>
                        </div>
                    </h4>
                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <table className="table table-dark table-hover table-bordered align-middle">
                            <thead className="table-secondary text-dark sticky-top">
                                <tr>
                                    <th>#</th>
                                    <th>Service</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {images.length > 0 ? (
                                    images.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>{item.service}</td>
                                            <td>{item.title || "-"}</td>
                                            <td>
                                                {item.isActive ? (
                                                    <span className="badge bg-success">ACTIVE</span>
                                                ) : (
                                                    <span className="badge bg-danger">INACTIVE</span>
                                                )}
                                            </td>
                                            <td>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="text-center">
                                                <i
                                                    onClick={deleteGalleryImage(item._id)}
                                                    className="bi bi-trash text-danger"
                                                    style={{ cursor: "pointer", fontSize: "18px" }}
                                                    title="Delete"
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
            {showCreateModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.7)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white border-secondary">

                            {/* Header */}
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">
                                    <i className="bi bi-person-plus me-2 text-info"></i>
                                    Upload New Image
                                </h5>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowCreateModal(false)}
                                ></button>
                            </div>

                            {/* Body */}
                            <div className="modal-body">

                                <div className="mb-3">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newImage.title}
                                        onChange={(e) =>
                                            setNewImage({ ...newImage, title: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Service</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newImage.service}
                                        onChange={(e) =>
                                            setNewImage({ ...newImage, service: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Upload Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) =>
                                            setNewImage({ ...newImage, file: e.target.files[0] })
                                        }
                                    />
                                </div>


                            </div>

                            {/* Footer */}
                            <div className="modal-footer border-secondary">
                                <button className="btn btn-danger" onClick={handleUploadImage}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminGallery;
