import express from 'express';
import { AdaptiveEngine } from '../services/adaptiveEngine.js';
import { store } from '../data/store.js';

const router = express.Router();

// GET /api/study-plan
router.get('/study-plan', (req, res) => {
  try {
    const tasks = store.getStudyTasks();
    const completedCount = tasks.filter((t) => t.completed).length;
    res.json({
      success: true,
      tasks,
      completedCount,
      totalCount: tasks.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// POST /api/study-plan/generate
router.post('/study-plan/generate', (req, res) => {
  try {
    const { dailyStudyHours = 3.5, examDate = "Fall 2026 CS Finals" } = req.body;
    const topicMastery = store.getTopicMastery();
    const weakTopics = AdaptiveEngine.rankWeakTopics(topicMastery);

    const generated = AdaptiveEngine.generateStudyPlan({
      weakTopics,
      dailyStudyHours: parseFloat(dailyStudyHours) || 3.5,
      examDate
    });

    // Merge existing tasks with newly generated tasks
    const existing = store.getStudyTasks();
    const combined = [...generated.tasks, ...existing.slice(0, 2)];
    store.setStudyTasks(combined);

    res.json({
      success: true,
      message: 'Adaptive study plan successfully calibrated.',
      plan: generated,
      tasks: combined
    });
  } catch (err) {
    res.status(500).json({ error: 'Plan Generation Error', message: err.message });
  }
});

// PATCH /api/study-plan/tasks/:taskId
router.patch('/study-plan/tasks/:taskId', (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'completed boolean field is required.'
      });
    }

    const updatedTask = store.updateStudyTask(taskId, { completed });
    if (!updatedTask) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID ${taskId} was not found.`
      });
    }

    res.json({
      success: true,
      message: `Task marked as ${completed ? 'completed' : 'pending'}.`,
      task: updatedTask
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

export default router;
