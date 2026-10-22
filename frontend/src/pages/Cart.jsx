import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { shopDataContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const { cartItems, removeFromCart, updateQuantity, getCartAmount } =
    useContext(CartContext);
  const { currency, delivery_fee } = useContext(shopDataContext);
  const { isAuthenticated } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    navigate("/checkout");
  };

  const goToAuth = (path) => {
    navigate(path, { state: { from: "/checkout" } });
  };

  return (
    <div className="px-5 sm:px-10 md:px-16 lg:px-20 py-10">
      <h1 className="text-3xl font-semibold mb-10">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <h2 className="text-2xl text-gray-500">Your cart is empty</h2>

          <button
            onClick={() => navigate("/collection")}
            className="bg-black text-white px-8 py-3 rounded-md"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          {/* CART ITEMS */}

          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item) => (
              <div
                key={`${item._id}-${item.size}`}
                className="border rounded-xl p-4 flex gap-5 items-center bg-white shadow-sm"
              >
                <img
                  src={item.image1}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>

                  <p className="text-gray-600 mt-1">
                    {currency}
                    {item.price}
                  </p>

                  {item.size && (
                    <p className="text-sm text-gray-500 mt-1">
                      Size : {item.size}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.size, item.quantity - 1)
                      }
                      className="border px-3 py-1 rounded hover:bg-gray-100"
                    >
                      -
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.size, item.quantity + 1)
                      }
                      className="border px-3 py-1 rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item._id, item.size)}
                  className="text-red-500 font-medium hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* SUMMARY */}

          <div className="border rounded-xl p-6 h-fit shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Cart Summary</h2>

            <div className="flex justify-between mb-3">
              <p>Subtotal</p>
              <p className="font-medium">
                {currency}
                {getCartAmount()}
              </p>
            </div>

            <div className="flex justify-between mb-3">
              <p>Delivery Fee</p>
              <p className="font-medium">
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

            <button
              onClick={handleCheckout}
              className="mt-8 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}

      {/* LOGIN / SIGNUP POPUP */}

      {showAuthModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-sm text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2">Almost there!</h2>

            <p className="text-gray-500 mb-6">
              Login or create an account to complete your order. Your cart will
              be saved.
            </p>

            <button
              onClick={() => goToAuth("/login")}
              className="w-full bg-black text-white py-3 rounded-lg mb-3"
            >
              Login
            </button>

            <button
              onClick={() => goToAuth("/signup")}
              className="w-full border border-black py-3 rounded-lg"
            >
              Create Account
            </button>

            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-4 text-sm text-gray-500"
            >
              Continue browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;