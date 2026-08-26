import React from "react";

const HighlightText = ({ text }) => {
  return (
    <span className="bg-gradient-to-r from-[#06B6D4] via-[#38BDF8] to-[#0891B2] bg-clip-text font-extrabold text-transparent">
      {" "}
      {text}
    </span>
  );
};

export default HighlightText;