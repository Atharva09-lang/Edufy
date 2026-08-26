import { motion } from "framer-motion"
import { pageTransition } from "../../utils/motion"

export default function AnimatedPage({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  )
}
