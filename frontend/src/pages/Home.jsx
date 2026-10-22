import React, { useEffect, useState } from "react";
import Hero from "../component/Hero";
import Product from "./Product";

function Home() {
  const heroData = [
    {
      text1: "Flat 30% OFF",
      text2: "Elevate Your Everyday Style",
    },
    {
      text1: "Latest Fashion Arrivals",
      text2: "Be Bold. Be Unique.",
    },
    {
      text1: "Exclusive Collection",
      text2: "Designed for Every Occasion",
    },
    {
      text1: "Free Shipping on Orders ₹999+",
      text2: "Fashion Delivered to Your Doorstep",
    },
  ];

  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setHeroCount((prevCount) => (prevCount === 3 ? 0 : prevCount + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#f8f5f2] overflow-hidden">
      <Hero
        heroData={heroData[heroCount]}
        heroCount={heroCount}
        setHeroCount={setHeroCount}
      />

      <Product />
    </div>
  );
}

export default Home;
