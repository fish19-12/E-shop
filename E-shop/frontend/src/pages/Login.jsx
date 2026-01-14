import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 NEW
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-pink-200 to-rose-200 p-4">
      <div className="bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Fisho-Fashion Logo"
            className="w-20 h-20 object-cover rounded-full shadow-md"
          />
          <h1 className="text-3xl font-extrabold tracking-wide mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Fisho-Fashion
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Welcome back — login to continue
          </p>
        </div>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-center shadow-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Email
            </label>
            <div className="flex items-center border rounded-xl bg-white/60 backdrop-blur-sm px-4 focus-within:ring-2 focus-within:ring-purple-400 transition">
              <i className="ri-mail-line text-gray-500 mr-2"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full py-3 bg-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Password with eye toggle */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Password
            </label>

            <div className="flex items-center border rounded-xl bg-white/60 backdrop-blur-sm px-4 focus-within:ring-2 focus-within:ring-purple-400 transition relative">
              <i className="ri-lock-line text-gray-500 mr-2"></i>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full py-3 bg-transparent outline-none"
                required
              />

              {/* 👁️ Eye Icon */}
              <i
                className={`${
                  showPassword ? "ri-eye-off-line" : "ri-eye-line"
                } absolute right-3 text-xl text-gray-600 cursor-pointer hover:text-black transition`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-bold transition-all shadow-lg
              ${
                loading
                  ? "bg-purple-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
              }
            `}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700">
          Don’t have an account?{" "}
          <span
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
