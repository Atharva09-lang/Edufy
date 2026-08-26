import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 25

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  }, [])

  return (
    <div className="w-full text-white">
      <div className="my-8 w-full">
        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 28 },
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full py-4"
        >
          {reviews.map((review, i) => {
            return (
              <SwiperSlide key={i} className="h-auto pb-4">
                <div className="flex h-full min-h-[200px] flex-col justify-between rounded-2xl border border-richblack-700 bg-richblack-800 p-6 text-[15px] text-richblack-25 shadow-sm transition-all duration-200 hover:border-richblack-600 hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-full object-cover border border-richblack-600"
                    />
                    <div className="flex flex-col min-w-0">
                      <h1 className="font-semibold text-richblack-5 truncate">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-[13px] font-medium text-richblack-400 truncate">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="my-3 grow font-normal leading-relaxed text-richblack-100 text-sm">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-richblack-700/60">
                    <h3 className="font-bold text-edupurple-25 text-sm">
                      {review.rating.toFixed(1)}
                    </h3>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={18}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider