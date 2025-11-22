import React, { useEffect, useState ,useContext} from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const AdminInquery = () => {
    const location = useLocation();
    const [inqueries, setInqueries] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState(""); //For search functionality
    const { downloadCSV } = useContext(UserContext);//For Download csv

    const fetchData = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/service/admin/admin-inquery-data`);
            setInqueries(res.data.data);
        } catch (error) {
            toast.error("Error fetching inquiry data");
        }
    };
  
    useEffect(() => {
        fetchData();
        const handler = () => fetchData();
        window.addEventListener("inquieryClick", handler);
        return () => window.removeEventListener("inquieryClick", handler);
    }, []);
    
    useEffect(() => {
        if (location.state?.openTab) {
            setFilter(location.state.openTab);
        }
    }, [location.state]);

    const filteredData = inqueries.filter((item) => {
        if (filter === "ALL") return true;
        return item.status === filter;
    }).filter((item) => {
        if (!search.trim()) return true;
        const text = search.toLowerCase();
        return (
            item.name?.toLowerCase().includes(text) ||
            item.email?.toLowerCase().includes(text) ||
            item.phone?.toLowerCase().includes(text) ||
            item.carBrand?.toLowerCase().includes(text) ||
            item.carModel?.toLowerCase().includes(text) ||
            item.status?.toLowerCase().includes(text) ||
            (Array.isArray(item.services) &&
                item.services.join(" ").toLowerCase().includes(text)) ||
            item.status?.toLowerCase().includes(text)
        );
    });;
    const viewInquiry = async (id) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/service/admin/inquiry-details`, { id });
            if (res.data.success) {
                setSelectedInquiry(res.data.data);
                setShowModal(true);
            } else {
                toast.error("Inquiry not found");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };
    return (
        <AdminLayout>
            <div className="container-fluid">
                <div className="bg-dark rounded p-3 mb-3">
                    <ul className="nav nav-pills text-danger">
                        <li className="nav-item">
                            <button className={`text-danger nav-link ${filter === "PENDING" ? "active bg-danger text-white" : ""}`} onClick={() => { setFilter("PENDING"); fetchData(); }}>
                                PENDING
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`text-danger nav-link ${filter === "COMPLETED" ? "active bg-danger text-white" : ""}`} onClick={() => { setFilter("COMPLETED"); fetchData(); }}>
                                COMPLETED
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`text-danger nav-link ${filter === "ALL" ? "active bg-danger text-white" : ""}`} onClick={() => { setFilter("ALL"); fetchData(); }}>
                                ALL
                            </button>
                        </li>
                    </ul>
                </div>
                {/* Inquiry Table */}


                <div className="bg-dark rounded p-4">
                    <h4 className="text-white border-bottom pb-2 mb-5 d-flex justify-content-between align-items-center">
                        <span>
                            <i className="bi bi-clipboard me-2"></i>
                            Customer Inquiry
                        </span>
                        <div className="d-flex align-items-center gap-3">
                            <button
                                className="btn btn-outline-danger d-flex align-items-center p-2"
                                onClick={() => downloadCSV("/service/admin/inquiry-export", `${filter.toLowerCase()}-inquiry`, { filter })}
                            >
                                <i className="fa fa-download"></i>
                            </button>
                            <div className="input-group" style={{ width: "200px" }}>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-danger"
                                    name="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </h4>
                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <table className="table table-dark table-hover table-bordered align-middle">
                            <thead className="table-secondary text-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Service</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td><a href={`mailto:${item.email}`} className="text-info text-decoration-none" style={{ cursor: "pointer" }}>{item.email}</a></td>
                                            <td>{item.phone}</td>
                                            <td>{item.carBrand}</td>
                                            <td>{item.carModel}</td>
                                            <td>{item.services?.join(", ")}</td>

                                            <td>
                                                {item.status === "PENDING" && (
                                                    <span className="badge bg-warning text-dark">Pending</span>
                                                )}
                                                {item.status === "COMPLETED" && (
                                                    <span className="badge bg-success">Completed</span>
                                                )}
                                            </td>

                                            <td className="text-center">
                                                <i
                                                    className="fa-solid fa-eye text-info me-3"
                                                    style={{ cursor: "pointer", fontSize: "18px" }}
                                                    onClick={() => viewInquiry(item._id)}
                                                ></i>


                                                <i
                                                    className="fa-solid fa-pen-to-square text-warning"
                                                    style={{ cursor: "pointer", fontSize: "18px" }}
                                                ></i>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center text-white">
                                            No Data Found...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {showModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.7)" }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-dark text-white border-secondary">

                            {/* Modal Header */}
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">
                                    <i className="fa-solid fa-circle-info me-2 text-info"></i>
                                    Inquiry Details
                                </h5>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body p-4" style={{ maxHeight: "60vh", overflowY: "auto" }}>

                                {/* Customer Info */}
                                <div className="mb-3">
                                    <h6 className="text-warning">Customer Info</h6>
                                    <p><strong>Name:</strong> {selectedInquiry?.name}</p>
                                    <p><strong>Email:</strong> {selectedInquiry?.email}</p>
                                    <p><strong>Phone:</strong> {selectedInquiry?.phone}</p>
                                </div>

                                {/* Vehicle Info */}
                                <div className="mb-3">
                                    <h6 className="text-warning">Vehicle Info</h6>
                                    <p><strong>Brand:</strong> {selectedInquiry?.carBrand}</p>
                                    <p><strong>Model:</strong> {selectedInquiry?.carModel}</p>
                                    <p><strong>Services:</strong>
                                        {selectedInquiry?.services?.map((s, idx) => (
                                            <span key={idx} className="badge bg-info ms-2">{s}</span>
                                        ))}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <h6 className="text-warning">Address & Status</h6>
                                    <p><strong>Address:</strong> {selectedInquiry?.address}</p>
                                    <p><strong>City:</strong> {selectedInquiry?.city}</p>
                                    <p><strong>Status:</strong>
                                        {selectedInquiry?.status === "PENDING" && (
                                            <span className="badge bg-warning text-dark ms-2">Pending</span>
                                        )}
                                        {selectedInquiry?.status === "COMPLETED" && (
                                            <span className="badge bg-success ms-2">Completed</span>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <h6 className="text-warning">Metadata</h6>
                                    <p><strong>Created At:</strong> {new Date(selectedInquiry?.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </AdminLayout>
    );
};

export default AdminInquery;

