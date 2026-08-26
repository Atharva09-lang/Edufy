import { useState } from "react"
import { useSelector } from "react-redux"
import { RxCross2 } from "react-icons/rx"
import { HiSparkles } from "react-icons/hi2"
import { Link } from "react-router-dom"

import { askAI } from "../../services/operations/aiAPI"
import { getAllCourses } from "../../services/operations/courseDetailsAPI"

const promptSuggestions = [
  "I want to become a frontend developer",
  "Help me start learning Python",
  "Which course is best for data analytics?",
]

export default function CourseAdvisorModal({ onClose }) {
  const { token } = useSelector((state) => state.auth)
  const [goal, setGoal] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState("")

  const handleAsk = async () => {
    if (!goal.trim()) return
    setLoading(true)
    setSuggestion("")

    const allCourses = await getAllCourses()
    const courseListText = (allCourses || [])
      .map((course) => `- ${course.courseName}: ${course.courseDescription?.slice(0, 100) || ""}`)
      .join("\n")

    const reply = await askAI(
      `I want to learn: ${goal}`,
      "recommendation",
      courseListText || "No courses available yet.",
      token
    )

    setSuggestion(reply || "Sorry, I couldn't come up with a suggestion right now.")
    setLoading(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleAsk()
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-slate-950/20 p-4 backdrop-blur-md">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="advisor-title"
        className="w-full max-w-[680px] overflow-hidden rounded-[24px] border border-white/80 bg-white/90 shadow-[0_28px_100px_-30px_rgba(15,23,42,.42)] backdrop-blur-[22px]"
      >
        <header className="flex items-start justify-between border-b border-slate-200/80 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
              <HiSparkles className="text-xl" />
            </span>
            <div>
              <h2 id="advisor-title" className="text-lg font-semibold tracking-tight text-slate-900">
                Find your next course
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Tell us what you want to learn and get a tailored recommendation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close course advisor"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <RxCross2 className="text-xl" />
          </button>
        </header>

        <div className="p-6 sm:p-8">
          <label htmlFor="learning-goal" className="mb-2 block text-sm font-semibold text-slate-800">
            What would you like to learn?
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-2 transition-all focus-within:border-sky-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100/70">
            <textarea
              id="learning-goal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="For example: I want to learn React and build modern websites."
              className="min-h-[92px] w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400"
              autoFocus
            />

            <div className="flex items-center justify-between gap-3 border-t border-slate-200/80 px-2 pt-2">
              <span className="hidden text-xs text-slate-400 sm:block">Press Enter to ask</span>
              <button
                type="button"
                onClick={handleAsk}
                disabled={loading || !goal.trim()}
                className="ml-auto inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <HiSparkles className="text-base" />
                {loading ? "Finding a match..." : "Get recommendation"}
              </button>
            </div>
          </div>

          {!suggestion && !loading && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium text-slate-500">Try one of these</p>
              <div className="flex flex-wrap gap-2">
                {promptSuggestions.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setGoal(prompt)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm text-sky-700">
              Looking through the available courses…
            </div>
          )}

          {suggestion && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-sky-600">
                Recommendation
              </p>
              <div className="whitespace-pre-line text-sm leading-7 text-slate-700">
                {suggestion}
              </div>
            </div>
          )}

          <Link
            to="/catalog/web-development"
            onClick={onClose}
            className="mt-6 inline-flex text-sm font-medium text-slate-600 transition-colors hover:text-sky-600"
          >
            Browse all courses instead →
          </Link>
        </div>
      </section>
    </div>
  )
}