import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ShopContext from "./context/ShopContext";
import CartProvider from "./context/CartContext.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ShopContext>
          <CartProvider>
            <App />

            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="light"
            />
          </CartProvider>
        </ShopContext>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);