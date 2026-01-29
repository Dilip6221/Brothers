import React, { useState } from "react";
import AdminLayout from "../AdminLayout.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";

const AdminCreateUserCars = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        userId: "",
        brand: "",
        model: "",
        year: "",
        color: "",
        registrationNumber: "",
        vinNumber: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.userId) {
            toast.error("Please select customer");
            return;
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/user-cars/create`,
                {
                    ...form,
                    year: Number(form.year) // IMPORTANT
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/user-cars");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create car");
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/admin/user-data`);
            setUsers(res.data.data || []);
        } catch (error) {
            toast.error("Error fetching User Cars data");
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="section-title">
                        <span className="first-letter">C</span>
                        reate User Car
                    </h4>

                    <button type="button" className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={() => navigate("/admin/user-cars")}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
                <form className="row g-3 bg-dark rounded text-white p-4" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label className="form-label">Customer</label>
                        <select onChange={(e) => setForm({ ...form, userId: e.target.value })} className="form-control bg-dark text-white">
                            <option value="">Select Customer</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>
                                    {u.name} ({u.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Brand *</label>
                        <input
                            type="text"
                            name="brand"
                            className="form-control bg-dark text-white"
                            value={form.brand}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Model *</label>
                        <input
                            type="text"
                            name="model"
                            className="form-control bg-dark text-white"
                            value={form.model}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Year *</label>
                        <input
                            type="number"
                            name="year"
                            className="form-control bg-dark text-white"
                            value={form.year}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Color</label>
                        <input
                            type="text"
                            name="color"
                            className="form-control bg-dark text-white"
                            value={form.color}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Registration No *</label>
                        <input
                            type="text"
                            name="registrationNumber"
                            className="form-control bg-dark text-white"
                            value={form.registrationNumber}
                            onChange={(e) => setForm({ ...form, registrationNumber: e.target.value.toUpperCase() })}
                            required
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">VIN Number</label>
                        <input
                            type="text"
                            name="vinNumber"
                            className="form-control bg-dark text-white"
                            value={form.vinNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                            Create Car
                        </button>
                    </div>
                </form>
            </div >
        </AdminLayout >
    );
};

export default AdminCreateUserCars;
