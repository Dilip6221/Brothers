import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminUserCars = () => {
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/user-cars`);
            setCars(res.data.data || []);
        } catch (error) {
            toast.error("Error fetching User Cars data");
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = cars.filter((item) =>
        item.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
        item.brand?.toLowerCase().includes(search.toLowerCase()) ||
        item.model?.toLowerCase().includes(search.toLowerCase()) ||
        item.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.userId?.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="container-fluid">
                <div className="bg-dark rounded p-4">

                    <h4 className="text-white border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
                        <span>
                            <i className="bi bi-car-front me-2"></i>
                            User Cars Management
                        </span>
                        <div className="d-flex align-items-center gap-3">
                            <div className="input-group" style={{ width: "200px" }}>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-white"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Link to="/admin/user-cars/create" className="text-decoration-none">
                                <button className="btn btn-outline-danger d-flex align-items-center gap-2 px-3"> <i className="bi bi-plus-circle"></i>Create</button>
                            </Link>
                        </div>
                    </h4>

                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <table className="table table-dark table-hover table-bordered align-middle">
                            <thead className="table-secondary text-dark sticky-top">
                                <tr>
                                    <th>#</th>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Year</th>
                                    <th>Registration No</th>
                                    <th>VIN</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>{item.userId?.name || "-"}</td>
                                            <td>
                                                <a href={`mailto:${item.userId?.email}`} className="text-info text-decoration-none">
                                                    {item.userId?.email || "-"}
                                                </a>
                                            </td>
                                            <td>{item.brand}</td>
                                            <td>{item.model}</td>
                                            <td>{item.year}</td>
                                            <td>{item.registrationNumber}</td>
                                            <td>{item.vinNumber || "-"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center text-white">
                                            No Data Found...
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

export default AdminUserCars;
