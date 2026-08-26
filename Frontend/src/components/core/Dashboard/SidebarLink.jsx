import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

import { resetCourseState } from "../../../slices/courseSlice"

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  const isActive = matchRoute(link.path)

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`relative flex items-center px-8 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-edupurple-800/40 text-edupurple-50 font-semibold"
          : "bg-opacity-0 text-richblack-300 hover:text-richblack-100 hover:bg-richblack-700/30"
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="activeSidebarIndicator"
          className="absolute left-0 top-0 h-full w-[0.2rem] bg-edupurple-50 rounded-r-full shadow-glow"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
      <div className="flex items-center gap-x-2.5">
        {/* Icon Goes Here */}
        {Icon && <Icon className="text-lg shrink-0" />}
        <span>{link.name}</span>
      </div>
    </NavLink>
  )
}