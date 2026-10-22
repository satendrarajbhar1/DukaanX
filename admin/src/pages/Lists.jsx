import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { authDataContext } from "../context/AuthContext";

function Lists() {
  const { serverUrl } = useContext(authDataContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/product/list`, {
        withCredentials: true,
      });

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/product/remove/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message);
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Product List</h2>

      {loading ? (
        <div className="text-center text-xl font-semibold">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No Products Found
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Image</th>

                <th className="p-4 text-left">Name</th>

                <th className="p-4 text-left">Category</th>

                <th className="p-4 text-left">Price</th>

                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={item.image1}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>

                  <td className="p-4 font-medium">{item.name}</td>

                  <td className="p-4">{item.category}</td>

                  <td className="p-4">₹{item.price}</td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Lists;
