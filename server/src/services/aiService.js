import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generateInterviewQuestions = async (skill, difficulty, numberOfQuestions) => {
    const prompt = `Generate ${numberOfQuestions} ${difficulty} level interview questions with detailed answers about ${skill}. 
  Return the response strictly as a JSON array of objects, where each object has exactly two fields: "question" and "answer". 
  Do not include any conversational text, markdown formatting (like \`\`\`json), or explanations outside the JSON array.`;

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a senior technical interviewer. You provide high-quality interview questions and concise, accurate answers in strict JSON format."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        let content = response.choices[0].message.content.trim();

        // Groq with json_object format might return an object like { "questions": [...] } 
        // or just the array if handled carefully. Let's ensure we return an array.
        try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) return parsed;
            if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;
            if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
            return [parsed]; // Fallback
        } catch (parseError) {
            console.error("Failed to parse Groq response as JSON:", content);
            const cleanedContent = content.replace(/```json|```/g, "").trim();
            return JSON.parse(cleanedContent);
        }
    } catch (error) {
        console.error("Groq Service Error:", error);
        throw new Error(error.message || "Failed to generate questions from Groq service");
    }
};
