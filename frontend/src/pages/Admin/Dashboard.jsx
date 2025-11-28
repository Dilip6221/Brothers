import {React,useState,useEffect} from 'react'
import AdminLayout from './AdminLayout.jsx'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
    const [stats, setStats] = useState({});
    
    const fetchStats = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/admin/dashboard-stats`);
      setStats(res.data.data);
    } catch (e) {
      toast.error("Dashboard fetch error:", e);
    }
  };

  useEffect(() => {
    fetchStats();
    const handler = () => fetchStats();
    window.addEventListener("dashboardClick", handler);
    return () => window.removeEventListener("dashboardClick", handler);
  }, []);

  return (
    <>
      <AdminLayout>
        <div className="container-fluid">
          <div className="row g-4">
            {/* Total Employee in Brother with admin */}
            <div className="col-sm-6 col-xl-3">
              <div className="bg-dark rounded p-4 shadow-sm border border-secondary">
                <div className="d-flex align-items-center justify-content-between">
                  <i className="fa-solid fa-id-badge fa-2x text-warning"></i>
                  <div className="text-white text-end position-relative">
                    <p className="mb-1">Total Employees</p>
                    <div className="d-flex align-items-center justify-content-end">
                      <h5 className="mb-0 me-2">{stats.totalEmployees || 0}</h5>
                      <span className="badge bg-danger mt-1" style={{ fontSize: "10px", padding: "4px 6px", cursor: "pointer" }} onClick={() => navigate("/admin/users")}>
                        View
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Customers */}
            <div className="col-sm-6 col-xl-3">
              <div className="bg-dark rounded p-4 shadow-sm border border-secondary position-relative">
                <div className="d-flex align-items-center justify-content-between">
                  <i className="fa-solid fa-users fa-2x text-danger"></i>
                  <div className="text-white text-end">
                    <p className="mb-1">Total Customers</p>
                    <div className="d-flex align-items-center justify-content-end">
                      <h5 className="mb-0 me-2">{stats.totalCustomers || 0}</h5>
                      <span className="badge bg-danger mt-1" style={{ fontSize: "10px", padding: "4px 6px", cursor: "pointer" }} onClick={() => navigate("/admin/users", { state: { openTab: "USER" } })}>
                        View
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Staff */}
            <div className="col-sm-6 col-xl-3">
              <div className="bg-dark rounded p-4 shadow-sm border border-secondary position-relative">
                <div className="d-flex align-items-center justify-content-between">
                  <i className="fa-solid fa-user-gear fa-2x text-info"></i>
                  <div className="text-white text-end">
                    <p className="mb-1">Total Staff</p>
                    <div className="d-flex align-items-center justify-content-end">
                      <h5 className="mb-0 me-2">{stats.totalStaff || 0}</h5>
                      <span className="badge bg-danger mt-1" style={{ fontSize: "10px", padding: "4px 6px", cursor: "pointer" }} onClick={() => navigate("/admin/users", { state: { openTab: "STAFF" } })}>
                        View
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Inquiries */}
            <div className="col-sm-6 col-xl-3">
              <div className="bg-dark rounded p-4 shadow-sm border border-secondary position-relative">
                <div className="d-flex align-items-center justify-content-between">
                  <i className="fa-solid fa-calendar-check fa-2x text-success"></i>
                  <div className="text-white text-end">
                    <p className="mb-1">Total Inquirys</p>
                    <div className="d-flex align-items-center justify-content-end">
                      <h5 className="mb-0 me-2">{stats.totalInquiries || 0}</h5>
                      <span className="badge bg-danger mt-1" style={{ fontSize: "10px", padding: "4px 6px", cursor: "pointer" }} onClick={() => navigate("/admin/inquery")}>
                        View
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Second Row */}
          <div className="row g-4 mt-0">
            {/* Pending Inquery */}
            <div className="col-sm-6 col-xl-3">
              <div className="bg-dark rounded d-flex align-items-center justify-content-between p-4 shadow-sm border border-secondary">
                <i className="fa fa-hourglass-half fa-2x text-warning"></i>
                <div className="ms-3 text-white">
                  <p className="mb-2">Pending Inquirys</p>
                  <div className="d-flex align-items-center justify-content-end">
                      <h5 className="mb-0 me-2">{stats.pendingInquiries || 0}</h5>
                      <span className="badge bg-danger mt-1" style={{ fontSize: "10px", padding: "4px 6px", cursor: "pointer" }} onClick={() => navigate("/admin/inquery", { state: { openTab: "PENDING" } })}>
                        View
                      </span>
                    </div>
                </div>
              </div>
            </div>
            {/* Completed Inquery */}
            <div className="col-sm-6 col-xl-3">
              <div className="bg-dark rounded d-flex align-items-center justify-content-between p-4 shadow-sm border border-secondary">
                <i className="fa fa-check-circle fa-2x text-success"></i>
                <div className="ms-3 text-white">
                  <p className="mb-2">Completed Inquirys</p>
                  <div className="d-flex align-items-center justify-content-end">
                      <h5 className="mb-0 me-2">{stats.completedInquiries || 0}</h5>
                      <span className="badge bg-danger mt-1" style={{ fontSize: "10px", padding: "4px 6px", cursor: "pointer" }} onClick={() => navigate("/admin/inquery", { state: { openTab: "COMPLETED" } })}>
                        View
                      </span>
                    </div>
                </div>
              </div>
            </div>

            {/* Cancelled Inquery*/}
            <div className="col-sm-6 col-xl-3">
              <div className="bg-dark rounded d-flex align-items-center justify-content-between p-4 shadow-sm border border-secondary">
                <i className="fa fa-times-circle fa-2x text-danger"></i>
                <div className="ms-3 text-white">
                  <p className="mb-2">Cancelled Inquirys</p>
                  <div className="d-flex align-items-center justify-content-end">
                      <h5 className="mb-0 me-2">{stats.cancelledInquiries || 0}</h5>
                      <span className="badge bg-danger mt-1" style={{ fontSize: "10px", padding: "4px 6px", cursor: "pointer" }} onClick={() => navigate("/admin/inquery", { state: { openTab: "COMPLETED" } })}>
                        View
                      </span>
                    </div>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="col-sm-6 col-xl-3">
              <div className="bg-dark rounded d-flex align-items-center justify-content-between p-4 shadow-sm border border-secondary">
                <i className="fa fa-dollar-sign fa-2x text-info"></i>
                <div className="ms-3 text-white">
                  <p className="mb-2">Revenue</p>
                  <h6 className="mb-0">$12,345</h6>
                </div>
              </div>
            </div>

            {/* Top Services */}
            <div className="col-sm-6 col-xl-3">
              <div className="bg-dark rounded d-flex align-items-center justify-content-between p-4 shadow-sm border border-secondary">
                <i className="fa fa-car fa-2x text-primary"></i>
                <div className="ms-3 text-white">
                  <p className="mb-2">Top Services</p>
                  <h6 className="mb-0">PPF, Paint</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

      </AdminLayout>
    </>
  )
}

export default Dashboard