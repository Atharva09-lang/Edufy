import { motion } from "framer-motion"


export default function MotionCard({ children, className = "", glow = true }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        rest: { y: 0, scale: 1 },
        hover: { y: -6, scale: 1.015 },
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-lg ${className}`}
    >
      {glow && (
        <div className="pointer-events-none absolute -inset-px rounded-lg bg-gradient-to-r from-glow-primary via-glow-secondary to-glow-accent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-40" />
      )}
      <div className="relative rounded-lg shadow-md shadow-black/10 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-glow-primary/10">
        {children}
      </div>
    </motion.div>
  )
}