import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminLayout from "../AdminLayout.jsx";
import { useNavigate, useParams } from "react-router-dom";

const AdminCreateAboutTimeLine = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        year: "",
        title: "",
        description: "",
        order: 0
    });

    const [images, setImages] = useState([]); // new images
    const [preview, setPreview] = useState([]); // mixed preview (old + new)

    // 🔥 FETCH DATA
    const fetchTimeline = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/about-timeline/about-timeline/${id}`
            );
            if (res.data.success) {
                const data = res.data.data;
                setForm({
                    year: data.year,
                    title: data.title,
                    description: data.description,
                    order: data.order
                });
                setPreview(data.images || []);
            }
        } catch {
            toast.error("Failed to load timeline");
        }
    };

    useEffect(() => {
        if (isEdit) fetchTimeline();
    }, [id]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
        const previewUrls = files.map(file => ({
            url: URL.createObjectURL(file),
            isNew: true
        }));

        setPreview(prev => [...prev, ...previewUrls]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("year", form.year);
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("order", form.order);
            if (isEdit) {
                formData.append("id", id);
            }
            images.forEach((img) => {
                formData.append("images", img);
            });
            const url = isEdit
                ? `${import.meta.env.VITE_BACKEND_URL}/about-timeline/admin/update-about-timeline`
                : `${import.meta.env.VITE_BACKEND_URL}/about-timeline/admin/create-about-timeline`;

            const method = isEdit ? "put" : "post";
            const res = await axios({
                method,
                url,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/about-timeline");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <AdminLayout>
            <div className="container py-4">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="section-title">
                        <span className="first-letter">{isEdit ? "U" : "C"}</span>
                        {isEdit ? "pdate Timeline" : "reate Timeline"}
                    </h4>

                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => navigate("/admin/about-timeline")}
                    >
                        ← Back
                    </button>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="row g-3 bg-dark rounded text-white p-4"
                >

                    {/* Year */}
                    <div className="col-md-4">
                        <label className="form-label">Year *</label>
                        <input
                            type="text"
                            placeholder="Enter Year(Ex. 2025)"
                            className="form-control bg-dark text-white border-secondary"
                            value={form.year}
                            onChange={(e) =>
                                setForm({ ...form, year: e.target.value })
                            }
                        />
                    </div>

                    {/* Title */}
                    <div className="col-md-4">
                        <label className="form-label">Title *</label>
                        <input
                            type="text"
                            placeholder="Enter Title"
                            className="form-control bg-dark text-white border-secondary"
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />
                    </div>

                    {/* Order */}
                    <div className="col-md-4">
                        <label className="form-label">Order *</label>
                        <input
                            type="number"
                            placeholder="Enter Order"
                            className="form-control bg-dark text-white border-secondary"
                            value={form.order}
                            onChange={(e) =>
                                setForm({ ...form, order: e.target.value })
                            }
                        />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                        <textarea
                            rows={3}
                            placeholder="Enter Description"
                            className="form-control bg-dark text-white border-secondary"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <input
                            type="file"
                            multiple
                            className="form-control bg-dark text-white border-secondary"
                            onChange={handleImageChange}
                        />
                        <div className="d-flex gap-3 mt-3 flex-wrap">
                            {preview.map((img, index) => (
                                <div
                                    key={index}
                                    style={{ position: "relative" }}
                                >
                                    <img
                                        src={img.url || img}
                                        alt=""
                                        width="100"
                                        height="100"
                                        className="rounded"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Submit */}
                    <div className="col-12">
                        <button className="btn btn-primary">
                            {isEdit ? "Update Timeline" : "Create Timeline"}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminCreateAboutTimeLine;