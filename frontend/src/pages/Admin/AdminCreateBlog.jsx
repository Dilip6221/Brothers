import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import { Navigate, useNavigate } from "react-router-dom";
import TextEditor from "../../component/Admin/TextEditor";

const AdminCreateBlog = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        slug: "",
        category: "",
        tags: "",
        status: "DRAFT",
        thumbnail: "",
        content: ""   // Editor data store hoga
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                tags: form.tags.split(",").map(tag => tag.trim())
            };
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/admin/create-blog`, payload);
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/blogs");
            } else {
                toast.error(res.data.message);
            }
            window.dispatchEvent(new Event("ourBlogClick"));
        } catch (err) {
            toast.error("Failed to create blog");
        }
    };

    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">

                    {/* Title */}
                    <h3 className="text-white mb-0">Create New Blog</h3>

                    {/* Back Button */}
                    <button type="button" className="btn btn-outline-light d-flex align-items-center gap-2" onClick={() => navigate("/admin/blogs")}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>

                <form className="row g-3 bg-dark rounded text-white p-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter Blog title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter Slug" onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter category" onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    </div>

                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter Metatitle" onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter MetaDescription" onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter Tags" onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                    </div>

                    <div className="col-md-4">
                        <select className="form-control bg-dark text-white border-secondary shadow-none"
                            onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter thumbnail" onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
                    </div>

                    <TextEditor onChange={(value) => setForm({ ...form, content: value })} />
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Preview</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminCreateBlog;
