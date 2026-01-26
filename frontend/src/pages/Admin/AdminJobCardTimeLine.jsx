import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";

const AdminJobCardTimeLine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/get-card/${id}`);
                if (res.data.success) setJob(res.data.data);
                else toast.error(res.data.message);
            } catch {
                toast.error("Failed to load job card timeline");
            }
        };
        fetchJob();
    }, [id]);

    if (!job) return <AdminLayout><p className="text-white p-4">Loading...</p></AdminLayout>;

    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="section-title">
                        <span className="first-letter">J</span>ob Timeline
                    </h4>
                    
                    <button type="button" className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
                <span className="about-badge d-block text-center mx-auto mb-3 fs-6">
                    {job.jobCode} - ({job.progressPercent}% COMPLETED)
                </span>
                <div className="timeline">
                    {job.timeline
                        .slice()
                        .reverse()
                        .map((t, idx) => (
                            <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                                <div className="timeline-content">
                                    <span className="year">{new Date(t.updatedAt).toLocaleString()}</span>
                                    <h4>{t.status}</h4>
                                    <p>{t.note}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </AdminLayout>
    );
};
export default AdminJobCardTimeLine;
