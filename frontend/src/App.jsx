import { useEffect } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Nav from "./component/Nav";

import Home from "./pages/Home";
import Registration from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Cart from "./pages/cart";

import ProductDetails from "./component/ProductDetail";
import Checkout from "./component/Checkout";
import MyOrders from "./component/MyOrders";
import ForgotPassword from "./pages/ForgotPassword";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-gray-500">This page does not exist</p>
      <Link to="/" className="bg-black text-white px-8 py-3 rounded-md">
        Go Home
      </Link>
    </div>
  );
}

function App() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  // login/signup ke baad kahan wapas jana hai
  const from = location.state?.from || "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl">Loading...</h2>
      </div>
    );
  }

  // sirf checkout aur orders ke liye login zaroori; login ke baad yahin wapas aayega
  const protect = (element) =>
    isAuthenticated ? (
      element
    ) : (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );

  return (
    <>
      {!hideNavbar && <Nav />}

      <Routes>
        {/* PUBLIC: koi bhi dekh sakta hai */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        {/* LOGIN REQUIRED */}
        <Route path="/checkout" element={protect(<Checkout />)} />
        <Route path="/orders" element={protect(<MyOrders />)} />

        {/* AUTH PAGES */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to={from} replace /> : <Login />
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to={from} replace /> : <Registration />
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;