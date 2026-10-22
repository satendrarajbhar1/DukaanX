import React, { useContext, useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { authDataContext } from "../context/AuthContext";
import { adminDataContext } from "../context/AdminContext";

function Login() {
  const { serverUrl } = useContext(authDataContext);
  const { getAdmin } = useContext(adminDataContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${serverUrl}/api/auth/adminlogin`,
        { email, password },
        { withCredentials: true },
      );

      await getAdmin();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center items-center bg-orange-500 text-white p-10">
          <FaUserShield className="text-8xl mb-6" />
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <p className="text-center mt-4 text-orange-100">
            Manage products, orders and users from one secure dashboard.
          </p>
        </div>

        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-500 mt-2">Login to continue</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="text-gray-600 text-sm">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold duration-300 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;