import { useState } from "react"
import { useSelector } from "react-redux"
import { askAI } from "../../../services/operations/aiAPI"
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2"

export default function AIDoubtChat({ context }) {
  const { token } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

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
        <div className="flex h-[420px] w-[320px] flex-col rounded-lg border border-richblack-600 bg-richblack-800 shadow-xl">
          <div className="flex items-center justify-between rounded-t-lg bg-edupurple-50 px-4 py-3">
            <p className="font-semibold text-white">Ask a Doubt</p>
            <button onClick={() => setOpen(false)} className="text-white">
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.length === 0 && (
              <p className="text-sm text-richblack-400">
                Is lecture ke baare me koi doubt ho toh yahan pucho.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-md px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-edupurple-50 text-white"
                    : "bg-richblack-700 text-richblack-5"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-md bg-richblack-700 px-3 py-2 text-sm text-richblack-300">
                Typing...
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-richblack-600 p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Apna doubt likho..."
              rows={1}
              className="flex-1 resize-none rounded-md bg-richblack-700 px-3 py-2 text-sm text-richblack-5 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-md bg-edugreen-50 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-edupurple-50 text-2xl text-white shadow-xl"
        >
          <HiOutlineChatBubbleLeftRight />
        </button>
      )}
    </div>
  )
}