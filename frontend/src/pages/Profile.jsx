import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // <-- add useNavigate
import { User, Mail, Settings, LogOut } from "lucide-react";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // <-- initialize

  if (!user)
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Please login to view profile</h2>
      </div>
    );

  // ✔ logout handler
  const handleLogout = () => {
    logout(); // remove userInfo + reset user state
    navigate("/login"); // redirect to login page (you can change to "/")
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Profile</h2>

      <div className="bg-white shadow-lg p-6 rounded-2xl border border-gray-100 flex items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <User size={22} /> {user.name}
          </h3>

          <p className="text-gray-600 flex items-center gap-2 mt-2">
            <Mail size={20} /> {user.email}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/settings"
          className="bg-gray-100 hover:bg-gray-200 transition p-4 rounded-xl shadow flex items-center gap-3 text-gray-700 font-medium"
        >
          <Settings size={22} /> Account Settings
        </Link>

        <button
          onClick={handleLogout} // <-- final fix
          className="bg-red-500 hover:bg-red-600 transition p-4 rounded-xl shadow flex items-center gap-3 text-white font-medium"
        >
          <LogOut size={22} /> Log Out
        </button>
      </div>
    </div>
  );
}
