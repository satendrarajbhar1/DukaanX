import React, { useContext } from "react";
import { shopDataContext } from "../context/ShopContext";
import Card from "./Card";
import Title from "./Title";

function BestSeller() {
  const { products } = useContext(shopDataContext);

  const bestSeller = products.filter((item) => item.bestSeller);

  return (
    <div className="my-16">
      <div className="text-center">
        <Title text1="BEST" text2="SELLERS" />

        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-3">
          Discover our most loved and best-selling products.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
        {bestSeller.map((item) => (
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

export default BestSeller;