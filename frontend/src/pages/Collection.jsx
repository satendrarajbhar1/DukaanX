import React, { useContext, useMemo, useState } from "react";
import { shopDataContext } from "../context/ShopContext";
import Card from "../component/Card";

// ye values admin panel ke category/subCategory se EXACT match honi chahiye
const categories = ["Men", "Women", "Kids"];
const subCategories = ["Topwear", "Bottomwear", "Winterwear"];

function Collection() {
  const { products, search, setSearch } = useContext(shopDataContext);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [price, setPrice] = useState("all");

  const toggle = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );

  const toggleCategory = toggle(setCategory);
  const toggleSubCategory = toggle(setSubCategory);

  const filterProducts = useMemo(() => {
    let data = [...products];

    const q = search.trim().toLowerCase();

    if (q) {
      data = data.filter((item) => item.name.toLowerCase().includes(q));
    }

    if (category.length > 0) {
      data = data.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      data = data.filter((item) => subCategory.includes(item.subCategory));
    }

    if (price === "low") data.sort((a, b) => a.price - b.price);
    if (price === "high") data.sort((a, b) => b.price - a.price);

    return data;
  }, [products, category, subCategory, price, search]);

  return (
    <div className="flex flex-col sm:flex-row gap-8 px-5 sm:px-10 md:px-16 lg:px-20 py-10">
      {/* FILTER */}

      <div className="sm:w-60 border p-5 h-fit rounded-md">
        <h2 className="text-xl font-semibold mb-5">FILTERS</h2>

        <div>
          <h3 className="font-medium mb-3">Category</h3>

          {categories.map((item) => (
            <div key={item} className="flex gap-2 mb-2">
              <input
                type="checkbox"
                checked={category.includes(item)}
                onChange={() => toggleCategory(item)}
              />

              <p>{item}</p>
            </div>
          ))}
        </div>

        <hr className="my-5" />

        <div>
          <h3 className="font-medium mb-3">Type</h3>

          {subCategories.map((item) => (
            <div key={item} className="flex gap-2 mb-2">
              <input
                type="checkbox"
                checked={subCategory.includes(item)}
                onChange={() => toggleSubCategory(item)}
              />

              <p>{item}</p>
            </div>
          ))}
        </div>

        <hr className="my-5" />

        <button
          onClick={() => {
            setCategory([]);
            setSubCategory([]);
            setPrice("all");
            setSearch("");
          }}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Clear Filter
        </button>
      </div>

      {/* PRODUCTS */}

      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Collection</h1>

          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="all">Sort By</option>
            <option value="low">Price Low To High</option>
            <option value="high">Price High To Low</option>
          </select>
        </div>

        <p className="mb-5 text-gray-500">
          {filterProducts.length} Products Found
          {search.trim() && ` for "${search.trim()}"`}
        </p>

        {filterProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl">No products match your filters</h2>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterProducts.map((item) => (
              <Card
                key={item._id}
                id={item._id}
                image={item.image1}
                name={item.name}
                price={item.price}
                bestSeller={item.bestSeller}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Collection;