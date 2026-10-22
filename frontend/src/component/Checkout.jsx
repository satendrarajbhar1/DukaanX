import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { shopDataContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function Checkout() {
  const { cartItems, getCartAmount, clearCart } = useContext(CartContext);
  const { currency, delivery_fee } = useContext(shopDataContext);
  const { serverUrl } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validate = () => {
    for (const key in address) {
      if (!address[key].trim()) return "Please fill all address details";
    }

    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
      return "Enter a valid 10-digit phone number";
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      return "Enter a valid 6-digit pincode";
    }

    return null;
  };

  // ===========================
  // RAZORPAY PAYMENT
  // ===========================

  const initPay = async (data) => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Could not load payment gateway. Check your connection.");
      return false;
    }

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "DukaanX",
      description: "Order Payment",
      order_id: data.order.id,

      handler: async (response) => {
        try {
          const verify = await axios.post(
            `${serverUrl}/api/order/verify`,
            response,
            { withCredentials: true },
          );

          if (verify.data.success) {
            toast.success("Payment successful");
            clearCart();
            navigate("/orders");
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          console.log(error);
          toast.error(
            "Payment verification failed. If money was deducted, please contact support.",
          );
        } finally {
          setLoading(false);
        }
      },

      modal: {
        ondismiss: () => {
          setLoading(false);
          toast.info("Payment cancelled");
        },
      },

      prefill: {
        name: `${address.firstName} ${address.lastName}`.trim(),
        contact: address.phone,
      },

      theme: { color: "#000000" },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", () => {
      toast.error("Payment failed. Please try again.");
    });

    razorpay.open();

    return true;
  };

  // ===========================
  // PLACE ORDER
  // ===========================

  const placeOrder = async () => {
    if (loading) return;

    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const error = validate();

    if (error) {
      toast.error(error);
      return;
    }

    let waitingForPayment = false;

    try {
      setLoading(true);

      // backend ko sirf yahi chahiye; price/name/image server DB se leta hai
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          size: item.size,
        })),
        address: Object.fromEntries(
          Object.entries(address).map(([k, v]) => [k, v.trim()]),
        ),
      };

      if (paymentMethod === "COD") {
        const response = await axios.post(
          `${serverUrl}/api/order/place`,
          orderData,
          { withCredentials: true },
        );

        if (response.data.success) {
          toast.success("Order placed successfully");
          clearCart();
          navigate("/orders");
        }
      } else {
        const response = await axios.post(
          `${serverUrl}/api/order/razorpay`,
          orderData,
          { withCredentials: true },
        );

        if (response.data.success) {
          waitingForPayment = await initPay(response.data);
        }
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      // Razorpay modal khula hai to loading tab tak chalu rahe jab tak wo band na ho
      if (!waitingForPayment) setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h2 className="text-2xl text-gray-500 mb-6">Your cart is empty</h2>

        <button
          onClick={() => navigate("/collection")}
          className="bg-black text-white px-8 py-3 rounded-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 sm:px-10 md:px-16 lg:px-20 py-10">
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* LEFT */}

        <div>
          <h2 className="text-xl font-semibold mb-5">Delivery Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First Name"
              value={address.firstName}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <input
              name="lastName"
              placeholder="Last Name"
              value={address.lastName}
              onChange={handleChange}
              className="border p-3 rounded"
            />
          </div>

          <input
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
            className="border p-3 rounded w-full mt-4"
          />

          <input
            name="street"
            placeholder="Street Address"
            value={address.street}
            onChange={handleChange}
            className="border p-3 rounded w-full mt-4"
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <input
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <input
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              className="border p-3 rounded"
            />
          </div>

          <input
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleChange}
            maxLength={6}
            inputMode="numeric"
            className="border p-3 rounded w-full mt-4"
          />
        </div>

        {/* RIGHT */}

        <div className="border rounded-xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

          {cartItems.map((item) => (
            <div
              key={`${item._id}-${item.size}`}
              className="flex justify-between items-center mb-3"
            >
              <div>
                <p className="font-medium">{item.name}</p>

                <p className="text-sm text-gray-500">
                  Qty : {item.quantity}
                  {item.size && ` | Size : ${item.size}`}
                </p>
              </div>

              <p>
                {currency}
                {item.price * item.quantity}
              </p>
            </div>
          ))}

          <hr className="my-5" />

          <div className="flex justify-between mb-2">
            <p>Subtotal</p>
            <p>
              {currency}
              {getCartAmount()}
            </p>
          </div>

          <div className="flex justify-between mb-2">
            <p>Delivery Fee</p>
            <p>
              {currency}
              {delivery_fee}
            </p>
          </div>

          <hr className="my-5" />

          <div className="flex justify-between text-xl font-bold">
            <p>Total</p>
            <p>
              {currency}
              {getCartAmount() + delivery_fee}
            </p>
          </div>

          {/* PAYMENT METHOD */}

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

            <div className="space-y-3">
              <label className="flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer hover:border-black transition">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />

                  <span>Cash On Delivery</span>
                </div>
              </label>

              <label className="flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer hover:border-blue-500 transition">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "Razorpay"}
                    onChange={() => setPaymentMethod("Razorpay")}
                  />

                  <span>Razorpay</span>
                </div>

                <img
                  src="https://razorpay.com/assets/razorpay-logo.svg"
                  alt="Razorpay"
                  className="h-6"
                />
              </label>
            </div>
          </div>

          <button
            disabled={loading}
            onClick={placeOrder}
            className="mt-8 w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Processing..."
              : paymentMethod === "COD"
                ? "Place Order"
                : "Proceed To Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;