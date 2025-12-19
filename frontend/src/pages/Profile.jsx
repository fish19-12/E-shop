import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Settings, LogOut, Home } from "lucide-react";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user)
    return (
      <div className="p-6 text-center mt-32">
        <h2 className="text-xl font-semibold text-gray-700">
          Please login to view your profile
        </h2>
      </div>
    );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex flex-col items-center pt-20 px-4">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 tracking-wide">
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full max-w-4xl transform transition hover:scale-105 hover:shadow-pink-300/50">
        <div className="w-32 h-32 md:w-36 md:h-36 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-6xl font-extrabold shadow-lg">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 flex items-center gap-3 justify-center md:justify-start">
            <User size={26} /> {user.name}
          </h3>

          <p className="text-gray-600 flex items-center gap-2 mt-2 justify-center md:justify-start text-lg">
            <Mail size={22} /> {user.email}
          </p>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-pink-600 hover:to-purple-600 transition transform hover:scale-105 font-semibold tracking-wide"
        >
          <Home size={20} /> Back to Home
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link
          to="/settings"
          className="bg-white hover:bg-gray-100 transition p-6 rounded-2xl shadow-lg flex items-center gap-3 justify-center font-medium text-gray-800 hover:scale-105 transform hover:shadow-pink-200"
        >
          <Settings size={24} /> Account Settings
        </Link>

        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition p-6 rounded-2xl shadow-lg flex items-center gap-3 justify-center text-white font-medium hover:scale-105 transform"
        >
          <LogOut size={24} /> Log Out
        </button>
      </div>
    </div>
  );
}
