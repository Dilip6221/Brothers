import React, { useState, useContext } from "react";
import videoFile from "../assets/animation.mp4";
import loginLogo from "../assets/brand.png";
import { UserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const { login, register } = useContext(UserContext);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgetModal, setShowForgetModal] = useState(false);
  const [forgetEmail, setForgetEmail] = useState("");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      const res = await register(name, email, password, number);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        setIsRegister(false);
        setName('');
        setEmail('');
        setPassword('');
        setNumber('');
        navigate("/login");
      }
    } else {
      const res = await login(email, password);
      if (!res.success) {
        toast.error(res.message)
      } else {
        toast.success(res.message)
        setEmail('');
        setPassword('');
        navigate("/");
      }
    }
  };
  const handleForgetPassword = async (e) => {
    e.preventDefault();
    if (!forgetEmail) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/forget-pass`,
        { email: forgetEmail }
      );

      console.log(res.data);return false;
      if (res.data.success) {
        toast.success(res.data.message);
        setShowForgetModal(false);
        setForgetEmail("");
        navigate("/login");
      } else toast.error(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {/* MAIN LOGIN SECTION */}
      <section
        className="min-vh-100 d-flex align-items-center justify-content-center position-relative text-center"
        style={{
          backgroundColor: "black",
          overflow: "hidden",
          filter: showForgetModal ? "brightness(0.1)" : "brightness(1)",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: "cover", zIndex: 0, opacity: 0.5 }}
        >
          <source src={videoFile} type="video/mp4" />
        </video>
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.7)", zIndex: 1 }}
        ></div>

        <div
          className="p-4 p-md-5 rounded shadow-lg mx-3 mx-sm-4"
          style={{
            zIndex: 2,
            width: "100%",
            maxWidth: "400px",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
          }}
        >
          <img
            src={loginLogo}
            alt="Logo"
            className="img-fluid mb-4"
            style={{ maxWidth: "180px" }}
          />

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control bg-transparent text-white border-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                />
              </div>
            )}

            <div className="mb-3">
              <input
                type="email"
                className="form-control bg-transparent text-white border-light"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {isRegister && (
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control bg-transparent text-white border-white"
                  placeholder="Phone Number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
            )}

            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control bg-transparent text-white border-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"
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

            <div className="d-grid mb-3">
              <button
                type="submit"
                className="user-profile w-100 "
              >
                <div className="user-profile-inner">
                  {isRegister ? "Register" : "Login"}
                </div>
              </button>
            </div>
            {!isRegister && (
              <span
                onClick={() => setShowForgetModal(true)}
                className="text-white-50 small d-block mb-2"
                style={{ cursor: "pointer" }}
              >
                Forgot password?
              </span>
            )}

            <div className="text-center mt-3">
              <p className="mb-0 text-white-50">
                {isRegister
                  ? "Already have an account?"
                  : "Don’t have an account?"}{" "}
                <span
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setEmail("");
                    setPassword("");
                    setName("");
                    setNumber("");
                  }}
                  style={{ cursor: "pointer" }}
                  className="text-white fw-bold"
                >
                  {isRegister ? "Login" : "Register"}
                </span>
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* FORGET PASSWORD MODAL */}
      {showForgetModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            background: "rgba(0,0,0,0.8)",
            zIndex: 9999,
          }}
        >
          <div
            className="p-4 p-md-5 rounded border border-danger shadow-lg text-center"
            style={{
              width: "100%",
              color: "white",
              maxWidth: "400px",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
            }}
          >
            <h4 className="text-white mb-3">Forgot Password?</h4>
            <button
              type="button"
              onClick={() => {
                setShowForgetModal(false);
                setForgetEmail("");
                setEmail("");
                setPassword("");
              }}
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
              aria-label="Close"
              style={{
                filter: "invert(1)",
              }}
            ></button>
            <p className="text-light small mb-3">
              Enter your registered email and we’ll send you reset instructions.
            </p>
            <form onSubmit={handleForgetPassword}>
              <input
                type="email"
                className="form-control mb-3 bg-transparent text-white border-white"
                placeholder="Enter your email"
                value={forgetEmail}
                onChange={(e) => setForgetEmail(e.target.value)}
              />
              <button type="submit" className="user-profile w-100 ">
                <div className="user-profile-inner">
                  Send Reset Link
                </div>
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
