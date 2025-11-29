import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import loginLogo from "../assets/images/brand.png";

const ForgetPassword = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleForgetPassword = async (e) => {
    e.preventDefault();

    if (!password || !rePassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (password !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/forget-password/${token}`,
        { newPassword: password }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else toast.error(res.data.message);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <section
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "#000",
        padding: "20px",
      }}
    >
      <div
        className="container p-4"
        style={{
          maxWidth: "900px",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          background: "rgba(33, 155, 27, 0.05)",
          border: "1px solid rgba(198, 31, 31, 0.2)",
        }}
      >
        <div className="row g-0">
          <div
            className="col-md-6 d-flex flex-column justify-content-center align-items-center text-center p-4 border-md-end"
            style={{
              borderRight: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <img src={loginLogo} alt="Brand Logo" className="img-fluid mb-3" style={{maxWidth: "170px", width: "70%" }}/>
            <div
              className="px-3 py-2 fw-semibold text-uppercase"
              style={{
                color: "#f5f5f5",
                letterSpacing: "1px",
                fontSize: "12px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(182, 34, 29, 0.66)",
                maxWidth: "260px",
                lineHeight: "1.4",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <i className="bi bi-wrench-adjustable me-2 text-danger"></i>
              At{" "}
              <span style={{ fontSize: "16px", color: "red" }}>BROTHER'S</span>, We Don’t Just Fix Cars – We Build Trust
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="col-md-6 p-4">
            <h4 className="text-white text-center mb-4">Change Password</h4>

            <form onSubmit={handleForgetPassword}>
              {/* PASSWORD */}
              <div className="mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control bg-transparent border-light text-white py-2"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-light`}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mb-3 position-relative">
                <input
                  type={showRePassword ? "text" : "password"}
                  className="form-control bg-transparent border-light text-white py-2"
                  placeholder="Confirm Password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
                <i
                  className={`bi ${showRePassword ? "bi-eye-slash" : "bi-eye"} text-light`}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowRePassword(!showRePassword)}
                ></i>
              </div>

              {/* BUTTON */}
              <button type="submit" className="user-profile w-100">
                <div className="user-profile-inner">Reset Password</div>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
