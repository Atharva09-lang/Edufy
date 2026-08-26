import { useEffect, useState, useRef } from "react"
import {
  AiOutlineMenu,
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlineClose,
} from "react-icons/ai"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Dark.svg"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { searchCoursesApi } from "../../services/operations/courseDetailsAPI"
import { logout } from "../../services/operations/authAPI"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"
import CourseAdvisorModal from "./CourseAdvisorModal"
import { HiSparkles } from "react-icons/hi2"
import { motion, AnimatePresence } from "framer-motion"
import { mobileDrawer } from "../../utils/motion"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)

  // Search States
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)

  // Mobile Menu States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false)
  const [advisorOpen, setAdvisorOpen] = useState(false)

  // Scroll state for glassmorphism header effect
  const [scrolled, setScrolled] = useState(false)

  // Refs for click outside
  const catalogRef = useRef(null)
  const searchRef = useRef(null)

  // Authentication check - true ONLY if both token and user exist
  const isAuthenticated = Boolean(token && user)

  // Fetch Categories on mount
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        if (res?.data?.data) {
          setSubLinks(res.data.data)
        }
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  // Close menus on route change
  useEffect(() => {
    setCatalogOpen(false)
    setSearchDropdownOpen(false)
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Handle outside clicks to close catalog and search dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catalogRef.current && !catalogRef.current.contains(event.target)) {
        setCatalogOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Track scroll position for header glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Live search debounced fetch
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchCoursesApi(searchQuery.trim())
        setSearchResults(results || [])
      } catch (err) {
        console.error("Error searching courses:", err)
        setSearchResults([])
      }
      setSearchLoading(false)
    }, 250)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchDropdownOpen(false)
      setMobileMenuOpen(false)
    } else {
      navigate(`/search`)
      setSearchDropdownOpen(false)
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 flex w-full items-center justify-center border-b transition-all duration-300 ${
        scrolled
          ? "h-14 border-white/70 bg-white/60 shadow-soft backdrop-blur-[22px]"
          : location.pathname !== "/"
          ? "h-16 border-white/70 bg-white/60 backdrop-blur-[22px]"
          : "h-16 border-white/70 bg-white/40 backdrop-blur-[22px]"
      }`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between gap-x-3 md:gap-x-6">
        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center">
          <img src={logo} alt="Edufy Logo" width={135} height={32} loading="lazy" />
        </Link>

        {/* Navigation links (Desktop - lg and above) */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-x-6 text-richblack-50">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    ref={catalogRef}
                    className="relative"
                    onMouseEnter={() => setCatalogOpen(true)}
                    onMouseLeave={() => setCatalogOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setCatalogOpen((prev) => !prev)}
                      className={`flex cursor-pointer items-center gap-1.5 py-2 font-medium transition-colors ${
                        matchRoute("/catalog/:catalogName") || catalogOpen
                          ? "text-sky-600"
                          : "text-richblack-100 hover:text-sky-600"
                      }`}
                    >
                      <span>{link.title}</span>
                      <BsChevronDown
                        className={`transition-transform duration-200 ${
                          catalogOpen ? "rotate-180 text-edupurple-25" : ""
                        }`}
                        fontSize={13}
                      />
                    </button>

                    {/* Catalog Dropdown Menu */}
                    <div
                      className={`${
                        catalogOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible translate-y-2 opacity-0"
                      } glass absolute left-[50%] top-full z-[1000] flex w-[280px] -translate-x-1/2 flex-col rounded-2xl p-3 text-slate-700 transition-all duration-200`}
                    >
                      {/* Arrow Pointer */}
                      <div className="absolute left-[50%] top-0 -z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm bg-white/70"></div>

                      <div className="max-h-[360px] overflow-y-auto px-1 py-1">
                        {loading ? (
                          <div className="py-4 text-center text-xs text-slate-500">
                            Loading categories...
                          </div>
                        ) : subLinks && subLinks.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {subLinks.map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-cyan-50 hover:text-sky-600"
                                key={subLink._id || i}
                                onClick={() => setCatalogOpen(false)}
                              >
                                <span>{subLink.name}</span>
                                {subLink?.course?.length > 0 && (
                                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 transition-colors group-hover:bg-cyan-100 group-hover:text-sky-700">
                                    {subLink.course.length}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="py-4 text-center text-xs text-slate-500">
                            No Categories Found
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`font-medium transition-colors ${
                        matchRoute(link?.path)
                          ? "text-sky-600"
                          : "text-richblack-100 hover:text-sky-600"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Search Bar (Medium & Large screens) */}
        <div ref={searchRef} className="relative hidden md:block flex-1 max-w-[280px] lg:max-w-[320px]">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center rounded-full border border-white/80 bg-white/60 px-3.5 py-2 text-slate-700 shadow-sm transition-all focus-within:border-cyan-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100/70"
          >
            <AiOutlineSearch
              className="cursor-pointer text-lg text-slate-400 transition-colors hover:text-[#06B6D4] shrink-0"
              onClick={handleSearchSubmit}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSearchDropdownOpen(true)
              }}
              onFocus={() => setSearchDropdownOpen(true)}
              className="ml-2 w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setSearchResults([])
                }}
                className="text-richblack-400 hover:text-richblack-200 ml-1"
              >
                <AiOutlineClose fontSize={14} />
              </button>
            )}
          </form>

          {/* Search Dropdown / Live Preview */}
          {searchDropdownOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 z-[1000] overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 p-2 shadow-2xl">
              {searchLoading ? (
                <div className="py-4 text-center text-xs text-richblack-300">
                  Searching courses...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-richblack-400">
                    Courses ({searchResults.length})
                  </div>
                  {searchResults.slice(0, 4).map((course) => (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      onClick={() => {
                        setSearchDropdownOpen(false)
                        setSearchQuery("")
                      }}
                      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-richblack-700"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-10 w-14 rounded-md object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-richblack-5">
                          {course.courseName}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-richblack-300">
                          {course?.instructor && (
                            <span>
                              {course.instructor.firstName} {course.instructor.lastName}
                            </span>
                          )}
                          <span className="font-semibold text-edupurple-25">
                            Rs. {course.price}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="mt-1 w-full rounded-lg bg-richblack-700 py-2 text-center text-xs font-semibold text-edupurple-25 transition-colors hover:bg-edupurple-25 hover:text-richblack-900"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-richblack-300">
                  No courses found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Course Advisor Button (Desktop) */}
        <button
          type="button"
          onClick={() => setAdvisorOpen(true)}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:flex"
        >
          <HiSparkles className="text-base text-sky-500" />
          <span>Ask AI</span>
        </button>

        {/* Right Section: Desktop & Tablet Auth/Cart/Profile */}
        <div className="hidden sm:flex items-center gap-x-3 md:gap-x-4">
          {isAuthenticated ? (
            <>
              {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <Link to="/dashboard/cart" className="relative p-1.5 text-richblack-100 hover:text-richblack-5 transition-colors">
                  <AiOutlineShoppingCart className="text-2xl" />
                  {totalItems > 0 && (
                    <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-edupurple-50 text-center text-xs font-bold text-richblack-900">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              <ProfileDropdown />
            </>
          ) : (
            <div className="flex items-center gap-x-2 md:gap-x-3">
              <Link to="/login">
                <button className="rounded-xl border border-slate-200 bg-white/60 px-3.5 py-2 text-xs font-medium text-slate-600 transition-all hover:bg-white hover:text-slate-900 md:text-sm">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-glow transition-all hover:-translate-y-0.5 hover:scale-[1.02] md:text-sm">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile View Toggle (Visible on screens < sm or < md) */}
        <div className="flex items-center gap-x-2 sm:hidden">
          {isAuthenticated && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative p-1 text-richblack-100">
              <AiOutlineShoppingCart className="text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-edupurple-50 text-[10px] font-bold text-richblack-900">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          <button
            className="p-1.5 text-richblack-100 hover:text-richblack-5 focus:outline-none"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <AiOutlineClose fontSize={24} />
            ) : (
              <AiOutlineMenu fontSize={24} />
            )}
          </button>
        </div>

        {/* Medium Screen Hamburger Button (hidden on sm:flex if md is wide enough) */}
        <button
          className="hidden sm:max-md:block p-1.5 text-richblack-100 hover:text-richblack-5 focus:outline-none"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <AiOutlineClose fontSize={24} />
          ) : (
            <AiOutlineMenu fontSize={24} />
          )}
        </button>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileDrawer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass absolute left-0 top-full z-[1000] w-full overflow-hidden rounded-b-[22px] p-5 md:hidden"
          >
            {/* Mobile Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center rounded-lg border border-richblack-600 bg-richblack-800 px-3 py-2 text-richblack-100 mb-4"
            >
              <AiOutlineSearch className="text-lg text-richblack-300 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search uploaded courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-richblack-5 outline-none placeholder:text-richblack-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-richblack-400 mr-2"
                >
                  <AiOutlineClose fontSize={14} />
                </button>
              )}
              <button
                type="submit"
                className="rounded bg-edupurple-50 px-2.5 py-1 text-xs font-semibold text-richblack-900"
              >
                Search
              </button>
            </form>

            {/* AI Course Advisor Button (Mobile) */}
            <button
              type="button"
              onClick={() => {
                setAdvisorOpen(true)
                setMobileMenuOpen(false)
              }}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              <HiSparkles className="text-sky-500" /> Ask AI for a course recommendation
            </button>

            {/* Navigation Links */}
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  matchRoute("/") ? "bg-richblack-800 text-edupurple-25" : "text-richblack-100 hover:bg-richblack-800"
                }`}
              >
                Home
              </Link>

              {/* Mobile Catalog Accordion */}
              <div className="rounded-lg bg-richblack-800/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileCatalogOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-richblack-100 hover:text-edupurple-25"
                >
                  <span>Catalog / Categories</span>
                  {mobileCatalogOpen ? <BsChevronUp /> : <BsChevronDown />}
                </button>

                {mobileCatalogOpen && (
                  <div className="flex flex-col gap-1 border-t border-richblack-700 px-3 py-2 max-h-52 overflow-y-auto bg-richblack-900/50">
                    {subLinks && subLinks.length > 0 ? (
                      subLinks.map((subLink, i) => (
                        <Link
                          key={subLink._id || i}
                          to={`/catalog/${subLink.name
                            .split(" ")
                            .join("-")
                            .toLowerCase()}`}
                          className="py-1.5 text-xs text-richblack-200 hover:text-edupurple-25 flex items-center justify-between"
                        >
                          <span>{subLink.name}</span>
                          {subLink?.course?.length > 0 && (
                            <span className="rounded-full bg-richblack-700 px-2 py-0.5 text-[10px] text-richblack-300">
                              {subLink.course.length}
                            </span>
                          )}
                        </Link>
                      ))
                    ) : (
                      <span className="text-xs text-richblack-400 py-1">
                        No categories found
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/about"
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  matchRoute("/about") ? "bg-richblack-800 text-edupurple-25" : "text-richblack-100 hover:bg-richblack-800"
                }`}
              >
                About Us
              </Link>

              <Link
                to="/contact"
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  matchRoute("/contact") ? "bg-richblack-800 text-edupurple-25" : "text-richblack-100 hover:bg-richblack-800"
                }`}
              >
                Contact Us
              </Link>

              {/* Mobile Auth Section */}
              <div className="mt-3 flex flex-col gap-2 border-t border-richblack-700 pt-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-2 py-1">
                      <img
                        src={user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName}`}
                        alt="Profile"
                        className="h-9 w-9 rounded-full object-cover border border-richblack-600"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-richblack-5 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-richblack-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/dashboard/my-profile"
                      className="flex items-center gap-2 rounded-lg bg-richblack-800 px-3 py-2 text-sm text-edupurple-25"
                    >
                      <VscDashboard className="text-lg" />
                      <span>Go to Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logout(navigate))
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-2 rounded-lg border border-pink-700/40 bg-pink-900/20 px-3 py-2 text-sm text-pink-200 hover:bg-pink-900/40"
                    >
                      <VscSignOut className="text-lg" />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login" className="flex-1">
                      <button className="w-full rounded-lg border border-richblack-700 bg-richblack-800 py-2.5 text-center text-sm font-medium text-richblack-100 hover:bg-richblack-700">
                        Log in
                      </button>
                    </Link>
                    <Link to="/signup" className="flex-1">
                      <button className="w-full rounded-lg bg-edupurple-50 py-2.5 text-center text-sm font-semibold text-richblack-900 hover:bg-edupurple-100">
                        Sign up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
    {advisorOpen && <CourseAdvisorModal onClose={() => setAdvisorOpen(false)} />}
    </>
  )
}

export default Navbar
