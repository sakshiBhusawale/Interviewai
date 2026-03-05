import { generateMCQs } from '../services/mcqService.js';

export const handleMCQGeneration = async (req, res) => {
    const { category, count } = req.body;

    if (!category) {
        return res.status(400).json({ message: 'Category is required' });
    }

    try {
        const mcqs = await generateMCQs(category, count || 10);
        res.json({ success: true, data: mcqs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
