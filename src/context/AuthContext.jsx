import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser && storedUser !== "undefined") {
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Invalid user in localStorage");
      localStorage.removeItem("user");
    }
  }
}, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (formData) => {
  const res = await axios.post(
    "http://localhost:5000/api/auth/register",
    formData,
    { headers: { "Content-Type": "application/json", },
   }
  );

  setUser(res.data);
  localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};