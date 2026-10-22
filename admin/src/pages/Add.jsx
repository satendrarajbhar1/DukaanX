import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import upload from "../assets/upload.png";
import { authDataContext } from "../context/AuthContext";

const SIZES = ["S", "M", "L", "XL", "XXL"];

function Add() {
  const { serverUrl } = useContext(authDataContext);

  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [loading, setLoading] = useState(false);

  const setImage = (index, file) =>
    setImages((prev) => prev.map((img, i) => (i === index ? file : img)));

  const toggleSize = (size) =>
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!images[0]) return toast.error("First image is required");
    if (!name.trim() || !description.trim())
      return toast.error("Name and description are required");
    if (!price || Number(price) <= 0) return toast.error("Enter a valid price");
    if (sizes.length === 0) return toast.error("Select at least one size");

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));

      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img);
      });

      const { data } = await axios.post(
        `${serverUrl}/api/product/addproduct`,
        formData,
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);

        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setSizes([]);
        setBestSeller(false);
        setImages([null, null, null, null]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen">
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-lg shadow-md max-w-5xl"
      >
        <h2 className="text-3xl font-bold mb-8">Add Product</h2>

        <p className="font-semibold mb-4">Upload Images (first is required)</p>

        <div className="flex gap-4 flex-wrap">
          {images.map((img, i) => (
            <label
              key={i}
              htmlFor={`image${i + 1}`}
              className="cursor-pointer border rounded-lg p-2 hover:border-blue-500"
            >
              <img
                src={img ? URL.createObjectURL(img) : upload}
                className="w-28 h-28 object-cover"
                alt=""
              />

              <input
                hidden
                id={`image${i + 1}`}
                type="file"
                accept="image/*"
                onChange={(e) => setImage(i, e.target.files[0] || null)}
              />
            </label>
          ))}
        </div>

        <div className="mt-6">
          <p className="mb-2 font-semibold">Product Name</p>
          <input
            type="text"
            placeholder="Type here"
            className="w-full border rounded-lg p-3 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <p className="mb-2 font-semibold">Product Description</p>
          <textarea
            rows="5"
            placeholder="Write description..."
            className="w-full border rounded-lg p-3 outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div>
            <p className="mb-2 font-semibold">Category</p>
            <select
              className="border p-3 rounded-lg w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>
          </div>

          <div>
            <p className="mb-2 font-semibold">Sub Category</p>
            <select
              className="border p-3 rounded-lg w-full"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Winterwear</option>
            </select>
          </div>

          <div>
            <p className="mb-2 font-semibold">Price</p>
            <input
              type="number"
              min="1"
              placeholder="1000"
              className="border rounded-lg p-3 w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 font-semibold">Product Sizes</p>

          <div className="flex gap-3 flex-wrap">
            {SIZES.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-5 py-2 rounded-lg border ${
                  sizes.includes(size) ? "bg-black text-white" : "bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 mt-8 cursor-pointer">
          <input
            type="checkbox"
            checked={bestSeller}
            onChange={() => setBestSeller(!bestSeller)}
          />
          <span className="font-medium">Add to Bestseller</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 bg-black text-white px-10 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "ADDING..." : "ADD PRODUCT"}
        </button>
      </form>
    </div>
  );
}

export default Add;