import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate,useParams  } from 'react-router-dom';

const ForgetPassword = () => {
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    if (!password || !rePassword) {
      toast.error("Please fill all the fields");
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
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <section
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative text-center p-3"
      style={{
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      <div
        className="p-4 p-md-5 rounded-3 text-center mx-3 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #e10600",
          backdropFilter: "blur(10px)",
          color: "white",
          zIndex: 1,
        }}
      >
        <h4 className="text-white mb-4 fw-semibold">Reset Password</h4>
        <form onSubmit={handleForgetPassword}>
          <div className="mb-3 position-relative">
            <input
              type={showRePassword ? "text" : "password"}
              className="form-control bg-transparent border-light text-white py-2"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`bi ${
                showRePassword ? "bi-eye-slash" : "bi-eye"
              } text-light`}
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

          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control bg-transparent border-light text-white py-2"
              placeholder="Confirm Password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
            />
            <i
              className={`bi ${
                showPassword ? "bi-eye-slash" : "bi-eye"
              } text-light`}
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
           <button type="submit" className="user-profile w-100 ">
              <div className="user-profile-inner">
                Reset Password
              </div>
            </button>
        </form>
      </div>
    </section>
  );
};

export default ForgetPassword;
