import React, { useContext, useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const UserList = () => {
    const { downloadCSV } = useContext(UserContext);

    const location = useLocation();
    const [user, setUser] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState(""); //For search functionality

    const [showCreateModal, setShowCreateModal] = useState(false);// For display user create model
    const [modalMode, setModalMode] = useState("CREATE"); /* Open model for create or edit scenario */

    const [newUser, setNewUser] = useState({//Create new user
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "USER"
    });

    /* For create new user aur staff */
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            if(modalMode == 'CREATE'){
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/user/register`,
                    newUser
                );
                if (res.data.success) {
                    toast.success(res.data.message);
                    setShowCreateModal(false);
                    fetchData();
                    setNewUser({name: "",email: "",phone: "",password: "",role: "USER"});
                } else {
                    toast.error(res.data.message);
                }
            }else{
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/admin/update-user-data`,newUser)
                if(res.data.success){
                    toast.success(res.data.message)
                    setShowCreateModal(false);
                    fetchData();
                }else{
                    toast.error(res.data.message);
                }
            }
        } catch (error) {
            toast.error("Creation failed.");
        }
    };

    /* For Fetch all user and staff data */
    const fetchData = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/admin/user-data`);
            setUser(res.data.data);
        } catch (error) {
            toast.error("Error fetching Customer data");
        }
    };
    /* When sidebar click that time refresh data */
    useEffect(() => {
        fetchData();
        const handler = () => fetchData();
        window.addEventListener("ourTeamClick", handler);
        return () => window.removeEventListener("ourTeamClick", handler);
    }, []);
    /* Dashboard data view that time rediraction */
    useEffect(() => {
        if (location.state?.openTab) {
            setFilter(location.state.openTab);
        }
    }, [location.state]);

    /* For search and tabbing */
    const filteredData = user
        .filter((item) => {
            if (filter === "ALL") return true;
            if (filter === "STAFF") {
                return item.role === "STAFF" || item.role === "ADMIN";
            }
            return item.role === "USER";
        })
        .filter((item) => {
            if (!search.trim()) return true;
            const text = search.toLowerCase();
            return (
                item.name?.toLowerCase().includes(text) ||
                item.email?.toLowerCase().includes(text) ||
                item.phone?.toLowerCase().includes(text) ||
                item.role?.toLowerCase().includes(text) ||
                item.status?.toLowerCase().includes(text)
            );
        });
    /* For update user and staff upadte status */
    const handleUserStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/admin/update-status`,
                { userId: id, status: newStatus }
            );
            if (res.data.success) {
                fetchData();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Status update failed");
        }
    }

    return (
        <AdminLayout>
            <div className="container-fluid">
                <div className="bg-dark rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <ul className="nav nav-pills text-danger m-0">
                            <li className="nav-item">
                                <button
                                    className={`text-danger nav-link ${filter === "USER" ? "active bg-danger text-white" : ""
                                        }`}
                                    onClick={() => {
                                        setFilter("USER");
                                        fetchData();
                                    }}
                                >
                                    USER
                                </button>
                            </li>

                            <li className="nav-item">
                                <button
                                    className={`text-danger nav-link ${filter === "STAFF" ? "active bg-danger text-white" : ""
                                        }`}
                                    onClick={() => {
                                        setFilter("STAFF");
                                        fetchData();
                                    }}
                                >
                                    STAFF
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`text-danger nav-link ${filter === "ALL" ? "active bg-danger text-white" : ""
                                        }`}
                                    onClick={() => {
                                        setFilter("ALL");
                                        fetchData();
                                    }}
                                >
                                    ALL
                                </button>
                            </li>
                        </ul>

                        {/* RIGHT BUTTON */}
                        <button className="btn btn-outline-danger d-flex align-items-center gap-2 px-3" onClick={() => {setShowCreateModal(true); setModalMode('CREATE');setNewUser({name: "",email: "",phone: "",password: "",role: "USER"});}}>
                            <i className="bi bi-plus-circle"></i>
                            Create
                        </button>

                    </div>
                </div>
                <div className="bg-dark rounded p-4">
                    <h4 className="text-white border-bottom pb-2 mb-5 d-flex justify-content-between align-items-center">
                        <span>
                            <i className="bi bi-person-badge-fill me-2"></i>
                            Our Team
                        </span>
                        <div className="d-flex align-items-center gap-3">
                            <button
                                className="btn btn-outline-danger d-flex align-items-center p-2"
                                onClick={() => downloadCSV("/user/admin/user-export", `${filter.toLowerCase()}-Team`, { filter })}
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
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td><a href={`mailto:${item.email}`} className="text-info text-decoration-none" style={{ cursor: "pointer" }}>{item.email}</a></td>
                                            <td>{item.phone}</td>
                                            <td>
                                                {item.role === "STAFF" && (
                                                    <span className="badge bg-warning text-dark">
                                                        STAFF
                                                    </span>
                                                )}

                                                {item.role === "USER" && (
                                                    <span className="badge bg-success">
                                                        USER
                                                    </span>
                                                )}

                                                {item.role === "ADMIN" && (
                                                    <span className="badge bg-danger">
                                                        ADMIN
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                               <div className="form-check form-switch d-flex justify-content-center">
                                                    <input
                                                        className="form-check-input bg-dark border-light"
                                                        type="checkbox"
                                                        checked={item.status === "ACTIVE"}
                                                        onChange={() => handleUserStatus(item._id, item.status)}
                                                        
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <i
                                                    className="fa-solid fa-eye text-info me-3"
                                                    style={{
                                                        cursor: "pointer",
                                                        fontSize: "18px",
                                                    }}
                                                ></i>
                                                <i
                                                    className="fa-solid fa-pen-to-square text-warning"
                                                    style={{
                                                        cursor: "pointer",
                                                        fontSize: "18px",
                                                    }}
                                                    onClick={() => {setShowCreateModal(true); setModalMode('EDIT');setNewUser({name: item.name,email: item.email,phone:item.phone,role: item.role, _id: item._id});}}

                                                ></i>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-white">No Data Found...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {showCreateModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.7)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white border-secondary">

                            {/* Header */}
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">
                                    <i className="bi bi-person-plus me-2 text-info"></i>
                                    Create User
                                </h5>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowCreateModal(false)}
                                ></button>
                            </div>

                            {/* Body */}
                            <div className="modal-body">

                                <div className="mb-3">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newUser.name}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, name: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={newUser.email}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, email: e.target.value })
                                        }
                                    />
                                </div>
                                {modalMode == 'CREATE' &&
                                    <div className="mb-3">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newUser.password}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, password: e.target.value })
                                            }
                                        />
                                    </div>
                                }
                                <div className="mb-3">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newUser.phone}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, phone: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>User Role</label>
                                    <select
                                        className="form-select"
                                        value={newUser.role}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, role: e.target.value })
                                        }
                                    >
                                        <option value="USER">USER</option>
                                        <option value="STAFF">STAFF</option>
                                    </select>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="modal-footer border-secondary">
                                <button className="btn btn-danger" onClick={handleCreateUser}> {modalMode === "CREATE" ? "Save" : "Update"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
};

export default UserList;
