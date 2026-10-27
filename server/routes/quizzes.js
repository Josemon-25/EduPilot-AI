import express from 'express';
import { AIService } from '../services/aiService.js';
import { AdaptiveEngine } from '../services/adaptiveEngine.js';
import { MisconceptionCoach } from '../services/misconceptionCoach.js';
import { store } from '../data/store.js';

const router = express.Router();

// POST /api/quizzes/generate
router.post('/quizzes/generate', async (req, res) => {
  try {
    const { materialId, subject = 'Computer Science', questionCount = 5, topic } = req.body;

    let textContext = '';
    let topicsList = topic ? [topic] : [];

    if (materialId) {
      const material = store.getMaterialById(materialId);
      if (material) {
        textContext = material.sampleExtractedText || '';
        if (material.topics) topicsList = material.topics;
      }
    }

    if (!textContext && topicsList.length === 0) {
      topicsList = ['Algorithmic Invariants & Time Complexity'];
      textContext = 'Fundamental data structures and algorithms, asymptotic bounds, binary heaps and trees.';
    }

    const quiz = await AIService.generateQuiz({
      text: textContext,
      topics: topicsList,
      questionCount: Math.min(10, Math.max(3, parseInt(questionCount, 10) || 5)),
      subject,
      materialId
    });

    store.addQuiz(quiz);

    res.status(201).json({
      success: true,
      message: 'Adaptive quiz generated successfully.',
      quiz
    });
  } catch (err) {
    console.error('[Quizzes] Generation error:', err);
    res.status(500).json({ error: 'Generation Failed', message: err.message });
  }
});

// GET /api/quizzes
router.get('/quizzes', (req, res) => {
  try {
    const quizzes = store.getQuizzes();
    res.json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// GET /api/quizzes/:id
router.get('/quizzes/:id', (req, res) => {
  try {
    const quiz = store.getQuizById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Quiz with ID ${req.params.id} does not exist.`
      });
    }

    // Return quiz questions
    res.json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// POST /api/quizzes/:id/submit
router.post('/quizzes/:id/submit', (req, res) => {
  try {
    const quiz = store.getQuizById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Quiz with ID ${req.params.id} does not exist.`
      });
    }

    const { answers, timeSpentSeconds = 120 } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid answers submission format. Expected an object with questionId keys.'
      });
    }

    // Server-side scoring
    const scoreResult = AdaptiveEngine.scoreSubmission(quiz, answers);

    // Retrieve previous attempts for this specific quiz or target topic BEFORE saving the new attempt
    const existingAttempts = store.getAttempts().filter(
      (a) => a.quizId === quiz.id || (quiz.weakTopicTarget && a.topic === quiz.weakTopicTarget)
    );

    const isRetest = existingAttempts.length > 0;
    const attemptType = isRetest ? 'post-revision' : 'pre-revision';

    const newAttempt = {
      id: `att-${Date.now()}`,
      quizId: quiz.id,
      subject: quiz.subject,
      topic: quiz.weakTopicTarget || quiz.title,
      attemptType,
      score: scoreResult.percentage,
      totalQuestions: scoreResult.totalQuestions,
      correctCount: scoreResult.correctCount,
      timeSpentSeconds,
      submittedAt: new Date().toISOString(),
      answers
    };

    store.addAttempt(newAttempt);

    // Update topic stats based on actual scores
    const primaryTopic = quiz.weakTopicTarget || quiz.subject || 'Algorithms';
    const updatedMastery = store.updateTopicMastery(primaryTopic, {
      subject: quiz.subject,
      attempts: 1,
      correct: scoreResult.percentage >= 70 ? 1 : 0
    });

    // Calculate before/after comparison ONLY if an authentic prior attempt exists
    let beforeAfterComparison = null;
    if (isRetest) {
      // Sort existing attempts chronologically to compare against the most recent prior attempt
      const sortedAttempts = [...existingAttempts].sort(
        (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      );
      const priorAttempt = sortedAttempts[sortedAttempts.length - 1];
      const delta = scoreResult.percentage - priorAttempt.score;

      beforeAfterComparison = {
        preScore: priorAttempt.score,
        postScore: scoreResult.percentage,
        delta,
        improved: delta > 0,
        preDate: priorAttempt.submittedAt,
        postDate: newAttempt.submittedAt,
        attemptNumber: sortedAttempts.length + 1
      };
    }

    res.json({
      success: true,
      message: 'Quiz evaluated successfully.',
      results: {
        ...scoreResult,
        attemptId: newAttempt.id,
        attemptType,
        updatedMastery,
        beforeAfterComparison
      }
    });
  } catch (err) {
    console.error('[Quizzes] Submission error:', err);
    res.status(500).json({ error: 'Evaluation Error', message: err.message });
  }
});

// POST /api/quizzes/misconception/diagnose
router.post('/quizzes/misconception/diagnose', async (req, res) => {
  try {
    const { question, selectedOptionIndex, materialId, quizId } = req.body;

    if (!question || typeof selectedOptionIndex !== 'number') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'A valid question object and selectedOptionIndex number are required.'
      });
    }

    const diagnosis = await MisconceptionCoach.diagnose({
      question,
      selectedOptionIndex,
      materialId,
      quizId
    });

    res.json(diagnosis);
  } catch (err) {
    console.error('[MisconceptionCoach] Diagnosis error:', err);
    res.status(500).json({ error: 'Diagnosis Failed', message: err.message });
  }
});

// POST /api/quizzes/misconception/followup/submit
router.post('/quizzes/misconception/followup/submit', (req, res) => {
  try {
    const { followUpQuestionId, submittedAnswer, originalQuestionId, topic, quizId } = req.body;

    if (!followUpQuestionId || typeof submittedAnswer !== 'number') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'followUpQuestionId and numeric submittedAnswer are required.'
      });
    }

    const evaluation = MisconceptionCoach.evaluateFollowUp({
      followUpQuestionId,
      submittedAnswer,
      originalQuestionId,
      topic,
      quizId
    });

    res.json(evaluation);
  } catch (err) {
    console.error('[MisconceptionCoach] Follow-up evaluation error:', err);
    res.status(500).json({ error: 'Evaluation Failed', message: err.message });
  }
});

export default router;
