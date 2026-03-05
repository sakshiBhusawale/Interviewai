import { getSimulationResponse, evaluateSimulationSession } from '../services/simulationService.js';
import Result from '../models/Result.js';

export const handleSimulation = async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: 'Messages array is required' });
    }

    try {
        const response = await getSimulationResponse(messages);
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const handleSimulationEvaluation = async (req, res) => {
    const { messages, userId, category, skill, difficulty, wasFlagged } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: 'Messages array is required' });
    }

    try {
        const evaluation = await evaluateSimulationSession(messages);

        // Save to database
        if (userId) {
            await Result.create({
                userId,
                type: 'Interview',
                score: evaluation.score,
                totalScore: 10,
                category: category || 'General',
                skill: skill,
                difficulty: difficulty,
                wasFlagged: !!wasFlagged
            });
        }

        res.json({ success: true, data: evaluation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
