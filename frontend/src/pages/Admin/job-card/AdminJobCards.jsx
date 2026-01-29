import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminJobCards = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/get-job-cards`);
            setJobs(res.data.data || []);
        } catch (error) {
            toast.error("Error fetching Job Cards");
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredData = jobs.filter((job) =>
        job.jobCode?.toLowerCase().includes(search.toLowerCase()) ||
        job.carId?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
        job.carId?.brand?.toLowerCase().includes(search.toLowerCase()) ||
        job.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        job.userId?.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="container-fluid">
                <div className="bg-dark rounded p-4">

                    <h4 className="text-white border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
                        <span>
                            <i className="bi bi-card-checklist me-2"></i>
                            Job Cards Management
                        </span>

                        <div className="d-flex align-items-center gap-3">
                            <input
                                type="search"
                                className="form-control bg-dark text-white border-white"
                                placeholder="Search..."
                                style={{ width: "220px" }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <Link to="/admin/job-cards/create">
                                <button className="btn btn-outline-danger">
                                    <i className="bi bi-plus-circle me-1"></i>
                                    Create Job Card
                                </button>
                            </Link>
                        </div>
                    </h4>

                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <table className="table table-dark table-hover table-bordered align-middle">
                            <thead className="table-secondary text-dark sticky-top">
                                <tr>
                                    <th>#</th>
                                    <th>Job Code</th>
                                    <th>Customer</th>
                                    <th>Car</th>
                                    <th>Reg No</th>
                                    <th>Status</th>
                                    <th>Check-In</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((job, index) => (
                                        <tr key={job._id}>
                                            <td>{index + 1}</td>
                                            <td
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/admin/job-cards/${job._id}/timeline`);
                                                }}
                                            >
                                                {job.jobCode}
                                                <i className="bi bi-arrow-right-circle ms-2 text-info"></i>
                                            </td>
                                            <td>
                                                {job.userId?.name}<br />
                                                <small className="text-info">
                                                    {job.userId?.email}
                                                </small>
                                            </td>
                                            <td>
                                                {job.carId?.brand} {job.carId?.model}
                                            </td>
                                            <td>{job.carId?.registrationNumber}</td>
                                            <td>
                                                <span className="badge bg-warning text-dark">
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td>
                                                {job.checkInTime
                                                    ? new Date(job.checkInTime).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td className="text-center">
                                                {job.status !== "DELIVERED" && (
                                                    <Link
                                                        to={`/admin/job-cards/update/${job._id}`}
                                                        className="fa-solid fa-pen-to-square text-warning"
                                                        title="Edit Job"
                                                    />
                                                )}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-white">
                                            No Job Cards Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminJobCards;
