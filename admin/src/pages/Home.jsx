import React from "react";
import Nav from "../component/Nav";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Home;
