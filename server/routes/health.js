import express from 'express';
import { config } from '../config/index.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'EduPilot AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demoMode: config.demoMode,
    activeProviders: {
      gemini: Boolean(config.aiKeys.gemini),
      openai: Boolean(config.aiKeys.openai),
      anthropic: Boolean(config.aiKeys.anthropic)
    }
  });
});

export default router;
