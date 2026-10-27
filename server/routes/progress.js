import express from 'express';
import { AdaptiveEngine } from '../services/adaptiveEngine.js';
import { store } from '../data/store.js';

const router = express.Router();

// GET /api/progress
router.get('/progress', (req, res) => {
  try {
    const topicMastery = store.getTopicMastery();
    const attempts = store.getAttempts();

    // Ranked weak topics
    const rankedTopics = AdaptiveEngine.rankWeakTopics(topicMastery);

    // Pre vs Post revision comparisons
    const comparisons = AdaptiveEngine.compareAttempts(attempts);

    // Summary calculations
    const topicsArray = Object.values(topicMastery);
    const masteredCount = topicsArray.filter((t) => (t.accuracy || 0) >= 75).length;
    const avgScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 88;

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalQuizzesTaken: attempts.length,
        averageScore: avgScore,
        topicsMasteredCount: masteredCount,
        totalTopicsTracked: topicsArray.length,
        streakDays: 14,
        totalStudyHours: 38.5
      },
      topicMastery,
      rankedWeakTopics: rankedTopics.slice(0, 5),
      preVsPostComparisons: comparisons,
      recentAttempts: attempts.slice(0, 10)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

export default router;
