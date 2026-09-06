import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { RxCross2 } from "react-icons/rx"
import { HiSparkles, HiOutlineLightBulb, HiArrowPath, HiOutlineClipboardDocument, HiOutlineCheck } from "react-icons/hi2"
import { Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"

import { askAI } from "../../services/operations/aiAPI"
import { getAllCourses } from "../../services/operations/courseDetailsAPI"

const promptSuggestions = [
  "I want to become a full-stack web developer from scratch",
  "Help me start learning Python for Data Science & AI",
  "Which course is best to master React and modern Frontend?",
  "Recommend courses for Backend API development and Databases",
]

export default function CourseAdvisorModal({ onClose }) {
  const { token } = useSelector((state) => state.auth)
  const [goal, setGoal] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState("")
  const [copied, setCopied] = useState(false)

  const modalBodyRef = useRef(null)
  const responseRef = useRef(null)

  // Prevent background scrolling while modal is open & add Esc listener
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  // Smooth scroll down to the response whenever suggestion updates
  useEffect(() => {
    if (suggestion && responseRef.current) {
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [suggestion])

  const handleAsk = async (customPrompt) => {
    const query = typeof customPrompt === "string" ? customPrompt : goal
    if (!query.trim() || loading) return

    setGoal(query)
    setLoading(true)
    setSuggestion("")
    setCopied(false)

    try {
      const allCourses = await getAllCourses()
      const courseListText = (allCourses || [])
        .map(
          (course) =>
            `- ${course.courseName}: ${course.courseDescription?.slice(0, 140) || ""}`
        )
        .join("\n")

      const reply = await askAI(
        `I want to learn: ${query}`,
        "recommendation",
        courseListText || "No courses available yet.",
        token
      )

      setSuggestion(reply || "Sorry, I couldn't come up with a suggestion right now. Please try again.")
    } catch (err) {
      setSuggestion("Something went wrong while fetching course recommendations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleAsk()
    }
  }

  const handleCopy = () => {
    if (!suggestion) return
    navigator.clipboard.writeText(suggestion)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setGoal("")
    setSuggestion("")
    setCopied(false)
  }

  return (
    <div
      data-lenis-prevent="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/70 p-3 sm:p-5 backdrop-blur-md transition-all duration-300"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="advisor-title"
        data-lenis-prevent="true"
        className="relative flex max-h-[90vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[26px] border border-white/20 bg-richblack-900/95 text-richblack-5 shadow-[0_28px_100px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-richblack-700/80 bg-richblack-800/80 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-edupurple-500/30 text-cyan-400 ring-1 ring-cyan-500/40 shadow-glow">
              <HiSparkles className="text-xl" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="advisor-title" className="text-lg font-bold tracking-tight text-white">
                  Edufy AI Course Advisor
                </h2>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-300 border border-cyan-500/30">
                  Smart Guide
                </span>
              </div>
              <p className="text-xs text-richblack-300 sm:text-sm">
                Tell us your goal and let AI tailor the perfect course roadmap for you.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close course advisor"
            className="rounded-xl p-2 text-richblack-400 transition-colors hover:bg-richblack-700 hover:text-white"
          >
            <RxCross2 className="text-2xl" />
          </button>
        </header>

        {/* Scrollable Body Container */}
        <div
          ref={modalBodyRef}
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-6 custom-scrollbar"
        >
          {/* Input Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="learning-goal" className="text-sm font-semibold text-richblack-100 flex items-center gap-2">
                <HiOutlineLightBulb className="text-cyan-400 text-base" />
                What is your learning goal or target career?
              </label>
              {goal && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-richblack-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <HiArrowPath className="text-sm" /> Clear
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-richblack-700 bg-richblack-800/90 p-3 transition-all focus-within:border-cyan-400 focus-within:bg-richblack-800 focus-within:ring-2 focus-within:ring-cyan-400/30 shadow-inner">
              <textarea
                id="learning-goal"
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="E.g. I want to build full stack web apps with React and Node.js, what courses should I take?"
                className="min-h-[85px] w-full resize-none bg-transparent px-2 py-1 text-sm leading-relaxed text-richblack-5 placeholder:text-richblack-400 outline-none"
                autoFocus
              />

              <div className="flex items-center justify-between gap-3 border-t border-richblack-700/60 pt-2.5 px-1">
                <span className="hidden text-xs text-richblack-400 sm:inline">
                  Press <kbd className="rounded bg-richblack-700 px-1.5 py-0.5 text-[10px] text-richblack-200">Enter ↵</kbd> to ask
                </span>
                <button
                  type="button"
                  onClick={() => handleAsk()}
                  disabled={loading || !goal.trim()}
                  className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <HiSparkles className="text-base" />
                  {loading ? "Analyzing Courses..." : "Get AI Advice"}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          {!suggestion && !loading && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-richblack-400">
                Popular Questions & Prompts
              </p>
              <div className="flex flex-wrap gap-2">
                {promptSuggestions.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleAsk(prompt)}
                    className="group rounded-xl border border-richblack-700 bg-richblack-800/60 px-3.5 py-2 text-xs font-medium text-richblack-200 transition-all hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:text-cyan-300 text-left"
                  >
                    ✨ {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 text-center animate-pulse">
              <div className="flex items-center justify-center gap-3">
                <span className="h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
                <p className="text-sm font-semibold text-cyan-300">
                  AI is scanning the Edufy course catalog and formulating your plan...
                </p>
              </div>
              <p className="mt-1 text-xs text-richblack-400">This takes just a couple of seconds.</p>
            </div>
          )}

          {/* AI Response Card */}
          {suggestion && (
            <div
              ref={responseRef}
              className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-richblack-800/90 to-richblack-900/90 p-5 sm:p-6 shadow-xl transition-all"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-richblack-700/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400">
                    <HiSparkles className="text-sm" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Recommended Course Plan
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-richblack-700 bg-richblack-800 px-3 py-1.5 text-xs font-medium text-richblack-200 hover:border-cyan-400 hover:text-cyan-300 transition-all"
                  >
                    {copied ? (
                      <>
                        <HiOutlineCheck className="text-green-400 text-sm" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineClipboardDocument className="text-sm" />
                        <span>Copy Advice</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-richblack-700 bg-richblack-800 px-3 py-1.5 text-xs font-medium text-richblack-300 hover:text-white transition-all"
                  >
                    <HiArrowPath className="text-sm" />
                    <span>Ask Another</span>
                  </button>
                </div>
              </div>

              {/* Rendered Markdown Response */}
              <div className="prose prose-invert max-w-none text-sm leading-relaxed text-richblack-100 space-y-3">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h3 className="mt-4 mb-2 text-base font-bold text-white flex items-center gap-2">
                        {children}
                      </h3>
                    ),
                    h2: ({ children }) => (
                      <h4 className="mt-3 mb-1.5 text-sm font-bold text-cyan-300 flex items-center gap-2">
                        {children}
                      </h4>
                    ),
                    h3: ({ children }) => (
                      <h5 className="mt-3 mb-1 text-sm font-semibold text-cyan-200">
                        {children}
                      </h5>
                    ),
                    p: ({ children }) => <p className="text-richblack-100 leading-relaxed my-2">{children}</p>,
                    ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1.5 text-richblack-200">{children}</ul>,
                    ol: ({ children }) => <ol className="my-2 ml-4 list-decimal space-y-1.5 text-richblack-200">{children}</ol>,
                    li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-cyan-300">{children}</strong>,
                    blockquote: ({ children }) => (
                      <blockquote className="my-2 border-l-4 border-cyan-500 bg-cyan-950/20 py-2 px-3 rounded-r-lg text-richblack-200 italic">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-richblack-700 px-1.5 py-0.5 font-mono text-xs text-yellow-50">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {suggestion}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <footer className="flex shrink-0 items-center justify-between border-t border-richblack-700/80 bg-richblack-800/80 px-6 py-3.5 sm:px-8">
          <Link
            to="/catalog/web-development"
            onClick={onClose}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            Explore all available courses →
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-richblack-700 px-4 py-1.5 text-xs font-medium text-richblack-200 hover:bg-richblack-600 hover:text-white transition-all"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  )
}