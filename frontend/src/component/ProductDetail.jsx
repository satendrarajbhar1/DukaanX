import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { serverUrl, isAuthenticated } = useAuth();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [size, setSize] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const getProduct = async () => {
      try {
        setError(false);
        setProduct(null);
        setSize("");

        const result = await axios.get(`${serverUrl}/api/product/single/${id}`);

        if (cancelled) return;

        setProduct(result.data.product);
        setMainImage(result.data.product.image1);
      } catch (err) {
        console.log(err);
        if (!cancelled) setError(true);
      }
    };

    getProduct();

    return () => {
      cancelled = true;
    };
  }, [id, serverUrl]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-5">
        <h2 className="text-xl text-gray-600">Product not found</h2>

        <button
          onClick={() => navigate("/collection")}
          className="bg-black text-white px-8 py-3 rounded-md"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <h2 className="text-xl">Loading...</h2>
      </div>
    );
  }

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean);

 const handleCart = () => {
  if (product.sizes?.length > 0 && !size) {
    toast.error("Please select size");
    return;
  }

  addToCart(product, size);

  toast.success("Product added to cart");
};

  return (
    <div className="px-5 sm:px-10 md:px-16 lg:px-20 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* IMAGE SECTION */}
        <div>
          <div className="border rounded-xl overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          <div className="flex gap-4 mt-5 flex-wrap">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumbnail"
                onClick={() => setMainImage(img)}
                className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 ${
                  mainImage === img ? "border-black" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>

          <p className="text-2xl font-bold mt-5">₹ {product.price}</p>

          <p className="text-gray-600 mt-6 leading-7">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-3">Select Size</h3>

              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSize(item)}
                    className={`px-5 py-2 border rounded-md transition ${
                      size === item
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleCart}
            className="mt-10 bg-black text-white px-12 py-3 rounded-md hover:bg-gray-800 transition"
          >
            Add To Cart
          </button>

          <div className="mt-8 border-t pt-5 text-gray-600 text-sm space-y-2">
            <p>✓ 100% Original Product</p>
            <p>✓ Easy Return Policy</p>
            <p>✓ Fast Delivery Available</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;