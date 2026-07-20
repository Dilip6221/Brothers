import React, { useEffect, useState ,useContext} from 'react';
import AdminLayout from '../AdminLayout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext.jsx';

const AdminInquery = () => {
    const location = useLocation();
    const [inqueries, setInqueries] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showModal, setShowModal] = useState(false);    const [editingInquiry, setEditingInquiry] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({ status: "", adminNotes: "" });    const [search, setSearch] = useState(""); //For search functionality
    const { downloadCSV } = useContext(UserContext);//For Download csv

    const fetchData = async () => {
        try {
            const res = await axios.post(`inquery/admin/admin-inquery-data`);
            setInqueries(res.data.data);
        } catch (error) {
            toast.error("Error fetching inquiry data");
            console.error("Fetch inquiry data error", error);
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
            // item.carBrand?.toLowerCase().includes(text) ||
            // item.carModel?.toLowerCase().includes(text) ||
            item.status?.toLowerCase().includes(text) ||
            (Array.isArray(item.services) &&
                item.services.join(" ").toLowerCase().includes(text)) ||
            item.status?.toLowerCase().includes(text)
        );
    });;
    const viewInquiry = async (id) => {
        try {
            const res = await axios.post(`inquery/admin/inquiry-details`, { id });
            if (res.data.success) {
                setSelectedInquiry(res.data.data);
                setShowModal(true);
            } else {
                toast.error("Inquiry not found");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error("View inquiry error", error);
        }
    };

    const editInquiry = (inquiry) => {
        setEditingInquiry(inquiry);
        setEditFormData({
            status: inquiry.status || "PENDING",
            adminNotes: inquiry.adminNotes || ""
        });
        setShowEditModal(true);
    };

    const updateInquiry = async () => {
        try {
            if (!editingInquiry._id) {
                toast.error("Inquiry ID not found");
                return;
            }
            const res = await axios.post("inquery/admin/update-inquiry", {
                id: editingInquiry._id,
                status: editFormData.status,
                adminNotes: editFormData.adminNotes
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setShowEditModal(false);
                fetchData(); 
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Error updating inquiry");
            console.error("Update inquiry error", error);
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
                    <h4 className="text-white border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
                        <span>
                            <i className="bi bi-clipboard-check-fill me-2"></i>
                            Customer Inquiry
                        </span>
                        <div className="d-flex align-items-center gap-3">
                            <button
                                className="btn btn-outline-danger d-flex align-items-center p-2"
                                onClick={() => downloadCSV("/inquery/admin/inquiry-export", `${filter.toLowerCase()}-inquiry`, { filter })}
                            >
                                <i className="fa fa-download"></i>
                            </button>
                            <div className="input-group" style={{ width: "200px" }}>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-white"
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
                            <thead className="table-secondary text-dark sticky-top" >
                                <tr>
                                    <th>#</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    {/* <th>Brand</th>
                                    <th>Model</th> */}
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
                                            {/* <td>{item.carBrand}</td>
                                            <td>{item.carModel}</td> */}
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
                                                    onClick={() => editInquiry(item)}
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
                                    {/* <h6 className="text-warning">Vehicle Info</h6>
                                    <p><strong>Brand:</strong> {selectedInquiry?.carBrand}</p>
                                    <p><strong>Model:</strong> {selectedInquiry?.carModel}</p> */}
                                    <p><strong>Services:</strong>
                                        {selectedInquiry?.services?.map((s, idx) => (
                                            <span key={idx} className="badge bg-info ms-2">{s}</span>
                                        ))}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    {/* <h6 className="text-warning">Address & Status</h6>
                                    <p><strong>Address:</strong> {selectedInquiry?.address}</p>
                                    <p><strong>City:</strong> {selectedInquiry?.city}</p> */}
                                    <p><strong>Status:</strong>
                                        {selectedInquiry?.status === "PENDING" && (
                                            <span className="badge bg-warning text-dark ms-2">Pending</span>
                                        )}
                                        {selectedInquiry?.status === "COMPLETED" && (
                                            <span className="badge bg-success ms-2">Completed</span>
                                        )}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <h6 className="text-warning">Note Section</h6>
                                    <p><strong>Customer Notes:</strong> {selectedInquiry?.notes}</p>
                                    <p><strong>Admin Notes:</strong> {selectedInquiry?.adminNotes}</p>
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

            {/* Edit Inquiry Modal */}
            {showEditModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.7)" }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-dark text-white border-secondary">

                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">
                                    <i className="fa-solid fa-pen-to-square me-2 text-warning"></i>
                                    Edit Inquiry - {editingInquiry?.name}
                                </h5>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body p-4">

                                {/* Customer Info Display */}
                                <div className="mb-4">
                                    <h6 className="text-info border-bottom pb-2">Customer Information</h6>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Name:</strong> {editingInquiry?.name}</p>
                                            <p><strong>Email:</strong> {editingInquiry?.email}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Phone:</strong> {editingInquiry?.phone}</p>
                                            <p><strong>Services:</strong>
                                                {editingInquiry?.services?.map((s, idx) => (
                                                    <span key={idx} className="badge bg-info ms-2">{s}</span>
                                                ))}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Notes */}
                                <div className="mb-4">
                                    <h6 className="text-info border-bottom pb-2">Customer Notes</h6>
                                    <div className="p-2 text-white bg-dark border-secondary">
                                        {editingInquiry?.notes || <span className="text-muted">No notes provided</span>}
                                    </div>
                                </div>

                                {/* Status Field */}
                                <div className="mb-3">
                                    <label className="form-label text-warning">Status</label>
                                    <select 
                                        className="form-control text-white bg-dark border-secondary"
                                        value={editFormData.status}
                                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-warning">Admin Notes (Follow-up & Discussion)</label>
                                    <textarea 
                                        className="form-control text-white bg-dark border-secondary"
                                        rows="5"
                                        placeholder="Add notes about follow-up, discussion, and resolution..."
                                        value={editFormData.adminNotes}
                                        onChange={(e) => setEditFormData({ ...editFormData, adminNotes: e.target.value })}
                                    ></textarea>
                                    <small className="text-white d-block mt-1">
                                        <i className="fa-solid fa-circle-info me-1"></i>
                                        Keep track of conversations, follow-ups, and any important details discussed with the customer.
                                    </small>
                                </div>

                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer border-secondary">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={updateInquiry}
                                >
                                    <i className="fa-solid fa-floppy-disk me-2"></i>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
};

export default AdminInquery;

