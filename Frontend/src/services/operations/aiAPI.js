import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { aiEndpoints } from "../apis"

const { AI_CHAT_API } = aiEndpoints

export const askAI = async (message, mode, context, token) => {
  let result = null
  try {
    const response = await apiConnector("POST", AI_CHAT_API,
      { message, mode, context },
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) {
      throw new Error("AI request failed")
    }
    result = response.data.reply
  } catch (error) {
    console.log("AI_CHAT_API ERROR", error)
    toast.error("Could not get AI response")
  }
  return result
}