import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout.jsx";
import toast from "react-hot-toast";

const STAGES = [
  "CHECK_IN",
  "INSPECTION",
  "WORK_STARTED",
  "PART_REPLACED",
  "QUALITY_CHECK",
  "READY",
  "DELIVERED"
];

const STAGE_PROGRESS = {
  CHECK_IN: 5,
  INSPECTION: 20,
  WORK_STARTED: 40,
  PART_REPLACED: 60,
  QUALITY_CHECK: 80,
  READY: 95,
  DELIVERED: 100
};

const AdminUpdateJobCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [form, setForm] = useState({
    stage: "",
    note: "",
    expectedDelivery: ""
  });
  const fetchJob = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/get-card/${id}`);
      if (res.data.success) {
        setJob(res.data.data);
        setForm({
          stage: res.data.data.currentStage,
          note: "",
          expectedDelivery:
            res.data.data.expectedDelivery?.slice(0, 10) || ""
        });
      }
    } catch (error) {
      toast.error("Failed to load job card");
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        stage: form.stage,
        note: form.note,
        progressPercent: STAGE_PROGRESS[form.stage],
        expectedDelivery: form.expectedDelivery
      };
      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/jobcard/${id}/progress`, payload);
      if (res.data.success) {
        toast.success("Job Updated");
        navigate("/admin/job-cards");
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (!job) return <AdminLayout>Loading...</AdminLayout>;
  return (
    <AdminLayout>
      <div className="container py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="section-title">
            <span className="first-letter">U</span>pdate Job Card
          </h4>
          <div className="d-flex gap-2">

            <button
              className="btn btn-outline-danger"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i> Back
            </button>
          </div>
        </div>

        <div className="card bg-dark text-white p-3 mb-3">
          <b>User:</b> {job.userId?.name} <br />
          <b>Car:</b> {job.carId?.brand} {job.carId?.model} <br />
          <b>Job Code:</b> {job.jobCode}
        </div>

        <form onSubmit={handleSubmit} className="card bg-dark text-white p-4">
          <div className="row mb-3">
            <div className="col-md-6">
              <label>Current Stage</label>
              <select
                className="form-control bg-dark text-white"
                value={form.stage}
                onChange={(e) =>
                  setForm({ ...form, stage: e.target.value })
                }
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label>Expected Delivery</label>
              <input
                type="date"
                className="form-control bg-dark text-white"
                value={form.expectedDelivery}
                onChange={(e) =>
                  setForm({ ...form, expectedDelivery: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <div className="mb-4">
            <label>Update Note</label>
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
          <button className="btn btn-success w-100">
            Update Job
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminUpdateJobCard;
