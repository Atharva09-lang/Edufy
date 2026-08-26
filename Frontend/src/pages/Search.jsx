import React, { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { FiSearch, FiFilter, FiBookOpen } from "react-icons/fi"
import { searchCoursesApi } from "../services/operations/courseDetailsAPI"
import { apiConnector } from "../services/apiconnector"
import { categories } from "../services/apis"
import CourseCard from "../components/core/Catalog/Course_Card"
import Footer from "../components/common/Footer"

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get("q") || ""

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [allCategories, setAllCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")
  const [localInput, setLocalInput] = useState(searchQuery)

  // Sync local input with query param
  useEffect(() => {
    setLocalInput(searchQuery)
  }, [searchQuery])

  // Fetch all categories for filter tabs
  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        if (res?.data?.data) {
          setAllCategories(res.data.data)
        }
      } catch (error) {
        console.error("Could not fetch categories for search filters", error)
      }
    })()
  }, [])

  // Fetch courses on searchQuery change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const res = await searchCoursesApi(searchQuery)
        setCourses(res || [])
      } catch (error) {
        console.error("Error fetching searched courses", error)
        setCourses([])
      }
      setLoading(false)
    }
    fetchCourses()
  }, [searchQuery])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (localInput.trim()) {
      setSearchParams({ q: localInput.trim() })
    } else {
      setSearchParams({})
    }
  }

  // Filter courses by category
  let filteredCourses = courses.filter((course) => {
    if (selectedCategory === "All") return true
    const courseCatName =
      course?.category?.name ||
      (typeof course?.category === "string" ? course.category : "")
    return courseCatName.toLowerCase() === selectedCategory.toLowerCase()
  })

  // Sort courses
  filteredCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "popular") {
      return (b?.studentsEnrolled?.length || 0) - (a?.studentsEnrolled?.length || 0)
    }
    if (sortBy === "price-low") {
      return (a?.price || 0) - (b?.price || 0)
    }
    if (sortBy === "price-high") {
      return (b?.price || 0) - (a?.price || 0)
    }
    if (sortBy === "newest") {
      return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
    }
    return 0
  })

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-richblack-900 text-richblack-5">
      {/* Search Header Banner */}
      <div className="border-b border-richblack-700 bg-richblack-800 py-10 px-4">
        <div className="mx-auto max-w-maxContent flex flex-col gap-4">
          <div className="text-sm text-richblack-300">
            <Link to="/" className="hover:text-richblack-5">
              Home
            </Link>{" "}
            / <span className="text-edupurple-25">Search</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-richblack-5">
                {searchQuery ? (
                  <>
                    Results for{" "}
                    <span className="text-edupurple-25">"{searchQuery}"</span>
                  </>
                ) : (
                  "Explore All Uploaded Courses"
                )}
              </h1>
              <p className="text-sm text-richblack-300 mt-1">
                {loading
                  ? "Searching courses..."
                  : `${filteredCourses.length} course${
                      filteredCourses.length === 1 ? "" : "s"
                    } available`}
              </p>
            </div>

            {/* In-page Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full md:w-[380px] items-center rounded-lg border border-richblack-700 bg-richblack-900 px-3 py-2 text-richblack-200 focus-within:border-edupurple-25"
            >
              <FiSearch className="text-lg text-richblack-400 mr-2" />
              <input
                type="text"
                placeholder="Search courses, topics, instructor..."
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                className="w-full bg-transparent text-sm text-richblack-5 outline-none placeholder:text-richblack-400"
              />
              <button
                type="submit"
                className="ml-2 rounded-md bg-yellow-50 px-3 py-1 text-xs font-semibold text-richblack-900 hover:bg-yellow-100 transition-all"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto flex-1 w-full max-w-maxContent px-4 py-8">
        {/* Controls: Filter by Category & Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-richblack-700 pb-6 mb-8">
          {/* Categories Pill Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-richblack-300 flex items-center gap-1 mr-1">
              <FiFilter /> Filter:
            </span>
            <button
              onClick={() => setSelectedCategory("All")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedCategory === "All"
                  ? "bg-edupurple-25 text-richblack-900 font-semibold"
                  : "bg-richblack-800 text-richblack-200 hover:bg-richblack-700"
              }`}
            >
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedCategory === cat.name
                    ? "bg-edupurple-25 text-richblack-900 font-semibold"
                    : "bg-richblack-800 text-richblack-200 hover:bg-richblack-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <label className="text-xs text-richblack-300">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-richblack-700 bg-richblack-800 px-3 py-1.5 text-xs text-richblack-100 outline-none focus:border-edupurple-25"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Courses Listing / State Handling */}
        {loading ? (
          <div className="grid min-h-[300px] place-items-center">
            <div className="spinner"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="my-12 flex flex-col items-center justify-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-richblack-800 text-3xl text-richblack-400 mb-4">
              <FiBookOpen />
            </div>
            <h3 className="text-xl font-bold text-richblack-5 mb-2">
              No Courses Found
            </h3>
            <p className="max-w-md text-sm text-richblack-300 mb-6">
              {searchQuery
                ? `We couldn't find any courses matching "${searchQuery}". Try different keywords or browse all categories.`
                : "No courses found matching the selected filter."}
            </p>
            <div className="flex gap-3">
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="rounded-md border border-richblack-600 bg-richblack-800 px-4 py-2 text-xs font-semibold text-richblack-100 hover:bg-richblack-700"
                >
                  Clear Category Filter
                </button>
              )}
              {searchQuery && (
                <Link
                  to="/search"
                  className="rounded-md bg-yellow-50 px-4 py-2 text-xs font-semibold text-richblack-900 hover:bg-yellow-100 transition-all"
                >
                  View All Uploaded Courses
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map((course, idx) => (
              <CourseCard course={course} key={course._id || idx} Height={"h-[200px]"} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Search
