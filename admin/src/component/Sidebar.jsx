import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  MdDashboard,
  MdOutlineAddBox,
  MdOutlineInventory2,
} from "react-icons/md";

import { FiShoppingBag } from "react-icons/fi";

function Sidebar() {
  const navigate = useNavigate();

  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/",
      icon: <MdDashboard size={24} />,
    },

    {
      name: "Add Items",
      path: "/addproduct",
      icon: <MdOutlineAddBox size={24} />,
    },

    {
      name: "List Items",
      path: "/list",
      icon: <MdOutlineInventory2 size={24} />,
    },

    {
      name: "View Orders",
      path: "/orders",
      icon: <FiShoppingBag size={24} />,
    },
  ];

  return (
    <div className="w-64 min-h-[calc(100vh-80px)] bg-white border-r shadow-sm">
      <div className="flex flex-col gap-4 py-8">
        {menu.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className={`
flex items-center gap-3 ml-4 px-5 py-3 rounded-l-xl cursor-pointer transition-all duration-300

${
  location.pathname === item.path
    ? "bg-orange-500 text-white"
    : "text-gray-700 hover:bg-orange-100 hover:text-orange-500"
}

`}
          >
            {item.icon}

            <p className="font-medium text-lg">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
