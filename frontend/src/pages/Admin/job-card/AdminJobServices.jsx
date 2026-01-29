import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout.jsx";
import axios from "axios";
import toast from "react-hot-toast";


const AdminJobServices = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/job-services/${jobId}`);
      setServices(res.data.data || []);
    } catch {
      toast.error("Failed to load services");
    }
  };
  useEffect(() => {
    fetchServices();
  }, [jobId]);
  
  const addService = async () => {
    if (!serviceName.trim()) {
      return toast.error("Enter service name");
    }
    if (!price || isNaN(price)) {
      return toast.error("Enter valid price");
    }
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/job-services/create`,{jobId,serviceName,price: Number(price),});
      toast.success("Service added");
      setServiceName("");
      setPrice("");
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Remove this service?")) return;
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/job-services/${id}`);
    toast.success("Service removed");
    fetchServices();
  };
  const total = services.reduce((sum, s) => sum + Number(s.price), 0);
  return (
    <AdminLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="section-title">
                <span className="first-letter">M</span>anage Services
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
        <div className="row g-2 mb-4">
          <div className="col-md-5">
            <input
              className="form-control bg-dark text-white border-secondary"
              placeholder="Service Name (e.g. Oil Change)"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Price ₹"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-danger w-100"
              onClick={addService}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Service"}
            </button>
          </div>
        </div>

        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Service</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No services added yet
                </td>
              </tr>
            ) : (
              services.map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1}</td>
                  <td>{s.serviceName}</td>
                  <td>₹{s.price}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteService(s._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
            <tr>
              <td colSpan="2">
                <b>Total</b>
              </td>
              <td colSpan="2">
                <b>₹{total}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminJobServices;
