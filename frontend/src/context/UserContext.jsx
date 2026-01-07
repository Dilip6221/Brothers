import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Global Axios Config
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";
axios.defaults.withCredentials = true; // required for secure cookie sessions

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get("/user/get-user-data");
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };
  // 🔹 On initial load, check if a cookie session is valid
  useEffect(() => {
    fetchUser();
  }, []);

  // 🔹 Login handler
  const login = async (email, password) => {
    try {
      const res = await axios.post("/user/login", { email, password });
      if (res.data.success) {
        if (res.data.token) setToken(res.data.token);
        await fetchUser();
        return { success: true, message: res.data.message };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      console.error("Login error:",  err.message);
      return {success: false, message: err.message || "Login failed"};
    }
  };

  // 🔹 Register handler
  const register = async (name, email, password, phone) => {
    try {
      const res = await axios.post("/user/register", {
        name,
        email,
        password,
        phone,
      });

      if (res.data.success) {
        return { success: true, message: res.data.message };
      } else {
        return { success: false, isregistered: res.data.isregistered, message: res.data.message };
      }
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    } 
  };

  const logout = async () => {
    try {
      await axios.post("/user/logout");
      setUser(null);
      setToken(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.message);
      setUser(null);
      setToken(null);
      navigate("/login");
    }
  };
  /* For export csv data  */
  const downloadCSV = async (endpoint, fileName, body = {}) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        body,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);

      link.click();
      link.remove();
    } catch (error) {
      toast.error("Export Failed!");
    }
  };


  const value = {
    user,
    setUser,
    token,
    setToken,
    authLoading,
    setAuthLoading,
    login,
    register,
    logout,
    downloadCSV,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
