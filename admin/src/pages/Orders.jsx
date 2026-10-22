import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { adminDataContext } from "../context/AdminContext";

// backend ke ORDER_STATUSES se exact match
const STATUSES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Cancelled",
];

function Orders() {
  const { serverUrl } = useContext(adminDataContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/allorders`, {
        withCredentials: true,
      });

      setOrders(result.data.orders || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/status`,
        { orderId, status },
        { withCredentials: true },
      );

      if (result.data.success) {
        toast.success("Status updated");
        getOrders(); // COD ka payment status bhi refresh ho jaye
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return <div className="p-10 text-xl">Loading Orders...</div>;
  }

  return (
    <div className="p-5 md:p-10">
      <h1 className="text-3xl font-semibold mb-8">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-gray-500">No Orders Found</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl p-5 bg-white shadow-sm"
            >
              <div className="flex justify-between flex-wrap gap-5 mb-5">
                <div>
                  <h2 className="font-semibold">Customer</h2>
                  <p>{order.userId?.name || "Deleted user"}</p>
                  <p className="text-gray-500 text-sm">{order.userId?.email}</p>
                </div>

                <div>
                  <h2 className="font-semibold">Amount</h2>
                  <p className="font-medium">₹ {order.amount}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Method : {order.paymentMethod}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      order.payment
                        ? "bg-green-100 text-green-700"
                        : order.paymentMethod === "COD"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.payment
                      ? "Paid"
                      : order.paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : "Not Paid"}
                  </span>
                </div>

                <div>
                  <h2 className="font-semibold">Status</h2>

                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded px-3 py-2"
                  >
                    {order.status === "Pending Payment" && (
                      <option disabled>Pending Payment</option>
                    )}

                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <hr />

              <div className="mt-5 space-y-4">
                <h3 className="font-semibold">Products</h3>

                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity : {item.quantity}
                      </p>
                      {item.size && (
                        <p className="text-sm text-gray-600">
                          Size : {item.size}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t pt-4">
                <h3 className="font-semibold">Delivery Address</h3>
                <p>
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <p>{order.address?.phone}</p>
                <p>
                  {order.address?.street}, {order.address?.city},{" "}
                  {order.address?.state}
                </p>
                <p>{order.address?.pincode}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;