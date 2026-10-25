import express from "express"
import cors from "cors"
import { GoogleGenerativeAI } from "@google/generative-ai"

const app = express()
// const PORT = 3012

const SYSTEM_PROMPT = `
you are a witty assistant. Given a list of keywords, create a single, clean one-line joke that includes all the keywords. Output only raw Markdown, no surrounding symbols. Keep it family-friendly and under 140 characters.
`

// Load API key from environment — never hard-code it here!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

// app.use(
//     cors({
//         origin: [
//             "http://localhost:5173",
//             "https://joke-dude.vercel.app"
//         ],
//     })
// )

app.use(cors())

app.use(express.json())

app.post("/api/joke", async (req, res) => {
    const { keywords } = req.body

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ error: "Please provide a non-empty 'keywords' array." })
    }

    const ingredientsString = keywords.join(", ")

    try {
        const result = await model.generateContent([
            SYSTEM_PROMPT,
            `I have ${ingredientsString}. Please give me a joke!`
        ])

        const joke = result.response.text()
        return res.json({ joke })
    } catch (err) {
        console.error("Gemini API error:", err.message)
        return res.status(500).json({ error: "Failed to generate joke. Please try again." })
    }
})

// const server = app.listen(PORT, () => {
//     console.log(`✅  Joke backend running at http://localhost:${PORT}`)
// })

// // Gracefully close the server when node --watch restarts (SIGTERM)
// process.on('SIGTERM', () => {
//     server.close(() => process.exit(0))
// })

export default app
