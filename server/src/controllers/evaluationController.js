import { evaluateAnswer } from '../services/evaluationService.js';
import Result from '../models/Result.js';

export const handleEvaluation = async (req, res) => {
    const { question, answer, userId, category, wasFlagged } = req.body;

    if (!question || !answer) {
        return res.status(400).json({ message: 'Question and answer are required' });
    }

    try {
        const result = await evaluateAnswer(question, answer);

        // Save evaluation if userId is provided
        if (userId) {
            await Result.create({
                userId: userId,
                type: 'Interview',
                score: result.score, // Assuming evaluationService returns a score out of 10
                totalScore: 10,
                category: category || 'General',
                wasFlagged: !!wasFlagged,
                skill: req.body.skill,
                difficulty: req.body.difficulty
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
