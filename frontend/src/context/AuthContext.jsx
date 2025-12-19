import { createContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (err) {
      return null;
    }
  });

  // REGISTER
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  // LOGIN
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  // UPDATE PROFILE
  const updateUser = async ({ name, email }) => {
    if (!user) throw new Error("User not logged in");

    const res = await api.put(`/users/${user._id}`, { name, email });
    const updatedUser = { ...user, name: res.data.name, email: res.data.email };
    setUser(updatedUser);
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    return updatedUser;
  };

  // UPDATE PASSWORD
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
