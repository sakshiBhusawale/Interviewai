import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const getSimulationResponse = async (messages) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are an elite technical interviewer. Your goal is to conduct a realistic, conversational interview. Ask one question at a time. After the user answers, provide brief feedback or ask a follow-up/new question. Stay professional and encouraging. Keep responses concise.',
                },
                ...messages
            ],
            model: 'llama-3.3-70b-versatile',
        });

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Groq Simulation Error:', error);
        throw new Error('Failed to get simulation response');
    }
};

export const evaluateSimulationSession = async (messages) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert interviewer. Analyze the provided interview transcript. Provide a score out of 10, brief feedback on what went well, and specific suggestions for improvement. Return the response in strict JSON format: { "score": 8, "feedback": "...", "improvement": "..." }',
                },
                ...messages
            ],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' }
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error('Groq Evaluation Error:', error);
        throw new Error('Failed to evaluate interview session');
    }
};
