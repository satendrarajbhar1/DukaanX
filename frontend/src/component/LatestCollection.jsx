import React, { useContext, useEffect, useState } from "react";
import { shopDataContext } from "../context/ShopContext";
import Title from "./Title";
import Card from "./Card";

function LatestCollection() {
  const { products } = useContext(shopDataContext);

  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 8));
  }, [products]);

  return (
    <div className="my-16">
      <div className="text-center">
        <Title text1="LATEST" text2="COLLECTIONS" />

        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-3">
          Step Into Style - New Collections Dropping This Season.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
        {latestProducts.map((item) => (
          <Card
            key={item._id}
            id={item._id}
            image={item.image1}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
}

export default LatestCollection;
