import Result from '../models/Result.js';

// @desc    Save a test or interview result
// @route   POST /api/results/save
// @access  Private
export const saveResult = async (req, res) => {
    try {
        const { userId, type, score, totalScore, category, skill, difficulty } = req.body;

        if (!userId || !type || score === undefined || !totalScore || !category) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const result = await Result.create({
            userId,
            type,
            score,
            totalScore,
            category,
            skill,
            difficulty
        });

        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get progress data for charts (Daily)
// @route   GET /api/results/progress/:userId
// @access  Private
export const getProgressData = async (req, res) => {
    try {
        const { userId } = req.params;

        const results = await Result.find({ userId }).sort({ createdAt: 1 });

        // Group by day and calculate average percentage
        const chartData = results.reduce((acc, curr) => {
            const date = new Date(curr.createdAt).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = { date, score: 0, count: 0 };
            }
            acc[date].score += (curr.score / curr.totalScore) * 100;
            acc[date].count += 1;
            return acc;
        }, {});

        const formattedData = Object.values(chartData).map(day => ({
            date: day.date,
            score: Math.round(day.score / day.count)
        }));

        res.json({ success: true, data: formattedData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Calculate user percentile
// @route   GET /api/results/percentile/:userId
// @access  Private
export const getPercentile = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get user's average score
        const userResults = await Result.find({ userId });
        if (userResults.length === 0) {
            return res.json({ success: true, percentile: 0 });
        }

        const userAvg = userResults.reduce((sum, r) => sum + (r.score / r.totalScore), 0) / userResults.length;

        // Get all users' averages
        const allResults = await Result.find({});
        const userScores = allResults.reduce((acc, curr) => {
            if (!acc[curr.userId]) acc[curr.userId] = [];
            acc[curr.userId].push(curr.score / curr.totalScore);
            return acc;
        }, {});

        const allAverages = Object.values(userScores).map(scores =>
            scores.reduce((a, b) => a + b, 0) / scores.length
        );

        // Calculate percentile
        const belowCount = allAverages.filter(avg => avg < userAvg).length;
        const percentile = Math.round((belowCount / allAverages.length) * 100);

        res.json({ success: true, percentile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
