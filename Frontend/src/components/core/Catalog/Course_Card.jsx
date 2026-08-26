import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"

const Course_Card = ({ course, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <Link to={`/courses/${course._id}`} className="block h-full">
      <motion.div
        className="group relative h-full rounded-2xl"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        {/* Glow halo behind the card */}
        <motion.div
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 0.5 },
          }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-glow-primary via-glow-secondary to-glow-accent blur-md"
        />

        <motion.div
          variants={{
            rest: { y: 0 },
            hover: { y: -6 },
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="glass relative flex h-full flex-col justify-between rounded-[22px] p-3.5 transition-shadow duration-300 group-hover:shadow-xl"
        >
          <div>
            <div className="overflow-hidden rounded-xl bg-slate-100">
              <img
                src={course?.thumbnail}
                alt={course?.courseName}
                className={`${Height || "h-[200px]"} w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105`}
              />
            </div>
            <div className="flex flex-col gap-1.5 px-1 pt-3">
              <p className="text-base font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#4F46E5] transition-colors">
                {course?.courseName}
              </p>
              <p className="text-xs font-medium text-[#64748B]">
                {course?.instructor?.firstName} {course?.instructor?.lastName}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#F59E0B]">{avgReviewCount || 0}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={14} />
                <span className="text-[#94A3B8]">
                  ({course?.ratingAndReviews?.length || 0})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#F1F5F9] px-1 pt-3 mt-2">
            <p className="text-lg font-bold text-[#4F46E5]">Rs. {course?.price}</p>
            <span className="text-xs font-semibold text-[#7C3AED] group-hover:underline">
              View Details &rarr;
            </span>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  )
}

export default Course_Card;
