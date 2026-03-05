import express from 'express';
import { saveResult, getProgressData, getPercentile } from '../controllers/resultController.js';

const router = express.Router();

router.post('/save', saveResult);
router.get('/progress/:userId', getProgressData);
router.get('/percentile/:userId', getPercentile);

export default router;
