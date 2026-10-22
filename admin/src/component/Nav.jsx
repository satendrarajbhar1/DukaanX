import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { adminDataContext } from "../context/AdminContext";
import logo from "../assets/logo.png";

function Nav() {
  const navigate = useNavigate();

  const { serverUrl } = useContext(authDataContext);
  const { getAdmin, adminData } = useContext(adminDataContext);

  const logout = async () => {
  try {
    await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
    await getAdmin(); 
  } catch (error) {
    console.log(error.response?.data || error);
  }
};

  return (
    <nav className="w-full h-20 bg-white shadow-md flex items-center justify-between px-8 sticky top-0 z-50">
      {/* Left */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <img src={logo} alt="DukaanX Logo"  className="w-12 h-12" />

        <div>
          <h1 className="text-2xl font-bold text-orange-500">DukaanX</h1>
          <p className="text-xs text-gray-500">Admin Dashboard</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
            {adminData?.email?.charAt(0).toUpperCase() || "A"}
          </div>

          <div className="hidden md:block">
            <h2 className="font-semibold text-gray-800">Admin</h2>
            <p className="text-sm text-gray-500">{adminData?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold transition duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Nav;
