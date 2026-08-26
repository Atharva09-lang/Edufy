import { motion } from "framer-motion"

export default function GradientOrbs({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[10%] top-[10%] h-72 w-72 rounded-full bg-edupurple-50 opacity-20 blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, -40, 25, 0],
          y: [0, 30, -35, 0],
          scale: [1, 0.9, 1.08, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[15%] top-[25%] h-96 w-96 rounded-full bg-secondary-400 opacity-20 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, 25, -30, 0],
          y: [0, -25, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[10%] left-[30%] h-64 w-64 rounded-full bg-yellow-50 opacity-15 blur-[100px]"
      />
    </div>
  )
}