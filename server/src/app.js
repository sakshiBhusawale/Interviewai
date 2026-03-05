import express from 'express';
import cors from 'cors';
import interviewRoutes from './routes/interviewRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', interviewRoutes);
app.use('/api/auth', authRoutes);

// Healthy check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'SkillForge AI Server is running' });
});

export default app;
