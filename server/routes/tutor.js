import express from 'express';
import { AIService } from '../services/aiService.js';
import { store } from '../data/store.js';

const router = express.Router();

// POST /api/tutor/chat
router.post('/tutor/chat', async (req, res) => {
  try {
    const { query, materialId, history = [] } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'A valid text query is required.'
      });
    }

    let selectedMaterial = null;
    if (materialId && materialId !== 'general') {
      selectedMaterial = store.getMaterialById(materialId);
    }

    const tutorResult = await AIService.tutorChat({
      query: query.trim(),
      material: selectedMaterial,
      history
    });

    res.json({
      success: true,
      query: query.trim(),
      ...tutorResult,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Tutor] Chat error:', err);
    res.status(500).json({ error: 'Tutor Service Error', message: err.message });
  }
});

export default router;
