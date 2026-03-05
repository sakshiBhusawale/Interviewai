import { getSimulationResponse } from '../services/simulationService.js';

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
