import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const { serverUrl } = useAuth();

  const currency = "₹";
  const delivery_fee = 30; // backend ke DELIVERY_FEE ke barabar rakhna

  const getProducts = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/product/list`);

      if (result.data.success) {
        setProducts(result.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const value = {
    products,
    setProducts,
    currency,
    delivery_fee,
    getProducts,
    search,
    setSearch,
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;