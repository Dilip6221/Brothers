import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminServiceList = () => {
  const navigate = useNavigate();
  const [service, setService] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/service/admin/services`
      );

      setService(res.data.data || []);
    } catch (error) {
      toast.error("Error fetching service data");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filteredServices = (service || []).filter((item) => {
    if (!search.trim()) return true;

    const text = search.toLowerCase();

    return (
      item.title?.toLowerCase().includes(text) ||
      item.slug?.toLowerCase().includes(text) ||
      item.category?.toLowerCase().includes(text) ||
      item.status?.toLowerCase().includes(text)
    );
  });

  const handleUserStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/service/admin/update-status`,
        {
          serviceId: id,
          status: newStatus,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/service/admin/${id}`
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="bg-dark rounded p-4">
          <h4 className="text-white border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-tools me-2"></i>
              Our Services
            </span>

            <div className="d-flex align-items-center gap-3">
              <div className="input-group" style={{ width: "220px" }}>
                <input
                  type="search"
                  className="form-control bg-dark text-white border-white"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Link to="/admin/services/create" className="text-decoration-none">
                <button className="btn btn-outline-danger d-flex align-items-center gap-2 px-3">
                  <i className="bi bi-plus-circle"></i>
                  Create
                </button>
              </Link>
            </div>
          </h4>
          <div style={{ maxHeight: "65vh", overflowY: "auto" }}>
            <table className="table table-dark table-hover table-bordered align-middle">
              <thead className="table-secondary text-dark sticky-top">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Order</th>
                  <th>Featured</th>
                  <th>Card Features</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>

                      <td>
                        {item.image?.url ? (
                          <img
                            src={item.image.url}
                            alt={item.title}
                            style={{
                              width: "75px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        <strong>{item.title}</strong>
                        <br />
                        <small className="text-secondary">{item.slug}</small>
                      </td>

                      <td>{item.category || "-"}</td>
                      <td>{item.duration || "-"}</td>
                      <td>{item.displayOrder || 0}</td>

                      <td>
                        {item.featured ? (
                          <span className="badge bg-warning text-dark">YES</span>
                        ) : (
                          <span className="badge bg-secondary">NO</span>
                        )}
                      </td>

                      <td>
                        {(item.cardFeatures || []).slice(0, 2).map((f, i) => (
                          <span className="badge bg-secondary me-1 mb-1" key={i}>
                            {f}
                          </span>
                        ))}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            item.status === "ACTIVE" ? "bg-success" : "bg-danger"
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleUserStatus(item._id, item.status)}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="text-center">
                        <i
                          className="fa-solid fa-pen-to-square text-warning me-3"
                          style={{ cursor: "pointer", fontSize: "18px" }}
                          onClick={() => navigate(`/admin/services/edit/${item._id}`)}
                        ></i>

                        <i
                          className="bi bi-trash text-danger"
                          style={{ cursor: "pointer", fontSize: "18px" }}
                          onClick={() => deleteService(item._id)}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center text-white">
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

export default AdminServiceList;