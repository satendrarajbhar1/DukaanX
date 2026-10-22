import React from "react";

import back1 from "../assets/back1.png";
import back2 from "../assets/back2.png";
import back3 from "../assets/back3.png";
import back4 from "../assets/back4.png";

function Background({ heroCount }) {
  const images = [back1, back2, back3, back4];

  return (
    <div className="w-1/2 h-screen">
      <img
        src={images[heroCount]}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default Background;