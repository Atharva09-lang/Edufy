import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Button = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={`text-center text-[14px] sm:text-[16px] px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
          active
            ? "bg-gradient-to-r from-[#0F172A] to-[#06B6D4] text-white shadow-glow hover:shadow-lg"
            : "bg-white text-[#0F172A] border border-[#E2E8F0] shadow-sm hover:bg-[#F8FAFC]"
        }`}
      >
        {children}
      </motion.div>
    </Link>
  );
};

export default Button;