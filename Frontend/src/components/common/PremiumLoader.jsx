import { motion } from "framer-motion"

export default function PremiumLoader({ size = "md", className = "" }) {
  const sizeMap = {
    sm: { container: "h-8 w-8", dot: "h-1.5 w-1.5" },
    md: { container: "h-12 w-12", dot: "h-2 w-2" },
    lg: { container: "h-16 w-16", dot: "h-2.5 w-2.5" },
  }

  const { container, dot } = sizeMap[size] || sizeMap.md
  const dotCount = 3

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Glow backdrop */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-edupurple-50/20 blur-xl" />
        <div className={`relative flex items-center justify-center gap-1.5 ${container}`}>
          {Array.from({ length: dotCount }).map((_, i) => (
            <motion.div
              key={i}
              className={`rounded-full bg-gradient-to-r from-edupurple-50 to-edupurple-500 ${dot}`}
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
      <motion.p
        className="text-xs font-medium text-richblack-300"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading...
      </motion.p>
    </div>
  )
}
