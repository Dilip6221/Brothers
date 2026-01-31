import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

const AdminJobMedia = () => {
    const { id } = useParams(); // jobId
    const navigate = useNavigate();

    const [media, setMedia] = useState([]);
    const [file, setFile] = useState(null);
    const [stage, setStage] = useState("");
    const [uploading, setUploading] = useState(false);

    const fetchMedia = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/job-cards/${id}/get-media`
            );
            setMedia(res.data.data || []);
        } catch {
            toast.error("Failed to load media");
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [id]);

    const uploadMedia = async () => {
        if (!file) return toast.error("Select file");
        if (!stage) return toast.error("Select stage");
        const formData = new FormData();
        formData.append("media", file);
        formData.append("stage", stage);

        try {
            setUploading(true);
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/job-cards/${id}/media`,
                formData
            );
            toast.success("Uploaded");
            setFile(null);
            setStage("");
            fetchMedia();
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const deleteMedia = async (mediaId) => {
        if (!window.confirm("Delete media?")) return;
        await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/job-cards/${id}/media/${mediaId}`
        );
        toast.success("Deleted");
        fetchMedia();
    };

    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="section-title">
                        <span className="first-letter">J</span>ob Media
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
                {/* UPLOAD */}
                <div className="card bg-dark p-3 mb-4">
                    <div className="row g-2">
                        <div className="col-md-6">
                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-control"
                                value={stage}
                                onChange={(e) => setStage(e.target.value)}
                            >
                                <option value="">Select Stage</option>
                                {STAGES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-success w-100"
                                onClick={uploadMedia}
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row g-3">
                    {media.length === 0 && (
                        <p className="text-center text-white">No media</p>
                    )}

                    {media.map((m) => (
                        <div className="col-md-3 col-sm-6" key={m._id}>
                            <div className="job-media-card">
                                <div className="media-wrapper">
                                    {m.mediaType === "video" ? (
                                        <video
                                            src={m.url}
                                            controls
                                            className="media-preview"
                                        />
                                    ) : (
                                        <img
                                            src={m.url}
                                            alt="job-media"
                                            className="media-preview"
                                        />
                                    )}

                                    {/* stage badge */}
                                    {m.stage && (
                                        <span className="stage-badge">
                                            {m.stage}
                                        </span>
                                    )}
                                </div>

                                <div className="media-footer">
                                    <button
                                        className="btn btn-sm btn-outline-danger w-100"
                                        onClick={() => deleteMedia(m._id)}
                                    >
                                        <i className="bi bi-trash me-1"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};
export default AdminJobMedia;