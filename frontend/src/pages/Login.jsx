import React, { useState, useContext } from "react";
import videoFile from "../assets/animation.mp4";
import loginLogo from "../assets/brand.png";
import { UserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const { login, register} = useContext(UserContext);
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
      }
    } else {
      const res = await login(email, password);
      if (!res.success){
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
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/forget-pass`, {
        email: forgetEmail,
      });
  
      if (res.data.success) {
        toast.success(res.data.message);
        setShowForgetModal(false);
        setForgetEmail("");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };
  return (
    <>
    <section
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative text-center"
      style={{
        backgroundColor: "black",
        overflow: "hidden",
        filter: showForgetModal ? "brightness(0.1)" : "brightness(1)",
      }}
    >
      <video autoPlay muted loop playsInline className="position-absolute top-0 start-0 w-100 h-100" style={{objectFit: "cover",zIndex: 0,opacity: 0.5}}>
        <source src={videoFile} type="video/mp4" />
      </video>
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: "rgba(0,0,0,0.7)",zIndex: 1}}></div>
      <div style={{ zIndex: 2, width: "100%", maxWidth: "400px" }}>
        <img src={loginLogo} alt="Logo" width="200" />
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="mb-3">
              <input type="text" className="form-control bg-transparent border-light" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
            </div>
          )}

          <div className="mb-3">
            <input type="email" className="form-control bg-transparent border-light"  placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>

          {isRegister && (
            <div className="mb-3">
              <input type="number" className="form-control bg-transparent border-light" placeholder="Phone Number" value={number} onChange={(e) => setNumber(e.target.value)} />
            </div>
          )}
          <div className="mb-3 position-relative">
            <input type={showPassword ? "text" : "password"} className="form-control bg-transparent border-light" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-light`}
              style={{position: "absolute",right: "15px",top: "50%", transform: "translateY(-50%)", cursor: "pointer"}}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-lg text-white fw-bold" style={{background: "linear-gradient(90deg, #ff4b2b, #72545bff)"}}>
              {isRegister ? "Register" : "Login"}
            </button>
          </div>

          {!isRegister && (
            <span onClick={() => setShowForgetModal(true)} className="text-white-50 small" style={{ cursor: "pointer" }}>
              Forgot password?
            </span>

          )}
          <div className="text-center mt-3">
            <p className="mb-0 text-white-50">
              {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
              <span onClick={() => {setIsRegister(!isRegister);setEmail('');setPassword('');setName('');setNumber('')}} style={{ cursor: "pointer" }}
                className="text-white fw-bold"
              >
                {isRegister ? "Login" : "Register"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </section>
    
    {showForgetModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{background: "rgba(0,0,0,0.8)",zIndex: 9999,}}>
          <div className="p-4 rounded border border-danger shadow-lg text-center" style={{width: "90%",color: "white",maxWidth: "400px"}}>

            <h4 className="text-white mb-3">Forgot Password?</h4>
            <p className="text-light small mb-3">
              Enter your registered email and we’ll send you reset instructions.
            </p>
            <form onSubmit={handleForgetPassword}>
              <input type="email" className="form-control mb-3 bg-transparent text-white border-light" placeholder="Enter your email" value={forgetEmail} onChange={(e) => setForgetEmail(e.target.value)}/>
              <button type="submit" className="btn btn-light w-100 fw-bold" style={{background: "linear-gradient(90deg, #ff4b2b, #72545bff)"}}>
                Send Reset Link
              </button>
              <button type="button" className="btn btn-outline-light w-100 mt-2" onClick={() => {setShowForgetModal(false); setForgetEmail("");setEmail('');setPassword('');setName('');setNumber}}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
