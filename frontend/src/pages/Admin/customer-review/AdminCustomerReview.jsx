import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";

const AdminCustomerReview = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/customer-reviews/admin/all`);
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (error) {
      toast.error("Error fetching Customer reviews");
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const approveReview = async (id) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/customer-reviews/admin/approve/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchReviews();
      }
    } catch (error) {
      toast.error("Error approving review");
    }
  };

  const filteredData = reviews
    .filter((item) => {
      if (filter === "ALL") return true;
      if (filter === "PENDING") return item.isApproved === false;
      if (filter === "APPROVED") return item.isApproved === true;
      return true;
    })
    .filter((item) => {
      if (!search.trim()) return true;
      const text = search.toLowerCase();
      return (
        item.name?.toLowerCase().includes(text) ||
        item.review?.toLowerCase().includes(text)
      );
    });
  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="bg-dark rounded p-3 mb-3">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button
                className={`nav-link ${filter === "PENDING" ? "bg-danger text-white" : "text-danger"
                  }`}
                onClick={() => setFilter("PENDING")}
              >
                PENDING
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${filter === "APPROVED" ? "bg-danger text-white" : "text-danger"
                  }`}
                onClick={() => setFilter("APPROVED")}
              >
                APPROVED
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${filter === "ALL" ? "bg-danger text-white" : "text-danger"
                  }`}
                onClick={() => setFilter("ALL")}
              >
                ALL
              </button>
            </li>
          </ul>
        </div>
        <div className="bg-dark rounded p-4">
          <h4 className="text-white border-bottom pb-2 mb-3 d-flex justify-content-between">
            <span>
              <i className="bi bi-chat-dots me-2"></i>
              Customer Reviews
            </span>
            <input
              type="search"
              className="form-control bg-dark text-white border-white w-25"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </h4>

          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <table className="table table-dark table-hover table-bordered align-middle">
              <thead className="table-secondary text-dark sticky-top">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{"⭐".repeat(item.rating)}</td>
                      <td>{item.review}</td>
                      <td>
                        {item.isApproved ? (
                          <span className="badge bg-success">Approved</span>
                        ) : (
                          <span className="badge bg-warning text-dark">
                            Pending
                          </span>
                        )}
                      </td>
                      <td>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center">
                        {!item.isApproved && (
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => approveReview(item._id)}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-white">
                      No Reviews Found...
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

export default AdminCustomerReview;