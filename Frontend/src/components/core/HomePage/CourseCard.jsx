import React from "react"
import { motion } from "framer-motion"
import { HiUsers } from "react-icons/hi"
import { ImTree } from "react-icons/im"

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isSelected = currentCard === cardData?.heading

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setCurrentCard(cardData?.heading)}
      className={`h-[300px] w-[360px] cursor-pointer rounded-[22px] border text-slate-700 transition-colors duration-200 lg:w-[30%] ${
        isSelected
          ? "border-cyan-300 bg-white shadow-glow"
          : "glass"
      }`}
    >
      <div className="flex h-[80%] flex-col gap-3 border-b-2 border-dashed border-richblack-400 p-6">
        <div
          className={`text-[20px] font-semibold transition-colors duration-200 ${
            isSelected ? "text-slate-900" : "text-slate-800"
          }`}
        >
          {cardData?.heading}
        </div>

        <div className="text-slate-500">{cardData?.description}</div>
      </div>

      <div
        className={`flex justify-between px-6 py-3 font-medium ${
          isSelected ? "text-sky-600" : "text-slate-500"
        }`}
      >
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{cardData?.level}</p>
        </div>

        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{cardData?.lessionNumber} Lesson</p>
        </div>
      </div>
    </motion.div>
  )
}

export default CourseCard