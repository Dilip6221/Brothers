import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload;
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  };
  const fetchUser = async () => {
    try {
      const res = await axios.get("/user/get-user-data");
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
    const initializeUser = async () => {
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setLoading(true);
        await fetchUser();
        setLoading(false);
      } else {
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setLoading(false);
      }
    };
    initializeUser();
  }, [token]);



  // --- login ---
  const login = async (email, password) => {
    try {
      const res = await axios.post("/user/login", { email, password });
      if (res.data.success) {
        const newToken = res.data.token;
        setToken(newToken);
        localStorage.setItem("token", newToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        setLoading(true);
        await fetchUser();
        setLoading(false);
        return { success: true, message: res.data.message };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // --- register ---
  const register = async (name, email, password, phone) => {
    try {
      const res = await axios.post("/user/register", { name, email, password, phone });
      if (res.data.success) {
        const newToken = res.data.token;
        setToken(newToken);
        localStorage.setItem("token", newToken);
        setLoading(true);
        await fetchUser();
        setLoading(false);
        return { success: true, message: res.data.message };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // --- logout ---
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const value = { token,setToken, user,setUser,setLoading, loading, login, register, logout };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
