import { useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import { askAI } from "../../../services/operations/aiAPI"
import { HiOutlineChatBubbleLeftRight, HiSparkles } from "react-icons/hi2"
import ReactMarkdown from "react-markdown"

export default function AIDoubtChat({ context }) {
  const { token } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, loading, open])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { role: "user", text: userMessage }])
    setInput("")
    setLoading(true)

    const reply = await askAI(userMessage, "doubt-solver", context, token)

    if (reply) {
      setMessages((prev) => [...prev, { role: "ai", text: reply }])
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      {open ? (
        <div
          data-lenis-prevent="true"
          className="flex h-[460px] w-[340px] sm:w-[380px] flex-col rounded-2xl border border-richblack-600 bg-richblack-800 shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-edupurple-500 to-cyan-500 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <HiSparkles className="text-lg" />
              <p className="font-semibold text-sm">Edufy AI Doubt Assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 hover:bg-white/20 transition-colors text-white"
            >
              ✕
            </button>
          </div>

          <div
            data-lenis-prevent="true"
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-3 custom-scrollbar"
          >
            {messages.length === 0 && (
              <div className="rounded-xl border border-richblack-700 bg-richblack-900/60 p-3 text-xs text-richblack-300">
                👋 Is lecture ke baare me koi bhi doubt ya question ho toh poochiye.
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-cyan-600 text-white font-medium"
                    : "bg-richblack-700 text-richblack-5 border border-richblack-600 shadow-sm"
                }`}
              >
                {m.role === "ai" ? (
                  <div className="prose prose-invert max-w-none text-xs leading-relaxed">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                ) : (
                  m.text
                )}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-2xl bg-richblack-700/80 px-3.5 py-2 text-xs text-cyan-300 animate-pulse border border-richblack-600">
                Edufy AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 border-t border-richblack-700 bg-richblack-900/80 p-2.5">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your doubt..."
              rows={1}
              className="flex-1 resize-none rounded-xl bg-richblack-800 px-3 py-2 text-xs text-richblack-5 outline-none border border-richblack-700 focus:border-cyan-400"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-edupurple-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-40 transition-all"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-edupurple-500 text-2xl text-white shadow-glow transition-all hover:scale-105 active:scale-95"
        >
          <HiOutlineChatBubbleLeftRight />
        </button>
      )}
    </div>
  )
}