import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../component/Admin/TextEditor";
import { useEffect } from "react";

const AdminCreateBlog = () => {
    const navigate = useNavigate();

    const { id } = useParams(); // ID => update mode
    const [form, setForm] = useState({
        title: "",
        slug: "",
        category: "",
        tags: "",
        metaTitle: "",
        metaDescription: "",
        // status: "DRAFT",
        thumbnail: "",
        content: ""
    });
    const isEdit = Boolean(id);
    const fetchBlog = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blog/blogs/${id}`);
            if (res.data.success) {
                const b = res.data.data;
                setForm({
                    title: b.title,
                    slug: b.slug,
                    category: b.category,
                    tags: b.tags?.join(", "),
                    metaTitle: b.metaTitle,
                    metaDescription: b.metaDescription,
                    // status: b.status,
                    thumbnail: b.thumbnail,
                    content: b.contentHTML
                });
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
            const payload = {
                ...form,
                id: isEdit ? id : undefined,
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
                    <h4 className="section-title">
                        <span className="first-letter">{isEdit ? "U" : "C"}</span>
                        {isEdit ? "pdate Blog" : "reate Blog"}
                    </h4>
                    <button type="button" className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={() => navigate("/admin/blogs")}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
                <form className="row g-3 bg-dark rounded text-white p-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter Blog title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </div>
                    
                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    </div>

                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter Metatitle" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter MetaDescription" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter Tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                    </div>

                    {/* <div className="col-md-4">
                        <select className="form-control bg-dark text-white border-secondary shadow-none" value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div> */}

                    <div className="col-md-4">
                        <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" placeholder="Enter thumbnail" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
                    </div>

                    <div className="col-12 mt-4">
                        <h5 className="mb-2 border-bottom pb-2">✍️ Blog Content</h5>
                        <div
                            style={{
                                border: "1px solid #444",
                                borderRadius: "8px",
                                padding: "10px",
                                background: "#0f0f0f",
                            }}
                        >
                            <TextEditor value={form.content} onChange={(value) => setForm({ ...form, content: value })} />
                        </div>
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Save </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminCreateBlog;
