import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../AdminLayout.jsx";
import toast from "react-hot-toast";

const AdminJobCardTimeLine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/get-card/${id}`);
                if (res.data.success) {
                    setJob(res.data.data);
                } else {
                    toast.error(res.data.message || "Job not found");
                }
            } catch (error) {
                toast.error("Failed to load job card timeline");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);
    if (loading) {
        return (
            <AdminLayout>
                <div className="text-center text-white p-5">Loading timeline...</div>
            </AdminLayout>
        );
    }

    if (!job) {
        return (
            <AdminLayout>
                <div className="text-center text-danger p-5">Job not found</div>
            </AdminLayout>
        );
    }
    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="section-title">
                        <span className="first-letter">J</span>ob Timeline
                    </h4>
                    <div className="d-flex gap-2">
                        <Link to={`/admin/job-cards/${id}/media`} className="btn btn-outline-success" >
                            <i className="bi bi-tools me-1"></i>
                            Manage Media
                        </Link>
                        <Link to={`/admin/job-cards/${id}/services`} className="btn btn-outline-success">
                            <i className="bi bi-tools me-1"></i>
                            Manage Services
                        </Link>
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left"></i> Back
                        </button>
                    </div>
                </div>
                <div className="bg-dark text-white rounded p-3 mb-4 text-center">
                    <h6 className="mb-1">{job.jobCode}</h6>
                    <span className="badge bg-warning text-dark">
                        {job.progressPercent}% Completed
                    </span>
                </div>
                {/* Timeline */}
                <div className="timeline">
                    {job.timeline?.length > 0 ? (
                        job.timeline
                            .slice()
                            .reverse()
                            .map((t, idx) => (
                                <div
                                    key={idx}
                                    className={`timeline-item ${idx % 2 === 0 ? "left" : "right"}`}
                                >
                                    <div className="timeline-content">
                                        <span className="year">
                                            {new Date(t.updatedAt).toLocaleString()}
                                        </span>
                                        <h4>{t.status}</h4>
                                        <p className="mb-0">{t.note || "-"}</p>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p className="text-center text-muted">
                            No timeline updates found
                        </p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};
export default AdminJobCardTimeLine;
