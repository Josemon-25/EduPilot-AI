export class AdaptiveEngine {
  /**
   * Evaluates topic performance and determines mastery status
   */
  static calculateMasteryLevel(accuracy, attemptsCount) {
    if (attemptsCount < 2) {
      return "Not enough data";
    }
    if (accuracy >= 75) {
      return "Strong";
    }
    if (accuracy >= 50) {
      return "Developing";
    }
    return "Needs attention";
  }

  /**
   * Scores a quiz submission securely on the server
   */
  static scoreSubmission(quiz, userAnswers) {
    let correctCount = 0;
    const questionResults = [];
    const topicBreakdown = {};

    for (const q of quiz.questions) {
      const selectedOption = userAnswers[q.id];
      const isCorrect = selectedOption === q.correctAnswer;

      if (isCorrect) {
        correctCount++;
      }

      const topic = q.topic || quiz.subject || "General";
      if (!topicBreakdown[topic]) {
        topicBreakdown[topic] = { total: 0, correct: 0 };
      }
      topicBreakdown[topic].total++;
      if (isCorrect) {
        topicBreakdown[topic].correct++;
      }

      questionResults.push({
        questionId: q.id,
        question: q.question,
        selectedOption,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        topic,
        pageReference: q.pageReference || null
      });
    }

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return {
      correctCount,
      totalQuestions,
      percentage,
      questionResults,
      topicBreakdown
    };
  }

  /**
   * Adaptive topic ranking algorithm
   * Priority Score = (100 - accuracy) * 0.5 + (urgency) * 0.3 + (recency decay) * 0.2
   */
  static rankWeakTopics(topicMasteryMap) {
    const topics = Object.entries(topicMasteryMap).map(([name, data]) => {
      const accuracy = typeof data.accuracy === 'number' ? data.accuracy : 50;
      const attempts = data.attempts || 0;

      // Recency decay in days
      let daysSinceLast = 1;
      if (data.lastPracticed) {
        const lastDate = new Date(data.lastPracticed).getTime();
        const diffDays = Math.max(0, (Date.now() - lastDate) / (1000 * 60 * 60 * 24));
        daysSinceLast = Math.min(14, diffDays);
      }

      // Priority formula: lower accuracy and older practice time increase revision priority
      const decayFactor = Math.min(30, daysSinceLast * 3);
      const priorityScore = (100 - accuracy) * 0.6 + decayFactor * 0.4;

      return {
        topicName: name,
        subject: data.subject || "Computer Science",
        accuracy,
        attempts,
        masteryLevel: this.calculateMasteryLevel(accuracy, attempts),
        daysSinceLastPractice: Math.round(daysSinceLast),
        priorityScore: Math.round(priorityScore),
        status: data.status || (accuracy < 60 ? "Weak Topic" : "Developing")
      };
    });

    // Sort descending by priorityScore
    return topics.sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * Pre-revision vs Post-revision comparison
   */
  static compareAttempts(attemptsList, targetTopic = null) {
    const comparisons = [];
    const topicAttempts = {};

    for (const att of attemptsList) {
      const top = att.topic || att.subject;
      if (!topicAttempts[top]) {
        topicAttempts[top] = [];
      }
      topicAttempts[top].push(att);
    }

    for (const [top, list] of Object.entries(topicAttempts)) {
      if (targetTopic && top !== targetTopic) continue;

      // Sort by submission time ascending
      const sorted = [...list].sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

      if (sorted.length >= 2) {
        const preAttempt = sorted[0];
        const postAttempt = sorted[sorted.length - 1];
        const delta = postAttempt.score - preAttempt.score;

        comparisons.push({
          topic: top,
          preScore: preAttempt.score,
          postScore: postAttempt.score,
          delta,
          isImproved: delta > 0,
          preDate: preAttempt.submittedAt,
          postDate: postAttempt.submittedAt,
          totalAttemptsCount: sorted.length
        });
      }
    }

    return comparisons;
  }

  /**
   * Generates a realistic study plan constrained by daily study hours
   */
  static generateStudyPlan({ weakTopics, dailyStudyHours = 3.5, examDate = "Fall 2026 Finals" }) {
    const availableMinutes = Math.round(dailyStudyHours * 60);
    let allocatedMinutes = 0;
    const tasks = [];

    // Prioritize top weak topics
    for (const topic of weakTopics) {
      const taskDuration = topic.accuracy < 60 ? 35 : 25; // 35m for weak, 25m for developing

      if (allocatedMinutes + taskDuration <= availableMinutes) {
        allocatedMinutes += taskDuration;

        let scheduledSlot = "04:00 PM Today";
        if (tasks.length === 1) scheduledSlot = "05:30 PM Today";
        if (tasks.length === 2) scheduledSlot = "07:00 PM Today";
        if (tasks.length >= 3) scheduledSlot = "10:00 AM Tomorrow";

        tasks.push({
          id: `task-gen-${Date.now()}-${tasks.length}`,
          title: `Master ${topic.topicName} Invariants`,
          subject: topic.subject,
          time: scheduledSlot,
          priority: topic.priorityScore > 50 ? "High" : "Medium",
          duration: `${taskDuration} mins`,
          durationMinutes: taskDuration,
          completed: false,
          reason: `Targeting ${topic.accuracy}% accuracy retention dip before ${examDate}.`
        });
      }
    }

    return {
      dailyStudyHours,
      totalAllocatedMinutes: allocatedMinutes,
      tasks
    };
  }
}
