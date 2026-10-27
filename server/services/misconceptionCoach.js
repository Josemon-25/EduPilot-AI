import { config } from '../config/index.js';
import { GroundingService } from './groundingService.js';
import { AIService } from './aiService.js';
import { store } from '../data/store.js';

export class MisconceptionCoach {
  /**
   * Deterministic educational follow-up question templates mapped by topic
   */
  static FOLLOW_UP_CATALOG = {
    'dijkstra': {
      concept: "Dijkstra's Greedy Invariant & Negative Weights",
      whyIncorrectTemplate: (optText) =>
        `Option states "${optText}". This reflects a common misconception conflating algorithmic invariants with heap corruption or runtime crashes.`,
      whyCorrectTemplate: (corrText) =>
        `The correct answer is: "${corrText}". Dijkstra greedily finalizes vertices upon priority queue extraction; negative weights violate this optimal substructure property.`,
      hypothesis:
        "A common misunderstanding on this topic is assuming that Dijkstra fails due to infinite execution loops, rather than the premature finalization of node distances that cannot be updated when a cheaper delayed path appears.",
      followUp: {
        id: "fu-dijkstra-variant-1",
        question: "Suppose a directed graph has an edge with weight -3, but contains NO negative cycles. If standard Dijkstra's algorithm is executed, what behavior can occur?",
        options: [
          "It may output an incorrect shortest distance because an already settled vertex is never re-opened in standard Dijkstra.",
          "It is guaranteed to enter an infinite loop and run indefinitely.",
          "It automatically runs in O(V) linear time.",
          "It always computes the true shortest distance as long as there are no negative cycles."
        ],
        correctAnswer: 0,
        explanation: "Dijkstra's greedy choice property assumes that once a vertex is extracted from the priority queue, its distance is finalized. A negative edge can cause a later path to have smaller total weight, breaking this invariant even without negative cycles.",
        topic: "Dijkstra Greedy Invariant",
        difficulty: "Medium"
      }
    },
    'heap': {
      concept: "Priority Queue Heap Complexity",
      whyIncorrectTemplate: (optText) =>
        `Option states "${optText}". This represents a common confusion between the cost of vertex extraction (O(V log V)) and edge relaxation (O(E log V)).`,
      whyCorrectTemplate: (corrText) =>
        `The correct answer is: "${corrText}". Each vertex triggers an extract-min from the heap (O(V log V)) and each edge can trigger a decrease-key operation (O(E log V)).`,
      hypothesis:
        "A possible misconception is treating edge relaxations as constant O(1) operations instead of accounting for the binary heap decrease-key re-heapification cost of O(log V).",
      followUp: {
        id: "fu-heap-variant-1",
        question: "If Dijkstra's algorithm is implemented with an unsorted array rather than a Min-Heap, what is the resulting time complexity, and when is this advantageous?",
        options: [
          "O(V^2), which is optimal for dense graphs where E approaches V^2 since array lookups avoid O(log V) heap overhead per edge.",
          "O(E log V), which is only advantageous for disconnected graphs.",
          "O(V + E), which is linear for all planar networks.",
          "O(V^3), which is never used in practice."
        ],
        correctAnswer: 0,
        explanation: "With an unsorted array, finding the minimum vertex takes O(V) each time (total O(V^2)), but relaxing an edge takes O(1) time (total O(E)). When E approaches V^2, O(V^2 + E) = O(V^2), outperforming a binary heap's O(V^2 log V).",
        topic: "Heap vs Array Complexity",
        difficulty: "Medium"
      }
    },
    'b+ tree': {
      concept: "B+ Tree Fan-Out and Disk Block I/O Alignment",
      whyIncorrectTemplate: (optText) =>
        `Option states "${optText}". This suggests an assumption that storage engines read records individually rather than in fixed page blocks.`,
      whyCorrectTemplate: (corrText) =>
        `The correct answer is: "${corrText}". B+ Trees optimize for disk I/O by fitting hundreds of keys per 16KB block and chaining leaf nodes for sequential range scans.`,
      hypothesis:
        "A common misunderstanding is assuming binary search trees are suitable for persistent storage, overlooking that each tree node traversal requires an expensive random disk block seek.",
      followUp: {
        id: "fu-btree-variant-1",
        question: "In a database storage engine using 16KB pages and 64-byte index entries (fan-out = 250), what is the maximum number of records indexed with a tree height of 3 levels?",
        options: [
          "Approximately 250^3 = 15.6 million records accessed in only 3 disk block reads.",
          "Only 250 * 3 = 750 records.",
          "Exactly 2^16 = 65,536 records.",
          "Unlimited records without any disk reads."
        ],
        correctAnswer: 0,
        explanation: "With a fan-out of 250, level 1 has 1 root page, level 2 has 250 pages, and level 3 has 250^2 = 62,500 leaf pages. At 250 keys per page, 62,500 * 250 = 15,625,000 records can be indexed with at most 3 page I/O reads.",
        topic: "B+ Tree Fan-Out Calculation",
        difficulty: "Hard"
      }
    },
    'dag': {
      concept: "DAG Shortest Path Linear Relaxation",
      whyIncorrectTemplate: (optText) =>
        `Option states "${optText}". In a DAG, cycles cannot exist, which fundamentally changes algorithm selection.`,
      whyCorrectTemplate: (corrText) =>
        `The correct answer is: "${corrText}". Because a DAG has no cycles, vertices can be processed in topological order, yielding shortest paths in O(V + E) time even with negative edges.`,
      hypothesis:
        "A possible misunderstanding is assuming that any presence of negative edge weights requires the O(V * E) Bellman-Ford algorithm, overlooking that acyclic structure eliminates the risk of cycles.",
      followUp: {
        id: "fu-dag-variant-1",
        question: "Why does relaxing edges in topological order correctly find single-source shortest paths in a DAG even if some edge weights are negative?",
        options: [
          "Because no directed cycle can exist, all predecessors of a vertex u are fully finalized before u is ever relaxed.",
          "Because topological sort converts negative weights into positive numbers.",
          "Because DAGs only have tree edges and no cross edges.",
          "Because it runs Bellman-Ford on each connected component."
        ],
        correctAnswer: 0,
        explanation: "In topological order, for every directed edge (u, v), u appears before v. Thus, when we relax from u to v, dist[u] has already reached its final optimal shortest path value and will never change, regardless of edge weight signs.",
        topic: "Topological Sort Invariant",
        difficulty: "Medium"
      }
    }
  };

  /**
   * Diagnoses an incorrect answer and provides educational coaching + follow-up
   */
  static async diagnose({
    question,
    selectedOptionIndex,
    materialId = null,
    quizId = null
  }) {
    if (!question) {
      throw new Error('A question object is required for misconception analysis.');
    }

    const selectedOptText = question.options[selectedOptionIndex] || `Option ${selectedOptionIndex}`;
    const correctOptText = question.options[question.correctAnswer] || `Option ${question.correctAnswer}`;
    const topic = question.topic || question.keyConcept || 'Computer Science Invariants';
    const topicLower = topic.toLowerCase();
    const qLower = (question.question + ' ' + topic).toLowerCase();

    // 1. Identify matched pedagogical template or construct general explanation
    let matchedCatalog = null;
    if (qLower.includes('dijkstra') || qLower.includes('negative')) {
      matchedCatalog = this.FOLLOW_UP_CATALOG['dijkstra'];
    } else if (qLower.includes('heap') || qLower.includes('complexity') || qLower.includes('o(')) {
      matchedCatalog = this.FOLLOW_UP_CATALOG['heap'];
    } else if (qLower.includes('b+') || qLower.includes('tree') || qLower.includes('disk') || qLower.includes('range')) {
      matchedCatalog = this.FOLLOW_UP_CATALOG['b+ tree'];
    } else if (qLower.includes('dag') || qLower.includes('topological') || qLower.includes('acyclic')) {
      matchedCatalog = this.FOLLOW_UP_CATALOG['dag'];
    }

    // 2. Retrieve verified document evidence if material is available
    let grounding = null;
    let material = null;
    if (materialId) {
      material = store.getMaterialById(materialId);
      if (material) {
        grounding = GroundingService.verifyGrounding(material, question.question + ' ' + topic);
      }
    }

    // 3. Formulate explanations
    let whyIncorrect = matchedCatalog
      ? matchedCatalog.whyIncorrectTemplate(selectedOptText)
      : `You selected: "${selectedOptText}". In algorithmic analysis, this choice does not maintain the invariant constraints required for correctness.`;

    let whyCorrect = matchedCatalog
      ? matchedCatalog.whyCorrectTemplate(correctOptText)
      : `The correct choice is: "${correctOptText}". ${question.explanation || 'This maintains the system invariant.'}`;

    let hypothesis = matchedCatalog
      ? matchedCatalog.hypothesis
      : `A common misunderstanding on ${topic} is assuming that local state adjustments can substitute for global invariants or asymptotic bounds.`;

    // 4. Construct or generate follow-up question
    let followUpQuestion = null;
    let generationType = 'demo-explanation';

    // Try live AI generation if key is configured
    if (config.aiKeys && config.aiKeys.gemini) {
      try {
        const prompt = `Student answered incorrectly on:
Question: ${question.question}
Student choice: ${selectedOptText}
Correct answer: ${correctOptText}
Topic: ${topic}

Generate 1 follow-up multiple-choice question testing the EXACT same underlying concept with an alternative example or values.
Return ONLY raw JSON in this schema:
{
  "question": "Follow-up question text?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "Why correct"
}`;
        const rawAi = await AIService.callGemini(prompt, 'You are an educational CS instructor.');
        const jsonMatch = rawAi.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.options) && parsed.options.length === 4 && typeof parsed.correctAnswer === 'number') {
            followUpQuestion = {
              id: `fu-ai-${Date.now()}`,
              originalQuestionId: question.id,
              question: parsed.question,
              options: parsed.options,
              correctAnswer: parsed.correctAnswer,
              explanation: parsed.explanation,
              topic: topic,
              difficulty: "Adaptive"
            };
            generationType = 'ai-generated';
          }
        }
      } catch (e) {
        console.warn('[MisconceptionCoach] Live follow-up generation failed, using deterministic template:', e.message);
      }
    }

    // Fallback to deterministic follow-up from catalog
    if (!followUpQuestion) {
      if (matchedCatalog && matchedCatalog.followUp) {
        followUpQuestion = {
          ...matchedCatalog.followUp,
          originalQuestionId: question.id
        };
      } else {
        // Universal CS fallback follow-up
        followUpQuestion = {
          id: `fu-gen-${Date.now()}`,
          originalQuestionId: question.id,
          question: `In the context of ${topic}, which condition must be verified before relying on optimal substructure?`,
          options: [
            "Verify that no delayed edge relaxation can invalidate previously finalized node states.",
            "Verify that the graph is stored as an adjacency matrix rather than an adjacency list.",
            "Verify that all vertex identifiers are sorted in strictly increasing order.",
            "Verify that memory allocation is done in a single contiguous kernel page."
          ],
          correctAnswer: 0,
          explanation: "Optimal substructure requires that optimal solutions to subproblems form an optimal solution to the overall problem, which fails if subsequent states can invalidate prior decisions.",
          topic: topic,
          difficulty: "Medium"
        };
      }
    }

    // Store follow-up in temporary or persistent quiz store for server validation
    store.registerFollowUpQuestion(followUpQuestion);

    return {
      success: true,
      questionId: question.id,
      topic,
      selectedAnswer: selectedOptText,
      selectedOptionIndex,
      correctAnswer: correctOptText,
      correctOptionIndex: question.correctAnswer,
      whyIncorrect,
      whyCorrect,
      misconceptionHypothesis: hypothesis,
      isGrounded: Boolean(grounding && grounding.isGrounded),
      groundingType: grounding?.groundingType || 'general-knowledge',
      sourceCitation: grounding?.sourceCitation || null,
      sourceExcerpt: grounding?.sourceExcerpt || null,
      pageNumber: grounding?.pageNumber || null,
      followUpQuestion: {
        ...followUpQuestion,
        generationType
      }
    };
  }

  /**
   * Evaluates a submitted follow-up answer strictly on the server
   */
  static evaluateFollowUp({
    followUpQuestionId,
    submittedAnswer,
    originalQuestionId = null,
    topic = 'Algorithms',
    quizId = null
  }) {
    const followUp = store.getFollowUpQuestion(followUpQuestionId);
    if (!followUp) {
      throw new Error(`Follow-up question with ID ${followUpQuestionId} was not found on the server.`);
    }

    const isCorrect = submittedAnswer === followUp.correctAnswer;
    const submittedText = followUp.options[submittedAnswer] || `Option ${submittedAnswer}`;
    const correctText = followUp.options[followUp.correctAnswer];

    // Record follow-up attempt in store with separate attemptType
    const attemptRecord = {
      id: `att-fu-${Date.now()}`,
      quizId: quizId || 'misconception-coaching',
      originalQuestionId,
      followUpQuestionId,
      subject: 'Computer Science',
      topic: followUp.topic || topic,
      attemptType: 'misconception-followup',
      score: isCorrect ? 100 : 0,
      totalQuestions: 1,
      correctCount: isCorrect ? 1 : 0,
      submittedAnswer,
      serverCorrectAnswer: followUp.correctAnswer,
      isCorrect,
      submittedAt: new Date().toISOString()
    };
    store.addAttempt(attemptRecord);

    // Update topic stats based on actual submitted answer
    const updatedMastery = store.updateTopicMastery(followUp.topic || topic, {
      subject: 'Computer Science',
      attempts: 1,
      correct: isCorrect ? 1 : 0
    });

    const feedbackMessage = isCorrect
      ? "You answered this follow-up correctly. Concept verified."
      : "This concept may benefit from more practice.";

    return {
      success: true,
      attemptId: attemptRecord.id,
      isCorrect,
      submittedAnswer,
      submittedText,
      correctAnswer: followUp.correctAnswer,
      correctText,
      feedbackMessage,
      explanation: followUp.explanation,
      topic: followUp.topic || topic,
      updatedMastery
    };
  }
}
