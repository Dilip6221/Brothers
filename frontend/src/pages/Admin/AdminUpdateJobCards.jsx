import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";

const AdminUpdateJobCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  const [form, setForm] = useState({
    status: "",
    progressPercent: 0,
    expectedDelivery: "",
    note: ""
  });

  const fetchJob = async () => {
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/get-card/${id}`);
      if (res.data.success) {
        const j = res.data.data;
        setJob(j);
        setForm({
          status: j.status,
          progressPercent: j.progressPercent || 0,
          expectedDelivery: j.expectedDelivery?.slice(0, 10) || "",
          note: ""
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to load job card");
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
      e.preventDefault();
          try {
      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/jobcard/${id}/progress`, form);

      if (res.data.success) {
        toast.success("Job Card Updated Successfully");
        navigate("/admin/job-cards");
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to update job card");
    }
  };

  if (!job) {
    return (
      <AdminLayout>
        <div className="container py-4 text-white">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container py-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="section-title">
            <span className="first-letter">U</span>pdate Job Card
          </h4>
          <button type="button" className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={() => navigate("/admin/job-cards")}>
              <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>

        {/* BASIC INFO */}
        <div className="card bg-dark text-white p-3 mb-3">
          <b>User:</b> {job.userId?.name} <br />
          <b>Car:</b> {job.carId?.brand} {job.carId?.model} (
          {job.carId?.registrationNumber})
          <br />
          <b>Job Code:</b> {job.jobCode}
        </div>

        {/* UPDATE FORM */}
        <form onSubmit={handleSubmit} className="card bg-dark text-white p-4">

          {/* STATUS */}
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-control bg-dark text-white"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="PENDING">PENDING</option>
              <option value="PROGRESS">PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* PROGRESS */}
          <div className="mb-3">
            <label className="form-label">Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="form-control bg-dark text-white"
              value={form.progressPercent}
              onChange={(e) =>
                setForm({ ...form, progressPercent: Number(e.target.value) })
              }
            />
          </div>

          {/* EXPECTED DELIVERY */}
          <div className="mb-3">
            <label className="form-label">Expected Delivery</label>
            <input
              type="date"
              className="form-control bg-dark text-white"
              value={form.expectedDelivery}
              onChange={(e) =>
                setForm({ ...form, expectedDelivery: e.target.value })
              }
            />
          </div>

          {/* TIMELINE NOTE */}
          <div className="mb-4">
            <label className="form-label">Update Note</label>
            <textarea
              rows="2"
              className="form-control bg-dark text-white"
              placeholder="e.g. Inspection completed"
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
            />
          </div>

          <button className="btn btn-success">
            Update Job Card
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminUpdateJobCard;
