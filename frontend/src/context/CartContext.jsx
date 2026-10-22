import React, { createContext, useContext, useEffect, useState } from "react";
import { shopDataContext } from "./ShopContext";

export const CartContext = createContext();

const MAX_QTY = 20; // backend ki limit ke barabar

function CartProvider({ children }) {
  const { products } = useContext(shopDataContext);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart"));

      if (!Array.isArray(saved)) return [];

      // purane format (poora product object) ko bhi slim format mein convert karta hai
      return saved
        .filter((i) => i && i._id && Number(i.quantity) > 0)
        .map((i) => ({
          _id: i._id,
          name: i.name,
          price: Number(i.price),
          image1: i.image1,
          size: i.size || "",
          quantity: Math.min(Number(i.quantity), MAX_QTY),
        }));
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Latest products ke saath cart sync: price/name/image update, deleted ya invalid size wale items hatao
  useEffect(() => {
    if (!products || products.length === 0) return;

    setCartItems((prev) => {
      let changed = false;
      const next = [];

      for (const item of prev) {
        const p = products.find((x) => x._id === item._id);

        if (!p || (item.size && !p.sizes?.includes(item.size))) {
          changed = true;
          continue;
        }

        if (
          p.price !== item.price ||
          p.name !== item.name ||
          p.image1 !== item.image1
        ) {
          changed = true;
          next.push({
            ...item,
            price: p.price,
            name: p.name,
            image1: p.image1,
          });
        } else {
          next.push(item);
        }
      }

      return changed ? next : prev;
    });
  }, [products]);

  const addToCart = (product, size = "") => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item._id === product._id && item.size === size,
      );

      if (existing) {
        return prev.map((item) =>
          item._id === product._id && item.size === size
            ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QTY) }
            : item,
        );
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image1: product.image1,
          size,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id, size = "") => {
    setCartItems((prev) =>
      prev.filter((item) => !(item._id === id && item.size === size)),
    );
  };

  const updateQuantity = (id, size = "", quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    const safeQty = Math.min(quantity, MAX_QTY);

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id && item.size === size
          ? { ...item, quantity: safeQty }
          : item,
      ),
    );
  };

  const getCartAmount = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const value = {
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartAmount,
    getCartCount,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;