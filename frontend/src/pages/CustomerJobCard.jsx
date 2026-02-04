import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext.jsx";
// import "./CustomerJobCard.css";

const CustomerJobCard = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(UserContext);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobCard();
    }, [carId]);

    const fetchJobCard = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/jobcard/customer/job-card/${carId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data.success) setJob(res.data.data);
            // else toast.error(res.data.message);
        } catch {
            toast.error("Failed to load job card");
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return <div className="text-center text-white py-5">Loading...</div>;

    if (!job)
        return (
            <div className="bg-black text-white">
                <div className="container pb-5">
                    <div className="row">
                        <div className="col-12 text-center py-5">
                            <div className="empty-blog-box">
                                <div className="empty-icon">
                                    <i className="bi bi-car-front-fill"></i>
                                </div>
                                <h3 className="mt-3">No Active Job Card</h3>
                                <p className="empty-text">
                                    Your car is currently not in service.
                                    <br />
                                    Once a job starts, you’ll see updates, media & progress here.
                                </p>
                                <Link to="/my-car-vault" className="btn mt-2" style={{ background: "#ff6600", fontWeight: 500 }}>
                                    Back to My Car Vault →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    return (
        <>
            <div className="bg-black text-white py-5 text-center">
                <span className="about-badge">Job Card ({job.jobCode})</span>
                <h3 className="section-title section-title-small">
                    <span className="first-letter">S</span>ervice Progress
                </h3>
                <p className="text-secondary fs-5 mt-2">
                    Track your car’s service journey
                </p>
            </div>

            <div className="container py-4">
                <div className="job-summary-card mb-5">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                            <p className="text-secondary mb-0">Current Status</p>
                        </div>
                        <span className={`job-status ${job.status.toLowerCase()}`}>
                            {job.status}
                        </span>
                    </div>
                    <div className="progress mt-4 job-progress">
                        <div
                            className="progress-bar"
                            style={{ width: `${job.progressPercent}%` }}
                        >
                            {job.progressPercent}%
                        </div>
                    </div>
                </div>
                <h5 className="section-subtitle">Service Timeline</h5>
                <div className="timeline-compact">
                    {job.timeline.map((t, i) => (
                        <div className="timeline-row" key={i}>
                            <span className="timeline-dot"></span>
                            <div className="timeline-box">
                                <div className="timeline-header">
                                    <h6>{t.stage.replace("_", " ")}</h6>
                                    <span>
                                        {new Date(t.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {t.note && (
                                    <p className="timeline-note">{t.note}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <h5 className="section-subtitle mt-5">Work Gallery</h5>
                <div className="row g-3">
                    {job.media.map(m => (
                        <div className="col-6 col-md-4 col-lg-3" key={m._id}>
                            <div className="media-card">
                                {m.mediaType === "video" ? (
                                    <video src={m.url} controls />
                                ) : (
                                    <img src={m.url} alt="Work media" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CustomerJobCard;
