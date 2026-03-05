import * as aiService from '../services/aiService.js';

export const generateQuestions = async (req, res) => {
    const { skill, difficulty, numberOfQuestions } = req.body;

    if (!skill || !difficulty || !numberOfQuestions) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Missing required fields: skill, difficulty, and numberOfQuestions are required."
        });
    }

    try {
        const questions = await aiService.generateInterviewQuestions(skill, difficulty, numberOfQuestions);
        res.status(200).json({
            success: true,
            data: {
                questions
            }
        });
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message || "An error occurred while generating questions."
        });
    }
};
