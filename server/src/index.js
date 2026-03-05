import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 SkillForge AI Backend running on http://localhost:${PORT}`);
});
