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
    const [generating, setGenerating] = useState(false);
    const [previewReel, setPreviewReel] = useState(false);

    const fetchJob = async () => {
        try {
            const res = await axios.get(`jobcard/admin/get-card/${id}`);
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

    useEffect(() => {
        fetchJob();
    }, [id]);

    const generateReel = async () => {
        try {
            setGenerating(true);

            const res = await axios.post(`/generate-reel/admin/${id}/generate-reel`, {
                template: "CINEMATIC",
            });

            if (res.data.success) {
                toast.success(res.data.message || "Reel generated successfully");
                await fetchJob();
            } else {
                toast.error(res.data.message || "Failed to generate reel");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error generating reel");
        } finally {
            setGenerating(false);
        }
    };

    const copyCaption = async () => {
        try {
            await navigator.clipboard.writeText(job?.reel?.caption || "");
            toast.success("Caption copied");
        } catch (error) {
            toast.error("Failed to copy caption");
        }
    };

    const downloadReel = async () => {
        try {
            const url = job?.reel?.video?.url;
            if (!url) return toast.error("Reel not available");

            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${job.jobCode}-rydax-reel.mp4`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error(error);
            toast.error("Failed to download reel");
        }
    };

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
                        <Link to={`/admin/job-cards/${id}/media`} className="btn btn-outline-success">
                            <i className="bi bi-images me-1"></i>
                            Manage Media
                        </Link>

                        <Link to={`/admin/job-cards/${id}/services`} className="btn btn-outline-success">
                            <i className="bi bi-tools me-1"></i>
                            Manage Services
                        </Link>

                        <button className="btn btn-outline-danger" onClick={() => navigate(-1)}>
                            <i className="bi bi-arrow-left"></i> Back
                        </button>
                    </div>
                </div>

                <div className="bg-dark text-white rounded p-3 mb-4 text-center">
                    <h6 className="mb-1">{job.jobCode}</h6>
                    <span className="badge bg-warning text-dark">
                        {job.progressPercent}% Completed · {job.status}
                    </span>
                </div>

                {/* REEL CONTROL PANEL */}
                <div className="bg-dark text-white rounded p-4 mb-4 border border-danger">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div>
                            <h5 className="mb-2">
                                <i className="bi bi-camera-reels text-danger me-2"></i>
                                Transformation Reel
                            </h5>

                            <p className="text-secondary mb-2">
                                Generate a premium reel from this job media for customer sharing.
                            </p>

                            <div className="d-flex flex-wrap gap-2">
                                <span className="badge bg-secondary">
                                    Status: {job.reel?.status || "NOT_GENERATED"}
                                </span>

                                {job.reel?.duration > 0 && (
                                    <span className="badge bg-info text-dark">
                                        Duration: {job.reel.duration}s
                                    </span>
                                )}

                                {job.reel?.generatedAt && (
                                    <span className="badge bg-success">
                                        Generated: {new Date(job.reel.generatedAt).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                            {job.reel?.status === "READY" && job.reel?.video?.url ? (
                                <>
                                    <button className="btn btn-success btn-sm" onClick={() => setPreviewReel(true)}>
                                        <i className="bi bi-play-circle me-1"></i>
                                        View Reel
                                    </button>

                                    <button className="btn btn-outline-info btn-sm" onClick={copyCaption}>
                                        <i className="bi bi-copy me-1"></i>
                                        Copy Caption
                                    </button>

                                    <button className="btn btn-outline-light btn-sm" onClick={downloadReel}>
                                        <i className="bi bi-download me-1"></i>
                                        Download
                                    </button>

                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={generateReel}
                                        disabled={generating}
                                    >
                                        {generating ? "Generating..." : "Regenerate"}
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={generateReel}
                                    disabled={generating}
                                >
                                    <i className="bi bi-camera-video me-1"></i>
                                    {generating ? "Generating Reel..." : "Generate Reel"}
                                </button>
                            )}
                        </div>
                    </div>

                    {job.reel?.caption && (
                        <div className="mt-3 p-3 rounded bg-black border border-secondary">
                            <small className="text-secondary d-block mb-2">Generated Caption</small>
                            <pre className="text-white mb-0" style={{ whiteSpace: "pre-wrap", fontSize: "13px" }}>
                                {job.reel.caption}
                            </pre>
                        </div>
                    )}
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

                                        <h4 className="text-info">
                                            {t.stage?.replaceAll("_", " ")}
                                        </h4>

                                        <p className="mb-0">
                                            {t.note || <span className="text-muted">No note added</span>}
                                        </p>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p className="text-center text-muted">No timeline updates found</p>
                    )}
                </div>
            </div>

            {previewReel && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ background: "rgba(0,0,0,.88)", zIndex: 99999 }}
                    onClick={() => setPreviewReel(false)}
                >
                    <div
                        className="bg-dark rounded p-3 position-relative"
                        style={{ width: "min(420px, 95vw)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="btn btn-sm btn-danger position-absolute"
                            style={{ top: "-12px", right: "-12px", borderRadius: "50%" }}
                            onClick={() => setPreviewReel(false)}
                        >
                            ×
                        </button>

                        <video
                            src={job.reel?.video?.url}
                            controls
                            autoPlay
                            style={{
                                width: "100%",
                                maxHeight: "75vh",
                                borderRadius: "12px",
                                background: "#000",
                            }}
                        />

                        <button className="btn btn-outline-info btn-sm w-100 mt-3" onClick={copyCaption}>
                            <i className="bi bi-copy me-1"></i>
                            Copy Caption
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminJobCardTimeLine;