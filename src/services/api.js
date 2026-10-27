import {
  sampleQuizzes,
  topicMasteryData,
  initialStudyTasks,
  cannedTutorResponses
} from '../data/mockData';

// API Base URL uses Vite proxy to Express on port 5000 in dev
const API_BASE = '/api';

export class ApiService {
  static isDemoMode = false;
  static localAttempts = { 'quiz-dijkstra': 58 };

  static setDemoMode(val) {
    this.isDemoMode = val;
  }

  /**
   * Health check to detect live backend status
   */
  static async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Backend offline or unreachable
    }
    return { status: 'offline', demoMode: true };
  }

  /**
   * Fetch all learning materials
   */
  static async getMaterials() {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/materials`);
        if (res.ok) {
          const data = await res.json();
          return data.materials || [];
        }
      } catch (e) {
        console.warn('[API] getMaterials falling back to local store:', e.message);
      }
    }

    // Fallback demo materials
    return [
      {
        id: "mat-demo-1",
        fileName: "CS204_Graph_Algorithms_and_Shortest_Paths.pdf",
        fileSize: 245890,
        mimeType: "application/pdf",
        uploadedAt: "2026-10-26T14:30:00.000Z",
        status: "processed",
        pageCount: 14,
        topics: [
          "Graph Traversal (BFS & DFS)",
          "Dijkstra's Algorithm & Priority Queues",
          "Negative Edge Cycles & Bellman-Ford",
          "A* Search & Admissible Heuristics"
        ],
        summary: "Lecture slides covering single-source shortest path algorithms, min-heap implementations, and negative cycle detection.",
        sampleExtractedText: "Dijkstra's Algorithm assumes non-negative edge weights because once a vertex is finalized in the min-heap, no shorter path can be found."
      },
      {
        id: "mat-demo-2",
        fileName: "CS305_Database_Storage_Engines_and_BPlus_Trees.pdf",
        fileSize: 412800,
        mimeType: "application/pdf",
        uploadedAt: "2026-10-25T10:15:00.000Z",
        status: "processed",
        pageCount: 22,
        topics: [
          "B+ Tree Index Structures",
          "Disk Block I/O Alignment & High Fanout",
          "Range Scans & Leaf Doubly Linked Lists",
          "ACID Isolation Levels & MVCC"
        ],
        summary: "Database storage engine notes covering high fan-out B+ Tree indexing, disk page retrieval, and range queries.",
        sampleExtractedText: "B+ Trees have high fan-out fitting hundreds of keys per 16KB page, limiting tree depth to 3-4 levels for millions of records."
      }
    ];
  }

  /**
   * Upload a PDF file
   */
  static async uploadMaterial(file) {
    if (!file) throw new Error('No file selected.');

    // Client-side quick validation
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      throw new Error('Invalid format: Only valid PDF documents (.pdf) are supported.');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed is 10MB.`);
    }

    if (!this.isDemoMode) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_BASE}/materials/upload`, {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'File upload failed.');
        }
        return data.material;
      } catch (e) {
        if (!e.message.includes('Invalid format') && !e.message.includes('too large')) {
          console.warn('[API] Upload server error, using client extraction fallback:', e.message);
        } else {
          throw e;
        }
      }
    }

    // Client-side fallback for upload simulation
    return {
      id: `mat-upload-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/pdf',
      uploadedAt: new Date().toISOString(),
      status: 'processed',
      pageCount: Math.max(4, Math.round(file.size / 35000)),
      topics: [
        `${file.name.replace('.pdf', '')} Core Concepts`,
        "Algorithmic Invariants",
        "System Architecture & Complexity"
      ],
      summary: `Uploaded document "${file.name}" processed with adaptive concept extraction.`,
      sampleExtractedText: `Extracted syllabus content from ${file.name}.`
    };
  }

  /**
   * Generate an adaptive quiz from material or topic
   */
  static async generateQuiz({ materialId, subject = 'Computer Science', questionCount = 5, topic = null }) {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/quizzes/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ materialId, subject, questionCount, topic })
        });
        if (res.ok) {
          const data = await res.json();
          return data.quiz;
        }
      } catch (e) {
        console.warn('[API] Quiz generation fallback:', e.message);
      }
    }

    // Local fallback
    const matched = sampleQuizzes.find((q) => q.id === materialId || q.subject.toLowerCase() === subject.toLowerCase()) || sampleQuizzes[0];
    return {
      ...matched,
      id: `quiz-gen-${Date.now()}`,
      title: topic ? `${topic} Adaptive Practice` : matched.title
    };
  }

  /**
   * Submit quiz answers and receive server-scored evaluation
   */
  static async submitQuiz(quizId, answers, timeSpentSeconds = 120) {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/quizzes/${quizId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, timeSpentSeconds })
        });
        if (res.ok) {
          const data = await res.json();
          return data.results;
        }
      } catch (e) {
        console.warn('[API] Quiz submission fallback:', e.message);
      }
    }

    // Local deterministic scoring fallback
    const quiz = sampleQuizzes.find((q) => q.id === quizId) || sampleQuizzes[0];
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);

    const priorScore = this.localAttempts[quizId];
    this.localAttempts[quizId] = percentage;
    let beforeAfterComparison = null;
    if (typeof priorScore === 'number') {
      beforeAfterComparison = {
        preScore: priorScore,
        postScore: percentage,
        delta: percentage - priorScore,
        improved: percentage > priorScore
      };
    }

    return {
      correctCount,
      totalQuestions: quiz.questions.length,
      percentage,
      beforeAfterComparison
    };
  }

  /**
   * Diagnoses an incorrect quiz answer via Misconception Coach
   */
  static async diagnoseMisconception({ question, selectedOptionIndex, materialId = null, quizId = null }) {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/quizzes/misconception/diagnose`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, selectedOptionIndex, materialId, quizId })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('[API] diagnoseMisconception fallback:', e.message);
      }
    }

    // Local deterministic fallback
    const optText = question.options[selectedOptionIndex] || `Option ${selectedOptionIndex}`;
    const corrText = question.options[question.correctAnswer] || `Option ${question.correctAnswer}`;
    return {
      success: true,
      questionId: question.id,
      topic: question.topic || 'Algorithmic Invariants',
      selectedAnswer: optText,
      selectedOptionIndex,
      correctAnswer: corrText,
      correctOptionIndex: question.correctAnswer,
      whyIncorrect: `You selected: "${optText}". This reflects a common misconception conflating algorithmic state invariant preservation with runtime crashes.`,
      whyCorrect: `The correct answer is: "${corrText}". ${question.explanation || 'This satisfies the required invariant condition.'}`,
      misconceptionHypothesis: "A common misunderstanding on this topic is assuming that local state adjustments can substitute for global invariants or asymptotic bounds.",
      isGrounded: false,
      groundingType: 'general-knowledge',
      sourceCitation: null,
      sourceExcerpt: null,
      followUpQuestion: {
        id: `fu-local-${Date.now()}`,
        originalQuestionId: question.id,
        question: `Suppose edge weights can be negative, but NO negative cycles exist. What invariant does Dijkstra's algorithm break?`,
        options: [
          "It breaks the greedy choice property because once settled, a vertex is never re-evaluated.",
          "It enters an infinite loop.",
          "It corrupts the operating system process scheduler.",
          "It forces all vertices to have degree zero."
        ],
        correctAnswer: 0,
        explanation: "Dijkstra finalizes node distances permanently upon queue extraction; negative edges break this invariant.",
        topic: question.topic || 'Algorithmic Invariants',
        difficulty: "Medium",
        generationType: 'demo-explanation'
      }
    };
  }

  /**
   * Submits a follow-up answer to the Misconception Coach
   */
  static async submitFollowUp({ followUpQuestionId, submittedAnswer, originalQuestionId = null, topic = 'Algorithms', quizId = null }) {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/quizzes/misconception/followup/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followUpQuestionId, submittedAnswer, originalQuestionId, topic, quizId })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('[API] submitFollowUp fallback:', e.message);
      }
    }

    // Local fallback
    const isCorrect = submittedAnswer === 0;
    return {
      success: true,
      attemptId: `att-fu-local-${Date.now()}`,
      isCorrect,
      submittedAnswer,
      correctAnswer: 0,
      feedbackMessage: isCorrect
        ? "You answered this follow-up correctly. Concept verified."
        : "This concept may benefit from more practice.",
      explanation: "Dijkstra's optimal substructure requires non-negative edge weights.",
      topic
    };
  }

  /**
   * Get progress analytics and topic mastery
   */
  static async getProgress() {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/progress`);
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('[API] getProgress fallback:', e.message);
      }
    }

    return {
      summary: {
        totalQuizzesTaken: 18,
        averageScore: 88.4,
        topicsMasteredCount: 24,
        totalTopicsTracked: 32,
        streakDays: 14,
        totalStudyHours: 38.5
      },
      preVsPostComparisons: [
        {
          topic: "Graph Traversal & Shortest Path (Dijkstra's Algorithm)",
          preScore: 58,
          postScore: 85,
          delta: 27,
          isImproved: true,
          preDate: "2026-10-26T10:00:00.000Z",
          postDate: "2026-10-27T08:30:00.000Z"
        }
      ],
      rankedWeakTopics: [
        {
          topicName: "Dijkstra Negative Edge Invariant",
          subject: "Algorithms",
          accuracy: 58,
          masteryLevel: "Developing",
          priorityScore: 78
        },
        {
          topicName: "Virtual Memory Page Table Walking",
          subject: "Operating Systems",
          accuracy: 64,
          masteryLevel: "Developing",
          priorityScore: 68
        }
      ]
    };
  }

  /**
   * Get study plan tasks
   */
  static async getStudyPlan() {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/study-plan`);
        if (res.ok) {
          const data = await res.json();
          return data.tasks || initialStudyTasks;
        }
      } catch (e) {
        console.warn('[API] getStudyPlan fallback:', e.message);
      }
    }
    return initialStudyTasks;
  }

  /**
   * Generate an adaptive study plan respecting daily study limits
   */
  static async generateStudyPlan({ dailyStudyHours = 3.5, examDate = "Fall 2026 Finals" }) {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/study-plan/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dailyStudyHours, examDate })
        });
        if (res.ok) {
          const data = await res.json();
          return data.tasks;
        }
      } catch (e) {
        console.warn('[API] generateStudyPlan fallback:', e.message);
      }
    }
    return initialStudyTasks;
  }

  /**
   * Update study task completion state
   */
  static async updateStudyTask(taskId, completed) {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/study-plan/tasks/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed })
        });
        if (res.ok) {
          const data = await res.json();
          return data.task;
        }
      } catch (e) {
        console.warn('[API] updateStudyTask fallback:', e.message);
      }
    }
    return { id: taskId, completed };
  }

  /**
   * Send a question to the AI Tutor with optional document context
   */
  static async sendTutorMessage({ query, materialId = null, history = [] }) {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/tutor/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, materialId, history })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('[API] sendTutorMessage fallback:', e.message);
      }
    }

    // Local fallback when backend offline
    const qLower = query.toLowerCase();
    const matched = cannedTutorResponses.find((c) => {
      if (qLower.includes(c.trigger)) return true;
      if (Array.isArray(c.aliases) && c.aliases.some((a) => qLower.includes(a))) return true;
      return false;
    });

    return {
      answer: matched
        ? matched.response
        : `### Computer Science Concept Analysis: ${query}\n\n#### 1. Core Theoretical Foundations\nEvery computational system balances fundamental trade-offs between execution time, space efficiency, and correctness guarantees. Formulating solutions requires identifying the system invariants governing correct state transitions.\n\n#### 2. Architectural Invariants\n* **State Invariants**: Verify that system preconditions remain preserved across all operations.\n* **Asymptotic Efficiency**: Distinguish between worst-case bounds, average-case runtime, and memory hierarchy overhead.\n\n> *Note: This explanation is based on standard Computer Science principles. To receive citations grounded in your specific course notes, select an uploaded document from the context dropdown above.*`,
      generationType: 'demo-explanation',
      groundingType: 'general-knowledge',
      isGrounded: false,
      sourceCitation: null,
      sourceExcerpt: null
    };
  }

  /**
   * Diagnose misconception when a question is answered incorrectly
   */
  static async diagnoseMisconception({ question, selectedOptionIndex, materialId = null, quizId = null }) {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/quizzes/misconception/diagnose`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, selectedOptionIndex, materialId, quizId })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('[API] diagnoseMisconception fallback:', e.message);
      }
    }

    // Local deterministic fallback
    const selectedOptText = question.options[selectedOptionIndex];
    const correctOptText = question.options[question.correctAnswer];
    const topic = question.keyConcept || question.topic || 'Algorithmic Invariants';

    return {
      success: true,
      questionId: question.id,
      topic,
      selectedAnswer: selectedOptText,
      selectedOptionIndex,
      correctAnswer: correctOptText,
      correctOptionIndex: question.correctAnswer,
      whyIncorrect: `Option "${selectedOptText}" assumes an incorrect condition that violates system invariants.`,
      whyCorrect: `The correct answer is "${correctOptText}". ${question.explanation || 'This maintains the system invariant.'}`,
      misconceptionHypothesis: `A common misunderstanding on ${topic} is assuming that local state adjustments can substitute for global invariants or asymptotic bounds.`,
      isGrounded: false,
      groundingType: 'general-knowledge',
      sourceCitation: null,
      sourceExcerpt: null,
      followUpQuestion: {
        id: `fu-local-${Date.now()}`,
        question: `In the context of ${topic}, which condition must be verified before relying on optimal substructure?`,
        options: [
          "Verify that no delayed edge relaxation can invalidate previously finalized node states.",
          "Verify that the graph is stored as an adjacency matrix rather than an adjacency list.",
          "Verify that all vertex identifiers are sorted in strictly increasing order.",
          "Verify that memory allocation is done in a single contiguous kernel page."
        ],
        correctAnswer: 0,
        explanation: "Optimal substructure requires that subproblem solutions compose without being invalidated by subsequent relaxations.",
        topic,
        difficulty: "Medium"
      }
    };
  }

  /**
   * Submit targeted follow-up question answer for scoring on server
   */
  static async submitFollowUp({ followUpQuestionId, submittedAnswer, originalQuestionId = null, topic = 'Algorithms', quizId = null }) {
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE}/quizzes/misconception/followup/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followUpQuestionId, submittedAnswer, originalQuestionId, topic, quizId })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('[API] submitFollowUp fallback:', e.message);
      }
    }

    const isCorrect = submittedAnswer === 0;
    return {
      success: true,
      attemptId: `att-local-${Date.now()}`,
      isCorrect,
      submittedAnswer,
      correctAnswer: 0,
      feedbackMessage: isCorrect ? "You answered this follow-up correctly. Concept verified." : "This concept may benefit from more practice.",
      explanation: "Optimal substructure requires that optimal solutions to subproblems form an optimal solution to the overall problem."
    };
  }
}
