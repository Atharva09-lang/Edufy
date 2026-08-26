import { motion } from "framer-motion"
import IconBtn from "./IconBtn"
import { modalOverlay, modalContent } from "../../utils/motion"

export default function ConfirmationModal({ modalData }) {
  return (
    <motion.div
      variants={modalOverlay}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-richblack-900/60 backdrop-blur-md"
    >
      <motion.div
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-11/12 max-w-[380px] rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-2xl"
      >
        <p className="text-2xl font-semibold text-richblack-5">
          {modalData?.text1}
        </p>
        <p className="mt-3 mb-5 leading-6 text-richblack-200 text-sm">
          {modalData?.text2}
        </p>
        <div className="flex items-center gap-x-4">
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="cursor-pointer rounded-md bg-richblack-700 py-[8px] px-[20px] font-semibold text-richblack-100 hover:bg-richblack-600 transition-colors"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}