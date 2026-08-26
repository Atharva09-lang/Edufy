import { motion, useReducedMotion } from "framer-motion"
import { fadeUp, slideInLeft, slideInRight, scaleIn, fadeDown } from "../../utils/motion"

const variantMap = {
  up: fadeUp,
  left: slideInLeft,
  right: slideInRight,
  scale: scaleIn,
  down: fadeDown,
}

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  direction = "up",
}) {
  const shouldReduceMotion = useReducedMotion()
  const Component = motion[as] || motion.div
  const variants = variantMap[direction] || fadeUp

  if (shouldReduceMotion) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </Component>
  )
}