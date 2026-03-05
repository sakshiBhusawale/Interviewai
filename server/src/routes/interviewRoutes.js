import express from 'express';
import { generateQuestions } from '../controllers/interviewController.js';
import { handleEvaluation } from '../controllers/evaluationController.js';
import { handleSimulation } from '../controllers/simulationController.js';
import { handleMCQGeneration } from '../controllers/mcqController.js';

const router = express.Router();

router.post('/generate', generateQuestions);
router.post('/evaluate', handleEvaluation);
router.post('/simulate', handleSimulation);
router.post('/mcq/generate', handleMCQGeneration);

export default router;
