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

        let systemPrompt = "You are a helpful assistant for the Edufy learning platform.";

        if (mode === "doubt-solver") {
            systemPrompt = `You are a friendly teaching assistant for the Edufy platform.
The student is currently studying this course/lecture context: ${context}
Answer their doubt clearly and simply, with short examples where useful. Keep answers focused and not overly long.`;
        } else if (mode === "course-content") {
            systemPrompt = `You are an expert instructional designer helping an instructor write course content for Edufy.
Write clear, engaging, well-structured content based on what they ask for (description, learning outcomes, requirements, etc).
Keep it professional and student-friendly.`;
        } else if (mode === "recommendation") {
            systemPrompt = `You are a course recommendation assistant for Edufy.
Given the list of available courses and the student's interests below, suggest the most relevant ones and briefly explain why.
Available courses: ${context}`;
        }

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content || "";

        return res.status(200).json({
            success: true,
            reply,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "AI request failed",
            error: err.message,
        });
    }
};