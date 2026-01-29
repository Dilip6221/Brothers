import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AdminCreateService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    icon: "",
    category: "",
    duration: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    status: "ACTIVE",
  });

  // ================= FETCH FOR EDIT =================
  const fetchService = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/service/get-service/${id}`);
      if (res.data.success) {
        const s = res.data.data;
        setForm({
          title: s.title,
          shortDescription: s.shortDescription,
          description: s.description,
          icon: s.icon || "",
          category: s.category || "",
          duration: s.duration || "",
          metaTitle: s.metaTitle || "",
          metaDescription: s.metaDescription || "",
          metaKeywords: s.metaKeywords?.join(", ") || "",
          status: s.status,
        });
      }
    } catch {
      toast.error("Failed to load service");
    }
  };

  useEffect(() => {
    if (isEdit) fetchService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      metaKeywords: form.metaKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      id: isEdit ? id : undefined,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/service/admin/create`,
        payload
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/services");
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to save service");
    }
  };

  return (
    <AdminLayout>
      
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="section-title">
              <span className="first-letter">{isEdit ? "E" : "C"}</span>
              {isEdit ? "dit Service" : "reate Service"}
          </h4>
          <button type="button" className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={() => navigate("/admin/services")}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>

        <form
          className="row g-3 bg-dark rounded text-white p-4"
          onSubmit={handleSubmit}
        >
          {/* TITLE */}
          <div className="col-md-4">
            <label className="form-label">Service Title *</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* CATEGORY */}
          <div className="col-md-4">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
           {/* DURATION */}
          <div className="col-md-4">
            <label className="form-label">Duration</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Eg: 3 Days"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>

          {/* SHORT DESCRIPTION */}
          <div className="col-md-6">
            <label className="form-label">Short Description *</label>
            <textarea
              className="form-control bg-dark text-white border-secondary"
              rows="2"
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="col-md-6">
            <label className="form-label">Full Description *</label>
            <textarea
              className="form-control bg-dark text-white border-secondary"
              rows="2"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>

          {/* ICON */}
          <div className="col-md-6">
            <label className="form-label">Icon (class / url)</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
          </div>

         {/* STATUS */}
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              className="form-control bg-dark text-white border-secondary"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* SEO */}
          <div className="col-md-6">
            <label className="form-label">Meta Title</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Meta Keywords (comma separated)</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              value={form.metaKeywords}
              onChange={(e) =>
                setForm({ ...form, metaKeywords: e.target.value })
              }
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Meta Description</label>
            <textarea
              className="form-control bg-dark text-white border-secondary"
              rows="2"
              value={form.metaDescription}
              onChange={(e) =>
                setForm({ ...form, metaDescription: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Update Service" : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateService;
