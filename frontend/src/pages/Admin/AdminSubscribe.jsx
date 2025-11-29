import React, { useEffect, useState ,useContext} from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const AdminSubscribe = () => {
    const location = useLocation();
    const [Subscription, setsubscription] = useState([]);
    const [filter, setFilter] = useState("SUBSCRIBE");
    const [search, setSearch] = useState(""); //For search functionality

    const fetchData = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/subscribe/admin/subscribe`);
            setsubscription(res.data.data);
        } catch (error) {
            toast.error("Error fetching Subscription data");
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

    const filteredData = Subscription.filter((item) => {
        return item.status === filter;
    }).filter((item) => {
        if (!search.trim()) return true;
        const text = search.toLowerCase();
        return (
            item.email?.toLowerCase().includes(text) ||
            item.status?.toLowerCase().includes(text)
        );
    });;
    return (
        <AdminLayout>
            <div className="container-fluid">
                <div className="bg-dark rounded p-3 mb-3">
                    <ul className="nav nav-pills text-danger">
                        <li className="nav-item">
                            <button className={`text-danger nav-link ${filter === "SUBSCRIBE" ? "active bg-danger text-white" : ""}`} onClick={() => { setFilter("SUBSCRIBE"); fetchData(); }}>
                                SUBSCRIBE
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`text-danger nav-link ${filter === "UNSUBSCRIBE" ? "active bg-danger text-white" : ""}`} onClick={() => { setFilter("UNSUBSCRIBE"); fetchData(); }}>
                                UNSUBSCRIBE
                            </button>
                        </li>
                       
                    </ul>
                </div>
                {/* Inquiry Table */}


                <div className="bg-dark rounded p-4">
                    <h4 className="text-white border-bottom pb-2 mb-5 d-flex justify-content-between align-items-center">
                        <span>
                            <i className="bi bi-envelope-arrow-up-fill me-2"></i>
                            Subscribe Newsletters
                        </span>
                        { <div className="d-flex align-items-center gap-3">
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
                        </div> }
                    </h4>
                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <table className="table table-dark table-hover table-bordered align-middle">
                            <thead className="table-secondary text-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Email</th>
                                    <th>Created At</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td><a href={`mailto:${item.email}`} className="text-info text-decoration-none" style={{ cursor: "pointer" }}>{item.email}</a></td>
                                            <td>{new Date(item.createdAt).toLocaleString()}</td>
                                            <td>
                                                {item.status === "SUBSCRIBE" && (
                                                    <span className="badge bg-success">Subscribe</span>
                                                )}
                                                {item.status === "UNSUBSCRIBE" && (
                                                    <span className="badge bg-warning text-dark">Unsubscribe</span>
                                                )}
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
        </AdminLayout>
    );
};

export default AdminSubscribe;

