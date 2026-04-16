import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ ADD THIS

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const { data } = await API.get("/auth/me");
        setUser(data);
      } catch (err) {
        logout();
      } finally {
        setLoading(false); // ✅ IMPORTANT
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data.user;
  };

  const register = async (form) => {
    const { data } = await API.post("/auth/register", form);

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);