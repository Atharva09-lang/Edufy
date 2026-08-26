import { FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { heroStagger, heroChild } from "../utils/motion"

import Banner from "../assets/Images/banner.mp4"

import Footer from "../components/common/Footer"
import ReviewSlider from "../components/common/ReviewSlider"
import CTAButton from "../components/core/HomePage/Button"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import ExploreMore from "../components/core/HomePage/ExploreMore"
import HighlightText from "../components/core/HomePage/HighlightText"
import InstructorSection from "../components/core/HomePage/InstructorSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import TimelineSection from "../components/core/HomePage/TimelineSection"
import GradientOrbs from "../components/common/GradientOrbs"
import Reveal from "../components/common/Reveal"

function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="relative min-h-screen overflow-hidden">
        <GradientOrbs />

        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="relative mx-auto flex min-h-screen w-11/12 max-w-maxContent flex-col items-center justify-center gap-8 py-16 text-richblack-5"
        >
          <motion.div variants={heroChild}>
            <Link to="/signup">
              <div className="glass group mx-auto w-fit rounded-full p-1 font-bold text-richblack-50 transition-all duration-300 hover:scale-105 hover:shadow-glow">
                <div className="flex items-center gap-2 rounded-full px-6 py-2 transition-all duration-300 group-hover:bg-cyan-50/70">
                  <p>Become an Instructor</p>
                  <FaArrowRight />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            variants={heroChild}
            className="max-w-5xl text-center text-4xl font-extrabold leading-tight tracking-tight text-richblack-5 md:text-6xl lg:text-7xl"
          >
            Empower Your Future with
            <HighlightText text=" Coding Skills" />
          </motion.div>

          <motion.div
            variants={heroChild}
            className="w-[90%] max-w-3xl text-center text-lg font-medium leading-8 text-richblack-200"
          >
            With our online coding courses, you can learn at your own pace,
            from anywhere in the world, and gain access to hands-on projects,
            quizzes, personalized feedback, and AI-powered learning support.
          </motion.div>

          <motion.div
            variants={heroChild}
            className="mt-4 flex flex-wrap justify-center gap-6"
          >
            <CTAButton active linkto="/signup">
              Learn More
            </CTAButton>

            <CTAButton active={false} linkto="/login">
              Book a Demo
            </CTAButton>
          </motion.div>

          <motion.div
            variants={heroChild}
            className="glass mx-3 my-8 overflow-hidden rounded-[22px] p-2 shadow-[0_24px_70px_rgba(14,165,233,0.16)]"
          >
            <video className="rounded-2xl" muted loop autoPlay>
              <source src={Banner} type="video/mp4" />
            </video>
          </motion.div>

          <Reveal>
            <CodeBlocks
              position="lg:flex-row"
              heading={
                <div className="text-4xl font-semibold">
                  Unlock your
                  <HighlightText text=" coding potential" /> with our online
                  courses.
                </div>
              }
              subheading="Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
              ctabtn1={{
                btnText: "Try it Yourself",
                link: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "Learn More",
                link: "/signup",
                active: false,
              }}
              codeColor="text-edupurple-25"
              codeblock={`<!DOCTYPE html>
<html lang="en">
<head>
<title>This is myPage</title>
</head>
<body>
<h1><a href="/">Header</a></h1>
<nav>
<a href="/one">One</a>
<a href="/two">Two</a>
<a href="/three">Three</a>
</nav>
</body>`}
              backgroundGradient={<div className="codeblock1 absolute" />}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <CodeBlocks
              position="lg:flex-row-reverse"
              heading={
                <div className="w-full text-4xl font-semibold lg:w-[50%]">
                  Start
                  <HighlightText text=" coding in seconds" />
                </div>
              }
              subheading="Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
              ctabtn1={{
                btnText: "Continue Lesson",
                link: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "Learn More",
                link: "/signup",
                active: false,
              }}
              codeColor="text-white"
              codeblock={`import React from "react";
import CTAButton from "./Button";
import { FaArrowRight } from "react-icons/fa";

const Home = () => {
  return <div>Home</div>;
};

export default Home;`}
              backgroundGradient={<div className="codeblock2 absolute" />}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <ExploreMore />
          </Reveal>
        </motion.div>
      </div>

      {/* Skills and learning section */}
      <div className="bg-pure-greys-5 text-slate-700">
        <div className="homepage_bg h-[320px]">
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]" />

            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTAButton active linkto="/signup">
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>

              <CTAButton active={false} linkto="/login">
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
          <Reveal className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold text-slate-900 lg:w-[45%]">
              Get the skills you need for a{" "}
              <HighlightText text="job that is in demand." />
            </div>

            <div className="flex flex-col items-start gap-10 text-slate-600 lg:w-[40%]">
              <div className="text-[16px]">
                The modern Edufy dictates its own terms. Today, becoming a
                competitive specialist requires more than professional skills.
              </div>

              <CTAButton active linkto="/signup">
                Learn More
              </CTAButton>
            </div>
          </Reveal>

          <Reveal>
            <TimelineSection />
          </Reveal>

          <Reveal delay={0.1}>
            <LearningLanguageSection />
          </Reveal>
        </div>
      </div>

      {/* Instructor and reviews section */}
      <div className="py-10">
        <div className="glass-card relative mx-auto my-10 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 p-6 text-richblack-5 md:p-10">
          <Reveal>
            <InstructorSection />
          </Reveal>

          <h1 className="mt-8 text-center text-4xl font-semibold">
            Reviews from other learners
          </h1>

          <Reveal delay={0.1} className="w-full">
            <ReviewSlider />
          </Reveal>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home