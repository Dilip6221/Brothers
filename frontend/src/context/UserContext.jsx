import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/user/login", { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        return { success: true,message: res.data.message};
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await axios.post("/user/register", { name, email, password, phone });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        return { success: true,message: res.data.message };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const value = { token, loading, login, register, logout };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
