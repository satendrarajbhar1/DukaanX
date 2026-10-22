import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const POLL_MS = 30000; // 30 sec

function MyOrders() {
  const { serverUrl, loading, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    const getOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/userorders`, {
          withCredentials: true,
        });

        setOrders(result.data.orders || []);
      } catch (error) {
        console.log(error.response?.data || error);
      } finally {
        setOrderLoading(false);
      }
    };

    getOrders();

    const interval = setInterval(getOrders, POLL_MS);

    return () => clearInterval(interval);
  }, [loading, isAuthenticated, serverUrl]);

  if (orderLoading || loading) {
    return (
      <div className="flex justify-center items-center h-60">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="px-5 sm:px-10 md:px-16 lg:px-20 py-10">
      <h1 className="text-3xl font-semibold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <h2 className="text-xl">No orders found</h2>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl p-5 bg-white shadow-sm"
            >
              <div className="flex justify-between flex-wrap gap-4 mb-5">
                <div>
                  <p className="font-semibold">Order ID</p>
                  <p className="text-gray-500 text-sm">{order._id}</p>
                </div>

                <div>
                  <p className="font-semibold">Date</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(order.date).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Status</p>
                  <p className="text-blue-600 font-medium">{order.status}</p>
                </div>

                <div>
                  <p className="font-semibold">Payment</p>
                  <p className="text-sm">
                    {order.paymentMethod} ·{" "}
                    <span
                      className={
                        order.payment ? "text-green-600" : "text-orange-500"
                      }
                    >
                      {order.payment ? "Paid" : "Pending"}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Amount</p>
                  <p>₹ {order.amount}</p>
                </div>
              </div>

              <hr />

              <div className="mt-5 space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div>
                      <h3 className="font-semibold">{item.name}</h3>

                      <p className="text-gray-600">Quantity: {item.quantity}</p>

                      {item.size && (
                        <p className="text-gray-600">Size: {item.size}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;