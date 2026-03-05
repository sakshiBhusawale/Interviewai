import { evaluateAnswer } from '../services/evaluationService.js';

export const handleEvaluation = async (req, res) => {
    const { question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).json({ message: 'Question and answer are required' });
    }

    try {
        const result = await evaluateAnswer(question, answer);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
