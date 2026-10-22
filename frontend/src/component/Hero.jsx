import React from "react";
import { FaCircle } from "react-icons/fa";

import back1 from "../assets/back1.png";
import back2 from "../assets/back2.png";
import back3 from "../assets/back3.png";
import back4 from "../assets/back4.png";
import { useNavigate } from "react-router-dom";

function Hero({ heroData, heroCount, setHeroCount }) {
  const images = [back1, back2, back3, back4];
  const navigate = useNavigate()

  return (
    <div className="w-full h-full flex flex-col-reverse lg:flex-row">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-20 py-8">
        <h2 className="text-orange-500 text-sm sm:text-lg lg:text-xl font-semibold uppercase tracking-widest">
          {heroData.text1}
        </h2>

        <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          {heroData.text2}
        </h1>

        <p className="mt-5 text-gray-600 text-sm sm:text-base lg:text-lg">
          Discover premium fashion collections crafted for every occasion.
        </p>

        <button onClick={()=>navigate("/collection")} className="mt-8 w-40 sm:w-44 py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition">
          Shop Now
        </button>

        {/* Dots */}
        <div className="flex gap-4 mt-8">
          {[0, 1, 2, 3].map((item) => (
            <FaCircle
              key={item}
              onClick={() => setHeroCount(item)}
              className={`cursor-pointer text-sm sm:text-base ${
                heroCount === item ? "text-orange-500" : "text-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex justify-center items-center py-6 lg:py-0">
        <img
          src={images[heroCount]}
          alt=""
          className="w-[85%] sm:w-[70%] lg:w-[90%] h-auto object-contain"
        />
      </div>
    </div>
  );
}

export default Hero;
