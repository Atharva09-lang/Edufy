import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, Link } from "react-router-dom"

import ConfirmationModal from "../components/common/ConfirmationModal"
import Footer from "../components/common/Footer"
import RatingStars from "../components/common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"

function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Getting courseId from url parameter
  const { courseId } = useParams()

  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [isActive, setIsActive] = useState([])
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetchCourseDetails(courseId)
        setResponse(res)
      } catch (error) {
        console.error("Could not fetch Course Details:", error)
      }
      setLoading(false)
    })()
  }, [courseId])

  const courseData =
    response?.data?.courseDetails ||
    response?.data ||
    response?.courseDetails ||
    null

  // Calculating Avg Review count
  useEffect(() => {
    if (courseData?.ratingAndReviews) {
      const count = GetAvgRating(courseData.ratingAndReviews)
      setAvgReviewCount(count)
    }
  }, [courseData])

  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e !== id)
    )
  }

  // Total number of lectures
  useEffect(() => {
    let lectures = 0
    courseData?.courseContent?.forEach((sec) => {
      lectures += sec?.subSection?.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [courseData])

  if (loading || profileLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!response || !response.success || !courseData) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-between">
        <div className="mx-auto flex flex-col items-center justify-center gap-4 py-20 text-center px-4">
          <h2 className="text-3xl font-bold text-richblack-5">Course Not Found</h2>
          <p className="text-richblack-300 max-w-[500px]">
            We couldn't find the requested course details. The course may have been removed or is temporarily unavailable.
          </p>
          <Link
            to="/search"
            className="mt-4 rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-all hover:scale-95"
          >
            Browse All Courses
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const {
    courseName = "",
    courseDescription = "",
    thumbnail = "",
    price = 0,
    whatYouWillLearn = "",
    courseContent = [],
    ratingAndReviews = [],
    instructor = {},
    studentsEnrolled = [],
    createdAt,
  } = courseData

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  // Format what you will learn if it is an array or string
  const formattedWhatYouWillLearn = Array.isArray(whatYouWillLearn)
    ? whatYouWillLearn.join("\n\n")
    : (whatYouWillLearn || "")

  const instructorName = `${instructor?.firstName || ""} ${instructor?.lastName || ""}`.trim() || "Course Instructor"
  const instructorImg =
    instructor?.image ||
    `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(instructorName)}`

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt={courseName}
                className="aspect-auto w-full rounded-xl object-cover"
              />
            </div>
            <div className="z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5">
              <div>
                <h1 className="text-3xl font-bold text-richblack-5 sm:text-[42px]">
                  {courseName}
                </h1>
              </div>
              <p className="text-richblack-200">{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-edupurple-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews?.length || 0} reviews)`}</span>
                <span>{`${studentsEnrolled?.length || 0} students enrolled`}</span>
              </div>
              <div>
                <p>Created By {instructorName}</p>
              </div>
              <div className="flex flex-wrap gap-5 text-sm md:text-base text-richblack-200">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button className="primaryButton" onClick={handleBuyCourse}>
                Buy Now
              </button>
            </div>
          </div>
          {/* Courses Card */}
          <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block">
            <CourseDetailsCard
              course={courseData}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn section */}
          {formattedWhatYouWillLearn && (
            <div className="my-8 border border-richblack-600 rounded-lg p-6 md:p-8">
              <p className="text-2xl md:text-3xl font-semibold">What you'll learn</p>
              <div className="mt-4 text-richblack-100">
                <ReactMarkdown>{formattedWhatYouWillLearn}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Course Content Section */}
          <div className="max-w-[830px]">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2 text-sm text-richblack-200">
                  <span>
                    {courseContent?.length || 0} {`section(s)`}
                  </span>
                  <span>
                    {totalNoOfLectures} {`lecture(s)`}
                  </span>
                </div>
                <div>
                  <button
                    className="text-edupurple-25 text-sm hover:underline"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
            </div>

            {/* Course Details Accordion */}
            <div className="py-4">
              {courseContent && courseContent.length > 0 ? (
                courseContent.map((course, index) => (
                  <CourseAccordionBar
                    course={course}
                    key={course._id || index}
                    isActive={isActive}
                    handleActive={handleActive}
                  />
                ))
              ) : (
                <p className="text-richblack-300 py-4 text-sm">No sections uploaded yet.</p>
              )}
            </div>

            {/* Author Details */}
            <div className="mb-12 py-4 border-t border-richblack-700">
              <p className="text-[28px] font-semibold">Instructor</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={instructorImg}
                  alt={instructorName}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg font-semibold">{instructorName}</p>
                  {instructor?.email && (
                    <p className="text-xs text-richblack-400">{instructor.email}</p>
                  )}
                </div>
              </div>
              {instructor?.additionalDetails?.aboutMe && (
                <p className="text-richblack-100 text-sm">
                  {instructor.additionalDetails.aboutMe}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails