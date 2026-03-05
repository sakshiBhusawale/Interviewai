import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const evaluateAnswer = async (question, answer) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert technical interviewer. Evaluate the given interview answer based on the question. Provide a score out of 10, clear feedback on what was good, and how it could be improved. Return the response in JSON format with fields: "score", "feedback", and "improvement".',
                },
                {
                    role: 'user',
                    content: `Question: ${question}\nAnswer: ${answer}`,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' },
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error('Groq API Error:', error);
        throw new Error('Failed to evaluate answer');
    }
};
