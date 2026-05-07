import React, { useEffect, useState, useRef } from "react";
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
    status: "ACTIVE",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  // ================= FETCH FOR EDIT =================
  const fetchService = async () => {
    try {
      const res = await axios.get(`service/get-service/${id}`);
      if (res.data.success) {
        const s = res.data.data;
        setForm({
          title: s.title,
          shortDescription: s.shortDescription,
          description: s.description,
          icon: s.icon || "",
          category: s.category || "",
          duration: s.duration || "",
          status: s.status,
        });
        if (s.image?.url) {
          setPreview(s.image.url);
        }
      }
    } catch {
      toast.error("Failed to load service");
    }
  };

  useEffect(() => {
    if (isEdit) fetchService();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (image) {
        formData.append("image", image);
      }
      if (isEdit) {
        formData.append("id", id);
      }
      const res = await axios.post(
        "service/admin/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
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
      
      <div className="container ">
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
              placeholder="e.g. Full Service"
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
              placeholder="e.g. Engine"
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
              placeholder="e.g. 3 Days"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>

          {/* SHORT DESCRIPTION */}
          <div className="col-md-6">
            <label className="form-label">Short Description *</label>
            <textarea
              className="form-control bg-dark text-white border-secondary"
              placeholder="A short summary shown on listing"
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
              placeholder="Detailed description for the service"
              rows="2"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>

          {/* ICON */}
          <div className="col-md-4">
            <label className="form-label">Icon (class / url)</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="e.g. bi bi-tools or https://..."
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
          </div>

         {/* STATUS */}
          <div className="col-md-4">
            <label className="form-label">Status</label>
            <div className="position-relative">
              <select
                className="form-control bg-dark text-white border-secondary pe-5"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <span className="position-absolute end-0 top-50 translate-middle-y pe-3 text-white-50" style={{pointerEvents: 'none'}}>
                <i className="bi bi-chevron-down"></i>
              </span>
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label">Service Image</label>
            <input
              ref={fileInputRef}
              type="file"
              className="form-control bg-dark text-white border-secondary"
              onChange={handleImageChange}
            />
          </div>

          {preview && (
            <div className="col-md-6 d-flex align-items-start gap-2">
              <img
                src={preview}
                alt="preview"
                style={{ width: "200px", marginTop: "10px", borderRadius: 6 }}
              />
              <div className="d-flex flex-column mt-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary mb-2"
                  onClick={() => {
                    setImage(null);
                    setPreview("");
                    if (fileInputRef.current) fileInputRef.current.value = null;
                  }}
                >
                  Remove Image
                </button>
                <a href={preview} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light">Open Image</a>
              </div>
            </div>
          )}
          <div className="col-12 d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/admin/services')}>Cancel</button>
            <button type="submit" className="btn btn-danger">
              <i className="bi bi-plus-circle me-2"></i>
              {isEdit ? "Update Service" : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateService;
