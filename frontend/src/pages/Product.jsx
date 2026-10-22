import React from "react";
import LatestCollection from "../component/LatestCollection";
import BestSeller from "../component/BestSeller";

function Product() {
  return (
    <div className="px-5 sm:px-10 md:px-16 lg:px-20">
      <LatestCollection />

      <BestSeller />
    </div>
  );
}

export default Product;
