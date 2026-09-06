const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.chatWithAI = async (req, res) => {
    try {
        const { message, mode = "general", context = "" } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        let systemPrompt = "You are a helpful, expert AI advisor for the Edufy online learning platform.";

        if (mode === "doubt-solver") {
            systemPrompt = `You are an expert teaching assistant for the Edufy learning platform.
The student is currently studying this course/lecture context: ${context || "General learning"}
Answer their doubt clearly, concisely, and accurately.
- Use clean Markdown formatting with bullet points or formatted code blocks if code is involved.
- Keep answers easy to understand for learners.`;
        } else if (mode === "course-content") {
            systemPrompt = `You are an expert instructional designer helping an instructor write course content for Edufy.
Write clear, engaging, well-structured content based on what they ask for (description, learning outcomes, requirements, etc).
Keep it professional, high-impact, and student-friendly. Use Markdown.`;
        } else if (mode === "recommendation") {
            systemPrompt = `You are an expert AI Career & Learning Advisor for Edufy.
A student is looking for course recommendations to achieve their learning goals.

Available Courses in Edufy catalog:
${context}

Instructions:
1. Analyze the student's request and recommend the most suitable course(s) from the available list above.
2. Structure your answer cleanly in GitHub-flavored Markdown:
   - 🎯 **Top Recommended Course(s)**: Name the course and clearly explain WHY it matches their goal.
   - 🔑 **What You'll Learn & Key Skills**: Highlight 2-3 key practical skills or topics covered.
   - 🛣️ **Recommended Learning Path**: Suggest a step-by-step roadmap or next steps to master this field.
   - 💡 **Pro-Tip for Success**: 1 practical piece of advice for their study journey.
3. If no exact course exists, recommend the closest match and mention how it builds the foundation.
4. Keep the tone friendly, encouraging, and highly structured with bullet points and bold emphasis.`;
        }

        let completion;
        try {
            completion = await groq.chat.completions.create({
                model: "openai/gpt-oss-120b",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message },
                ],
                temperature: 0.6,
                max_tokens: 1024,
            });
        } catch (modelErr) {
            console.warn("Falling back to openai/gpt-oss-20b:", modelErr?.message);
            completion = await groq.chat.completions.create({
                model: "openai/gpt-oss-20b",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message },
                ],
                temperature: 0.6,
                max_tokens: 1024,
            });
        }

        const reply = completion?.choices?.[0]?.message?.content || "";

        return res.status(200).json({
            success: true,
            reply,
        });
    } catch (err) {
        console.log("Groq AI Error:", err);
        return res.status(500).json({
            success: false,
            message: "AI request failed",
            error: err.message,
        });
    }
};