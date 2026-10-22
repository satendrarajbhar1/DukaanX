import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Add from "./pages/Add";
import Orders from "./pages/Orders";
import Lists from "./pages/Lists";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

import { adminDataContext } from "./context/AdminContext";

function App() {
  const { adminData, loading } = useContext(adminDataContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (!adminData) return <Login />;

  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<Dashboard />} />
        <Route path="addproduct" element={<Add />} />
        <Route path="orders" element={<Orders />} />
        <Route path="list" element={<Lists />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;