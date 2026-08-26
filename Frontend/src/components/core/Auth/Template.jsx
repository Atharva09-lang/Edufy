import { useSelector } from "react-redux"
import { motion } from "framer-motion"

import frameImg from "../../../assets/Images/frame.png"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import PremiumLoader from "../../common/PremiumLoader"
import { staggerContainer, fadeUp, slideInRight } from "../../../utils/motion"

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <PremiumLoader size="lg" />
      ) : (
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          animate="visible"
          className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12"
        >
          <motion.div
            variants={fadeUp}
            className="glass-card mx-auto w-11/12 max-w-[450px] p-6 md:mx-0 md:p-8"
          >
            <h1 className="text-[1.875rem] font-bold leading-[2.375rem] tracking-tight text-richblack-5">
              {title}
            </h1>
            <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </motion.div>
          <motion.div
            variants={slideInRight}
            className="relative mx-auto w-11/12 max-w-[450px] animate-float md:mx-0"
          >
            <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
            />
            <img
              src={image}
              alt="Students"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 z-10"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Template
