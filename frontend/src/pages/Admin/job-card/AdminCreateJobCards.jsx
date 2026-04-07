import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AdminCreateJobCards = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    carId: "",
    expectedDelivery: "",
    customerNotes: "",
  });
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/admin/get-user-job`)
      .then(res => setUsers(res.data.data));
  }, []);

  // 🔹 User change → load cars
  const handleUserChange = async (userId) => {
    setForm({ ...form, userId, carId: "" });
    setCars([]);
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/user-cars/${userId}`
    );
    setCars(res.data.data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/jobcard/admin/job-card/create`, { ...form });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/job-cards");
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to save job card");
    }
  };

  return (
    <AdminLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="section-title">
            <span className="first-letter">C</span>reate Job Card
          </h4>

          <button type="button" className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={() => navigate("/admin/job-cards")}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>

        <form className="row g-3 bg-dark rounded text-white p-4" onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label">Customer</label>
              <select
                className="form-control bg-dark text-white"
                value={form.userId}
                onChange={(e) => handleUserChange(e.target.value)}
              >
                <option value="">-- Select User --</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Customer Cars</label>
              <select
                className="form-control bg-dark text-white"
                value={form.carId}
                onChange={(e) =>
                  setForm({ ...form, carId: e.target.value })
                }
                disabled={!cars.length}
              >
                <option value="">-- Select Car --</option>
                {cars.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.brand} {c.model} ({c.registrationNumber})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label>Expected Delivery</label>
              <input
                type="date"
                className="form-control bg-dark text-white"
                value={form.expectedDelivery}
                onChange={(e) =>
                  setForm({ ...form, expectedDelivery: e.target.value })
                }
              />
            </div>

            <div className="col-md-12">
              <label>Customer Notes</label>
              <textarea
                rows="3"
                className="form-control bg-dark text-white"
                value={form.customerNotes}
                onChange={(e) =>
                  setForm({ ...form, customerNotes: e.target.value })
                }
              />
            </div>

            <div className="col-12">
              <button className="btn btn-primary">
                Create Job Card
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateJobCards;