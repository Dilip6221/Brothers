import React, { useState } from 'react'
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
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/forget-password/${token}`, {
            newPassword: password,
          });
      
          if (res.data.success) {
            toast.success(res.data.message);
            navigate('/login');
          } else {
            toast.error(res.data.message);
          }
        } catch (error) {
          console.error(error);
          toast.error(error);
        }
    };
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "black", zIndex: 9999}}>
            <div className="p-5 rounded-3 text-center" style={{ width: "350px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", color: "white", boxShadow: "0 4px 25px rgba(0,0,0,0.6)"}}>
                <h4 className="text-white mb-4">Reset Password</h4>
                <form onSubmit={handleForgetPassword}>
                    <div className="mb-3" style={{ position: "relative" }}>
                        <input type={showRePassword ? "text" : "password"} className="form-control bg-transparent border-light text-white" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <i className={`bi ${showRePassword ? "bi-eye-slash" : "bi-eye"} text-light`} style={{position: "absolute",right: "15px",top: "50%", transform: "translateY(-50%)", cursor: "pointer"}} onClick={() => setShowRePassword(!showRePassword)} ></i>

                    </div>
                    <div className="mb-3" style={{ position: "relative" }}>
                        <input type={showPassword ? "text" : "password"} className="form-control bg-transparent border-light text-white" placeholder="Confirm Password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} />
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-light`} style={{position: "absolute",right: "15px",top: "50%", transform: "translateY(-50%)", cursor: "pointer"}} onClick={() => setShowPassword(!showPassword)} ></i>
                    </div>
                    <button type="submit" className=" w-100 btn text-white fw-bold" style={{background: "linear-gradient(90deg, #ff4b2b, #72545bff)"}}>Reset Password</button>
                </form>
            </div>
        </div>
    )
}

export default ForgetPassword
