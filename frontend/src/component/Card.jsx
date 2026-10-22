import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";

function Card({ id, image, name, price, category, bestSeller }) {
  const { currency } = useContext(shopDataContext);

  return (
    <Link
      to={`/product/${id}`}
      className="
group 
relative
border 
rounded-xl 
overflow-hidden 
bg-white 
hover:shadow-xl 
transition-all 
duration-300
"
    >
      {/* IMAGE */}

      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="
w-full 
h-64
sm:h-72
object-cover
group-hover:scale-110
transition
duration-500
"
        />

        {bestSeller && (
          <span
            className="
absolute
top-3
left-3
bg-black
text-white
text-xs
px-3
py-1
rounded-full
"
          >
            Best Seller
          </span>
        )}
      </div>

      {/* DETAILS */}

      <div className="p-4">
        <h3
          className="
font-medium
text-gray-800
truncate
"
        >
          {name}
        </h3>

        {category && <p className="text-sm text-gray-500 mt-1">{category}</p>}

        <p
          className="
text-lg
font-semibold
mt-3
"
        >
          {currency} {price}
        </p>
      </div>
    </Link>
  );
}

export default Card;
