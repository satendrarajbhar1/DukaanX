import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  MdInventory,
  MdShoppingCart,
  MdPendingActions,
  MdAttachMoney,
} from "react-icons/md";
import { authDataContext } from "../context/AuthContext";

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500">{label}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </div>
      {icon}
    </div>
  );
}

function Dashboard() {
  const { serverUrl } = useContext(authDataContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/admin/dashboard`, {
          withCredentials: true,
        });

        if (res.data.success) setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getDashboard();
  }, [serverUrl]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-full text-xl p-10">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome Back Admin 👋</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          label="Total Products"
          value={data.stats.products}
          icon={<MdInventory size={45} className="text-orange-500" />}
        />
        <StatCard
          label="Total Orders"
          value={data.stats.orders}
          icon={<MdShoppingCart size={45} className="text-blue-500" />}
        />
        <StatCard
          label="Revenue"
          value={`₹ ${data.stats.revenue}`}
          icon={<MdAttachMoney size={45} className="text-green-500" />}
        />
        <StatCard
          label="Pending Orders"
          value={data.stats.pending}
          icon={<MdPendingActions size={45} className="text-red-500" />}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-10">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-5">Recent Orders</h2>

          <div className="flex flex-col gap-4">
            {data.recentOrders.length === 0 ? (
              <p className="text-gray-500">No Orders Found</p>
            ) : (
              data.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="font-semibold">
                      {order.address?.firstName || "Customer"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.date?.slice(0, 10)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₹ {order.amount}</p>
                    <span className="text-sm text-orange-500">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-5">Latest Products</h2>

          <div className="flex flex-col gap-4">
            {data.latestProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-4 border-b pb-3"
              >
                <img
                  src={product.image1}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />

                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-gray-500">₹ {product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;