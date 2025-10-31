import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Axios instance
  const client = axios.create({
    baseURL: `${BASE_URL}/api/v1/users`,
  });

  // REGISTER
  const handleRegister = async (name, username, password) => {
    try {
      const res = await client.post("/register", { name, username, password });
      console.log("Register Response:", res.data);
      return res.data.message; // Return message directly
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // LOGIN
  const handleLogin = async (username, password) => {
    try {
      const res = await client.post("/login", { username, password });
      console.log("Login Response:", res.data);
      localStorage.setItem("token", res.data.token);
      setUserData(res.data.user || null);
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // FETCH USER HISTORY
  const getHistoryOfUser = async () => {
    try {
      const res = await client.get("/getAllActivity", {
        params: { token: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      console.error("Fetching history failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // ADD TO USER HISTORY
  const addToUserHistory = async (meetingCode) => {
    try {
      console.log("Sending to backend:", {
        token: localStorage.getItem("token"),
        meetingCode,
      });

      const res = await client.post("/addToActivity", {
        token: localStorage.getItem("token"),
        meetingCode,
      });
      return res.data;
    } catch (err) {
      console.error("Add to history failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // const getHistoryOfUser = async () => {
  //   try {
  //     let res = await client.get("/get_all_activity", {
  //       params: { token: localStorage.getItem("token") },
  //     });
  //     return res.data;
  //   } catch (err) {
  //     console.error(" Fetching history failed:", err.response?.data || err.message);
  //     throw err;
  //   }
  // };



  const value = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
