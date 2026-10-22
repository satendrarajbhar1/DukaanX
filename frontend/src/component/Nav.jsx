import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import logo from "../assets/logo.png";

import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { shopDataContext } from "../context/ShopContext";

import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";

function Nav() {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useContext(CartContext);
  const { search, setSearch } = useContext(shopDataContext);

  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    try {
      await logout();
      setMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  const toggleSearch = () => {
    if (showSearch) setSearch(""); // search bar band karte hi filter bhi hat jaye
    setShowSearch(!showSearch);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/collection");
  };

  return (
    <>
      <nav className="w-full bg-white shadow-md px-4 md:px-10 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}

          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-10 h-10 md:w-12 md:h-12" />

            <h1 className="text-xl md:text-2xl font-bold text-blue-600">
              DukaanX
            </h1>
          </Link>

          {/* Desktop Menu */}

          <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/collection">Collections</Link>
            </li>

            <li>
              <Link to="/about">About</Link>
            </li>

            <li>
              <Link to="/contact">Contact</Link>
            </li>

            {isAuthenticated && (
              <li>
                <Link to="/orders">My Orders</Link>
              </li>
            )}
          </ul>

          {/* Right Side */}

          <div className="flex items-center gap-5 text-xl md:text-2xl">
            <button onClick={toggleSearch} aria-label="Search">
              <FiSearch />
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="hidden md:block bg-red-500 text-white text-sm px-4 py-2 rounded-md"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" aria-label="Login">
                <FiUser />
              </Link>
            )}

            <Link to="/cart" className="relative" aria-label="Cart">
              <FiShoppingCart />

              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            </Link>

            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-5 py-3 border-b"
          >
            Home
          </Link>

          <Link
            to="/collection"
            onClick={() => setMenuOpen(false)}
            className="block px-5 py-3 border-b"
          >
            Collections
          </Link>

          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block px-5 py-3 border-b"
          >
            About
          </Link>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block px-5 py-3 border-b"
          >
            Contact
          </Link>

          {isAuthenticated && (
            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-3 border-b"
            >
              My Orders
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <div className="px-5 py-3 border-b text-gray-600">
                Hi, {user?.fullName || user?.name}
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-5 py-3 text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-3"
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* Search */}

      {showSearch && (
        <form
          onSubmit={handleSearch}
          className="bg-white shadow-md px-4 md:px-10 py-4"
        >
          <div className="max-w-2xl mx-auto flex border rounded-full overflow-hidden">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="flex-1 px-5 py-3 outline-none"
            />

            <button type="submit" className="bg-blue-600 text-white px-6">
              Search
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default Nav;