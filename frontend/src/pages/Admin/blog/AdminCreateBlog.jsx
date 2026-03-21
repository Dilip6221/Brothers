import React, { useState,useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminLayout from "../AdminLayout.jsx";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../../component/Admin/TextEditor.jsx";

const AdminCreateBlog = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        title: "",
        category: "",
        tags: "",
        metaTitle: "",
        metaDescription: "",
        thumbnail: null,
        content: ""
    });

    const [preview, setPreview] = useState("");

    const fetchBlog = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blog/blogs/${id}`
            );
            if (res.data.success) {
                const b = res.data.data;
                setForm({
                    title: b.title || "",
                    category: b.category || "",
                    tags: b.tags?.join(", ") || "",
                    metaTitle: b.metaTitle || "",
                    metaDescription: b.metaDescription || "",
                    thumbnail: null,
                    content: b.contentHTML || ""
                });
                setPreview(b.thumbnail?.url || "");
            }
        } catch {
            toast.error("Failed to load blog");
        }
    };
    useEffect(() => {
        if (isEdit) fetchBlog();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("category", form.category);
            formData.append("metaTitle", form.metaTitle);
            formData.append("metaDescription", form.metaDescription);
            formData.append("content", form.content);
            form.tags.split(",").forEach(tag => {
                if (tag.trim()) {
                    formData.append("tags[]", tag.trim());
                }
            });
            if (isEdit) {
                formData.append("id", id);
            }
            if (form.thumbnail) {
                formData.append("image", form.thumbnail);
            }
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/admin/create-blog`,
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"}
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/blogs");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error submitting the form");
        }
    };

    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="section-title">
                        <span className="first-letter">{isEdit ? "U" : "C"}</span>
                        {isEdit ? "pdate Blog" : "reate Blog"}
                    </h4>
                    <button className="btn btn-outline-danger" onClick={() => navigate("/admin/blogs")}>
                        ← Back
                    </button>
                </div>
                <form
                    className="row g-3 bg-dark rounded text-white p-3"
                    onSubmit={handleSubmit}
                >
                    {/* Title */}
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control bg-dark text-white border-secondary"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />
                    </div>

                    {/* Category */}
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control bg-dark text-white border-secondary"
                            placeholder="Category"
                            value={form.category}
                            onChange={(e) =>
                                setForm({ ...form, category: e.target.value })
                            }
                        />
                    </div>

                    {/* Meta Title */}
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control bg-dark text-white border-secondary"
                            placeholder="Meta Title"
                            value={form.metaTitle}
                            onChange={(e) =>
                                setForm({ ...form, metaTitle: e.target.value })
                            }
                        />
                    </div>

                    {/* Meta Description */}
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control bg-dark text-white border-secondary"
                            placeholder="Meta Description"
                            value={form.metaDescription}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    metaDescription: e.target.value
                                })
                            }
                        />
                    </div>

                    {/* Tags */}
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control bg-dark text-white border-secondary"
                            placeholder="Tags (comma separated)"
                            value={form.tags}
                            onChange={(e) =>
                                setForm({ ...form, tags: e.target.value })
                            }
                        />
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="col-md-4">
                        <input
                            type="file"
                            className="form-control bg-dark text-white border-secondary"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setForm({ ...form, thumbnail: file });
                                if (file) {
                                    setPreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                className="mt-2 rounded"
                                width="120"
                            />
                        )}
                    </div>

                    {/* Content */}
                    <div className="col-12 mt-4">
                        <h5>✍️ Blog Content</h5>
                        <div
                            style={{
                                border: "1px solid #444",
                                borderRadius: "8px",
                                padding: "10px",
                                background: "#0f0f0f"
                            }}
                        >
                            <TextEditor
                                value={form.content}
                                onChange={(value) =>
                                    setForm({ ...form, content: value })
                                }
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="col-12">
                        <button className="btn btn-primary">
                            {isEdit ? "Update Blog" : "Create Blog"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminCreateBlog;