import { motion } from "framer-motion"

export default function IconBtn({
    text,
    onclick,
    children,
    disabled,
    outline = false,
    customClasses,
    type,
  }) {
    return (
      <motion.button
        whileHover={disabled ? {} : { scale: 1.03 }}
        whileTap={disabled ? {} : { scale: 0.97 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        disabled={disabled}
        onClick={onclick}
        className={`flex items-center ${
          outline ? "border border-edupurple-50 bg-transparent" : "bg-edupurple-50"
        } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${customClasses}`}
        type={type}
      >
        {children ? (
          <>
            <span className={`${outline && "text-edupurple-50"}`}>{text}</span>
            {children}
          </>
        ) : (
          text
        )}
      </motion.button>
    )
  }