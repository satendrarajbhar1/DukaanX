import React from "react";

function Title({ text1, text2 }) {
  return (
    <div className="inline-flex items-center gap-3 mb-2">
      <p className="text-3xl font-semibold">
        <span className="text-gray-500">{text1}</span>{" "}
        <span className="text-black">{text2}</span>
      </p>

      <span className="w-14 md:w-20 h-[2px] bg-black"></span>
    </div>
  );
}

export default Title;
