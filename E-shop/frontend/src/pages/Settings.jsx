import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Save, ArrowLeft } from "lucide-react";

export default function Settings() {
  const { user, updateUser, updatePassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user)
    return (
      <div className="p-6 text-center mt-28">
        <h2 className="text-xl font-semibold text-gray-700">
          Please login to access Settings
        </h2>
      </div>
    );

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await updateUser({ name, email });
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
    setLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await updatePassword({ currentPassword, newPassword });
      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update password");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-700 font-semibold hover:text-pink-500 transition"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>
        <h2 className="text-3xl font-bold text-gray-800">
          Fisho-Fashion Account Settings
        </h2>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg shadow-sm animate-pulse">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg shadow-sm animate-pulse">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Profile Info Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 hover:scale-[1.02] transition-transform duration-300">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-gray-900">
            <User size={24} /> Profile Information
          </h3>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div>
              <label className="block text-gray-600 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition transform shadow-lg"
            >
              <Save size={20} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Password Update Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 hover:scale-[1.02] transition-transform duration-300">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-gray-900">
            <Lock size={24} /> Change Password
          </h3>

          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            <div>
              <label className="block text-gray-600 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition transform shadow-lg"
            >
              <Save size={20} /> {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
