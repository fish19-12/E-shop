import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (err) {
      console.log("Failed to parse userInfo:", err);
      return null;
    }
  });

  // --------------------- Sync Google JWT if present ---------------------
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token && !user) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const googleUser = {
          _id: payload.id,
          name: payload.name,
          email: payload.email,
          isAdmin: payload.isAdmin,
          token,
        };
        localStorage.setItem("userInfo", JSON.stringify(googleUser));
        setUser(googleUser);

        // Remove token from URL to clean up
        const url = new URL(window.location);
        url.searchParams.delete("token");
        window.history.replaceState({}, "", url);
      }
    } catch (err) {
      console.log("Failed to parse Google JWT:", err);
    }
  }, [user]);

  // --------------------- REGISTER ---------------------
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  // --------------------- LOGIN ---------------------
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  // --------------------- LOGOUT ---------------------
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  // --------------------- UPDATE PROFILE ---------------------
  const updateUser = async ({ name, email }) => {
    if (!user) throw new Error("User not logged in");
    const res = await api.put(`/users/${user._id}`, { name, email });
    const updatedUser = { ...user, name: res.data.name, email: res.data.email };
    setUser(updatedUser);
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    return updatedUser;
  };

  // --------------------- UPDATE PASSWORD ---------------------
  const updatePassword = async ({ currentPassword, newPassword }) => {
    if (!user) throw new Error("User not logged in");
    await api.put(`/users/${user._id}/password`, {
      currentPassword,
      newPassword,
    });
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // expose setUser for manual updates if needed
        register,
        login,
        logout,
        updateUser,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
