import assert from 'assert';
import { AdaptiveEngine } from '../services/adaptiveEngine.js';
import { AIService } from '../services/aiService.js';
import { PDFService } from '../services/pdfService.js';
import { GroundingService } from '../services/groundingService.js';
import { MisconceptionCoach } from '../services/misconceptionCoach.js';
import { store } from '../data/store.js';

console.log('--- RUNNING EDUPILOT AI BACKEND UNIT TESTS ---');

let passedTests = 0;
let totalTests = 0;
const testQueue = [];

function test(name, fn) {
  testQueue.push({ name, fn });
}

// 1. Mastery threshold calculations
test('Mastery thresholds: <50% needs attention, 50-74% developing, >=75% strong', () => {
  assert.strictEqual(AdaptiveEngine.calculateMasteryLevel(45, 3), 'Needs attention');
  assert.strictEqual(AdaptiveEngine.calculateMasteryLevel(65, 3), 'Developing');
  assert.strictEqual(AdaptiveEngine.calculateMasteryLevel(85, 3), 'Strong');
  assert.strictEqual(AdaptiveEngine.calculateMasteryLevel(90, 1), 'Not enough data'); // < 2 attempts
});

// 2. Server-side Quiz Scoring
test('Quiz scoring accurately calculates score and topic breakdown', () => {
  const dummyQuiz = {
    subject: 'Algorithms',
    questions: [
      { id: 'q1', question: 'Q1', correctAnswer: 1, topic: 'Heaps' },
      { id: 'q2', question: 'Q2', correctAnswer: 0, topic: 'Heaps' },
      { id: 'q3', question: 'Q3', correctAnswer: 2, topic: 'Graphs' },
      { id: 'q4', question: 'Q4', correctAnswer: 3, topic: 'Graphs' }
    ]
  };

  const userAnswers = { q1: 1, q2: 0, q3: 2, q4: 1 }; // 3 correct out of 4 (75%)
  const result = AdaptiveEngine.scoreSubmission(dummyQuiz, userAnswers);

  assert.strictEqual(result.correctCount, 3);
  assert.strictEqual(result.totalQuestions, 4);
  assert.strictEqual(result.percentage, 75);
  assert.strictEqual(result.topicBreakdown['Heaps'].correct, 2);
  assert.strictEqual(result.topicBreakdown['Heaps'].total, 2);
  assert.strictEqual(result.topicBreakdown['Graphs'].correct, 1);
  assert.strictEqual(result.topicBreakdown['Graphs'].total, 2);
});

// 3. Adaptive Topic Ranking
test('Adaptive topic ranking prioritizes lowest accuracy & oldest decay first', () => {
  const topicMap = {
    'Tree Rotations': { accuracy: 90, attempts: 4, lastPracticed: new Date().toISOString() },
    'Dijkstra Shortest Path': { accuracy: 55, attempts: 2, lastPracticed: new Date(Date.now() - 86400000 * 3).toISOString() },
    'Memory Paging': { accuracy: 40, attempts: 3, lastPracticed: new Date(Date.now() - 86400000 * 5).toISOString() }
  };

  const ranked = AdaptiveEngine.rankWeakTopics(topicMap);
  assert.strictEqual(ranked.length, 3);
  assert.strictEqual(ranked[0].topicName, 'Memory Paging'); // Lowest accuracy + longest decay
  assert.strictEqual(ranked[2].topicName, 'Tree Rotations'); // High accuracy
});

// 4. Study Plan Time Constraint
test('Study plan time allocation never exceeds available daily study hours', () => {
  const weakTopics = [
    { topicName: 'Topic 1', subject: 'CS', accuracy: 40, priorityScore: 90 },
    { topicName: 'Topic 2', subject: 'CS', accuracy: 45, priorityScore: 85 },
    { topicName: 'Topic 3', subject: 'CS', accuracy: 50, priorityScore: 80 },
    { topicName: 'Topic 4', subject: 'CS', accuracy: 55, priorityScore: 75 },
    { topicName: 'Topic 5', subject: 'CS', accuracy: 60, priorityScore: 70 },
    { topicName: 'Topic 6', subject: 'CS', accuracy: 65, priorityScore: 65 }
  ];

  // Requesting 1.0 hour (60 minutes max)
  const plan = AdaptiveEngine.generateStudyPlan({ weakTopics, dailyStudyHours: 1.0 });
  assert(plan.totalAllocatedMinutes <= 60, `Allocated minutes (${plan.totalAllocatedMinutes}) exceeded 60`);
  assert(plan.tasks.length > 0, 'Should have scheduled at least 1 task');
});

// 5. Pre-revision vs Post-revision comparison
test('Pre vs Post revision accurately detects improvement without fabrication', () => {
  const attempts = [
    { topic: 'Dijkstra', score: 58, submittedAt: '2026-10-26T10:00:00.000Z' },
    { topic: 'Dijkstra', score: 85, submittedAt: '2026-10-27T10:00:00.000Z' }
  ];

  const comps = AdaptiveEngine.compareAttempts(attempts);
  assert.strictEqual(comps.length, 1);
  assert.strictEqual(comps[0].preScore, 58);
  assert.strictEqual(comps[0].postScore, 85);
  assert.strictEqual(comps[0].delta, 27);
  assert.strictEqual(comps[0].isImproved, true);
});

// 6. AI Question Structure Validation
test('AI quiz validator rejects malformed questions and accepts valid 4-option questions', () => {
  const invalidQuiz = {
    questions: [
      { question: 'Too short', options: ['A', 'B'], correctAnswer: 0 } // Only 2 options
    ]
  };
  assert.strictEqual(AIService.validateQuizStructure(invalidQuiz), false);

  const validQuiz = {
    questions: [
      {
        question: 'Why does standard Dijkstra fail on negative edge weights in a graph?',
        options: ['Invariant violation', 'Invalid heap', 'Matrix crash', 'Overflow'],
        correctAnswer: 0,
        explanation: 'Greedy choice property invariant is broken by negative weights.'
      }
    ]
  };
  assert.strictEqual(AIService.validateQuizStructure(validQuiz), true);
});

// 7. PDF Validation Logic
test('PDF validation rejects non-PDF files and files larger than 10MB', () => {
  assert.throws(() => {
    PDFService.validatePDF({ originalname: 'notes.docx', mimetype: 'application/msword', size: 1000 });
  }, /Invalid file format/);

  assert.throws(() => {
    PDFService.validatePDF({ originalname: 'huge.pdf', mimetype: 'application/pdf', size: 20 * 1024 * 1024 });
  }, /too large/);

  assert.doesNotThrow(() => {
    PDFService.validatePDF({ originalname: 'valid_notes.pdf', mimetype: 'application/pdf', size: 2 * 1024 * 1024 });
  });
});

// 8. Source-grounded Citation Verification
test('Source Grounding: Returns verified citation and authentic excerpt matching document page', async () => {
  const m1 = store.getMaterialById('mat-demo-1');
  assert(m1, 'mat-demo-1 should exist');

  const result = await AIService.tutorChat({
    query: 'Why does Dijkstra fail on negative edges?',
    material: m1
  });

  assert.strictEqual(result.isGrounded, true);
  assert.strictEqual(result.groundingType, 'source-grounded');
  assert.strictEqual(result.pageNumber, 3);
  assert.strictEqual(result.sourceCitation, 'CS204_Graph_Algorithms_and_Shortest_Paths.pdf — Page 3');
  assert(result.sourceExcerpt.includes('Failure Mode: If negative edge weights are present'), 'Excerpt must contain exact text from Page 3');
  assert(['ai-generated', 'demo-explanation'].includes(result.generationType), 'Must declare honest generation type');
});

// 9. Rejection of unverified citations on document mismatch
test('Source Grounding: Rejects false citations when topic is missing from document (insufficient evidence)', async () => {
  const m2 = store.getMaterialById('mat-demo-2'); // Database notes
  assert(m2, 'mat-demo-2 should exist');

  const result = await AIService.tutorChat({
    query: 'Why does Dijkstra fail on negative edges?',
    material: m2
  });

  assert.strictEqual(result.isGrounded, false);
  assert.strictEqual(result.groundingType, 'insufficient-evidence');
  assert.strictEqual(result.sourceCitation, null, 'Must NOT invent a citation for missing topic');
  assert.strictEqual(result.sourceExcerpt, null, 'Must NOT invent an excerpt for missing topic');
  assert.strictEqual(result.pageNumber, null);
  assert.strictEqual(result.canFallbackToGeneral, true);
});

// 10. Rejection of weak single-keyword match
test('Source Grounding: Rejects weak single-keyword match without relational concept evidence', () => {
  const mockDoc = {
    id: 'mock-1',
    fileName: 'Intro_CS.pdf',
    passages: [
      {
        id: 'p1',
        pageNumber: 1,
        pageReference: 'Page 1',
        text: 'Computer science introduces algorithmic complexity and graph representations for computational modeling.'
      }
    ]
  };

  const verification = GroundingService.verifyGrounding(
    mockDoc,
    'Explain why negative cycles cause infinite loop non-convergence in shortest path algorithms'
  );

  assert.strictEqual(verification.isGrounded, false);
  assert.strictEqual(verification.groundingType, 'insufficient-evidence');
  assert.strictEqual(verification.passage, null);
});

// 11. Strict document isolation (no passage leakage between documents)
test('Source Grounding: Strictly isolates documents with zero passage cross-contamination', () => {
  const docA = {
    id: 'docA',
    fileName: 'Trees.pdf',
    passages: [
      { id: 'pA', pageNumber: 2, pageReference: 'Page 2', text: 'B+ Tree leaf nodes form a sequential doubly-linked chain.' }
    ]
  };
  const docB = {
    id: 'docB',
    fileName: 'OS.pdf',
    passages: [
      { id: 'pB', pageNumber: 7, pageReference: 'Page 7', text: 'Virtual memory uses TLB associative caches for fast address translation.' }
    ]
  };

  const resA = GroundingService.retrievePassages(docA, 'Walk through virtual memory TLB misses');
  assert.strictEqual(resA.length, 0, 'Document A must never retrieve Document B passages');

  const resB = GroundingService.retrievePassages(docB, 'Walk through virtual memory TLB misses');
  assert.strictEqual(resB.length, 1);
  assert.strictEqual(resB[0].passage.pageNumber, 7);
});

// 12. General Knowledge response honesty (no fabricated citations)
test('General Knowledge: Returns unverified label and null citation when no document selected', async () => {
  const result = await AIService.tutorChat({
    query: 'Explain Dijkstra shortest path algorithm',
    material: null
  });

  assert.strictEqual(result.isGrounded, false);
  assert.strictEqual(result.groundingType, 'general-knowledge');
  assert.strictEqual(result.sourceCitation, null, 'Must NOT fabricate CLRS or textbook citations');
  assert.strictEqual(result.sourceExcerpt, null);
  assert(['ai-generated', 'demo-explanation'].includes(result.generationType));
  assert(result.answer.length > 50, 'Must provide informative explanation');
});

// 13. PDF page metadata integrity
test('PDF Metadata: Passages preserve authentic pageNumber integers and pageReferences', () => {
  const mockPages = [
    { pageNumber: 1, text: 'Page 1 text intro concepts.' },
    { pageNumber: 2, text: 'Page 2 text detailed invariants and proofs.' }
  ];
  const passages = GroundingService.getDocumentPassages({ id: 'doc-meta', pages: mockPages });

  assert.strictEqual(passages.length, 2);
  assert.strictEqual(passages[0].pageNumber, 1);
  assert.strictEqual(passages[0].pageReference, 'Page 1');
  assert.strictEqual(passages[1].pageNumber, 2);
  assert.strictEqual(passages[1].pageReference, 'Page 2');
});

// 14. False-positive prevention on generic/unsupported keywords
test('False-Positive Prevention: Queries sharing only generic or partial keywords are rejected', () => {
  const m1 = store.getMaterialById('mat-demo-1');
  assert(m1, 'mat-demo-1 should exist');

  // 'algorithm speed' shares the generic word 'algorithm', but lacks 'speed'
  const v1 = GroundingService.verifyGrounding(m1, 'algorithm speed');
  assert.strictEqual(v1.isGrounded, false, 'algorithm speed must not be grounded');
  assert.strictEqual(v1.groundingType, 'insufficient-evidence');

  // 'graph encryption' shares 'graph', but lacks 'encryption'
  const v2 = GroundingService.verifyGrounding(m1, 'graph encryption');
  assert.strictEqual(v2.isGrounded, false, 'graph encryption must not be grounded');
  assert.strictEqual(v2.groundingType, 'insufficient-evidence');
});

// 15. Real PDF extraction and multi-page citation grounding
test('Real PDF Extraction: Verifies genuine page numbers originate from PDFParse without fabrication', async () => {
  const pdfBody = [
    '%PDF-1.4\n',
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
    '2 0 obj << /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >> endobj\n',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 7 0 R >> >> >> endobj\n',
    '4 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 6 0 R /Resources << /Font << /F1 7 0 R >> >> >> endobj\n',
    '5 0 obj << /Length 77 >> stream\n',
    'BT /F1 12 Tf 50 700 Td (Lecture 1 on Distributed Consensus and Raft leader election invariants.) Tj ET\n',
    'endstream endobj\n',
    '6 0 obj << /Length 87 >> stream\n',
    'BT /F1 12 Tf 50 700 Td (Page 2: Practical Byzantine Fault Tolerance requires 3f plus 1 total replica nodes.) Tj ET\n',
    'endstream endobj\n',
    '7 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n'
  ].join('');

  const offsets = [
    '0000000000 65535 f \n',
    String(pdfBody.indexOf('1 0 obj')).padStart(10, '0') + ' 00000 n \n',
    String(pdfBody.indexOf('2 0 obj')).padStart(10, '0') + ' 00000 n \n',
    String(pdfBody.indexOf('3 0 obj')).padStart(10, '0') + ' 00000 n \n',
    String(pdfBody.indexOf('4 0 obj')).padStart(10, '0') + ' 00000 n \n',
    String(pdfBody.indexOf('5 0 obj')).padStart(10, '0') + ' 00000 n \n',
    String(pdfBody.indexOf('6 0 obj')).padStart(10, '0') + ' 00000 n \n',
    String(pdfBody.indexOf('7 0 obj')).padStart(10, '0') + ' 00000 n \n'
  ];
  const startxref = pdfBody.length;
  const fullPdf = pdfBody + 'xref\n0 8\n' + offsets.join('') + 'trailer << /Size 8 /Root 1 0 R >>\nstartxref\n' + startxref + '\n%%EOF\n';

  const extraction = await PDFService.extractText(Buffer.from(fullPdf, 'binary'));
  assert.strictEqual(extraction.pageCount, 2);
  assert.strictEqual(extraction.pages.length, 2);
  assert.strictEqual(extraction.pages[0].pageNumber, 1);
  assert.strictEqual(extraction.pages[1].pageNumber, 2);

  const realDoc = {
    id: 'mat-real-pdf-test',
    fileName: 'Distributed_Consensus.pdf',
    pages: extraction.pages,
    passages: extraction.passages
  };

  // Test concept on Page 2
  const resPage2 = await AIService.tutorChat({
    query: 'How many replicas are required for Byzantine fault tolerance?',
    material: realDoc
  });
  assert.strictEqual(resPage2.isGrounded, true);
  assert.strictEqual(resPage2.pageNumber, 2);
  assert.strictEqual(resPage2.sourceCitation, 'Distributed_Consensus.pdf — Page 2');
  assert(resPage2.sourceExcerpt.includes('3f plus 1 total replica nodes'));

  // Test unrelated question on real doc
  const resUnrelated = await AIService.tutorChat({
    query: 'What is photosynthesis in plant cells?',
    material: realDoc
  });
  assert.strictEqual(resUnrelated.isGrounded, false);
  assert.strictEqual(resUnrelated.groundingType, 'insufficient-evidence');
  assert.strictEqual(resUnrelated.sourceCitation, null);
});

// 16. Provider failure and malformed response resilience
test('Provider Resilience: Malformed AI output or provider failure safely falls back to demo-explanation', async () => {
  // Test quiz validator rejects malformed structure
  const malformedOutput = {
    questions: [
      { question: 'What is a heap?', options: ['A'], correctAnswer: 0 } // missing 3 options
    ]
  };
  assert.strictEqual(AIService.validateQuizStructure(malformedOutput), false);

  // Test empty question object
  assert.strictEqual(AIService.validateQuizStructure({}), false);
  assert.strictEqual(AIService.validateQuizStructure(null), false);

  // Test tutor chat when provider is unavailable
  const tutorRes = await AIService.tutorChat({
    query: 'Explain Dijkstra shortest path',
    material: null
  });
  assert.strictEqual(tutorRes.generationType, 'demo-explanation');
  assert.strictEqual(tutorRes.groundingType, 'general-knowledge');
});

// 17. Misconception Coach: Hypothesis framing and diagnosis
test('Misconception Coach: Diagnoses student error and frames pedagogical hypothesis', async () => {
  const question = {
    id: 'q-dijkstra-1',
    question: "Why does Dijkstra's algorithm fail to find the shortest path in graphs with negative edge weights?",
    options: [
      "Because Dijkstra assumes once a vertex is extracted from the priority queue, its distance is finalized.",
      "Because negative weights always create a directed cycle that traps the algorithm in an infinite loop.",
      "Because a Min-Heap data structure cannot store negative values.",
      "Because Dijkstra's time complexity increases to O(V!) on negative edges."
    ],
    correctAnswer: 0,
    topic: "Dijkstra Algorithm Invariants"
  };

  const diagnosis = await MisconceptionCoach.diagnose({
    question,
    selectedOptionIndex: 1
  });

  assert.strictEqual(diagnosis.success, true);
  assert.strictEqual(diagnosis.questionId, 'q-dijkstra-1');
  assert.strictEqual(diagnosis.correctOptionIndex, 0);
  assert.strictEqual(diagnosis.selectedOptionIndex, 1);
  assert(diagnosis.whyIncorrect.length > 10, 'whyIncorrect explanation should be provided');
  assert(diagnosis.whyCorrect.length > 10, 'whyCorrect explanation should be provided');
  // Hypothesis must be framed as a hypothesis, not absolute fact
  assert(
    diagnosis.misconceptionHypothesis.toLowerCase().includes('misunderstanding') ||
    diagnosis.misconceptionHypothesis.toLowerCase().includes('suggests') ||
    diagnosis.misconceptionHypothesis.toLowerCase().includes('assuming') ||
    diagnosis.misconceptionHypothesis.toLowerCase().includes('confusion'),
    'Hypothesis must use pedagogical framing'
  );
  // Must provide follow-up question
  assert(diagnosis.followUpQuestion, 'Follow-up question must be provided');
  assert.strictEqual(diagnosis.followUpQuestion.options.length, 4);
  assert(typeof diagnosis.followUpQuestion.correctAnswer === 'number');
});

// 18. Misconception Coach: Follow-up server-side evaluation & persistence
test('Misconception Coach: Server-side follow-up evaluation, persistence, and attempt recording', () => {
  const followUpQuestion = {
    id: `fu-test-${Date.now()}`,
    question: "Which condition causes Dijkstra to output an incorrect shortest distance?",
    options: [
      "A negative edge that provides a cheaper path to an already settled vertex.",
      "A tree with depth greater than 10 levels.",
      "A directed acyclic graph.",
      "A vertex with degree 0."
    ],
    correctAnswer: 0,
    explanation: "Settled vertices are not re-opened in standard Dijkstra.",
    topic: "Dijkstra Greedy Invariant"
  };

  // Register in store
  store.registerFollowUpQuestion(followUpQuestion);

  // Evaluate correct answer
  const correctEval = MisconceptionCoach.evaluateFollowUp({
    followUpQuestionId: followUpQuestion.id,
    submittedAnswer: 0,
    originalQuestionId: 'q-dijkstra-1',
    topic: 'Dijkstra Greedy Invariant'
  });

  assert.strictEqual(correctEval.success, true);
  assert.strictEqual(correctEval.isCorrect, true);
  assert.strictEqual(correctEval.feedbackMessage, "You answered this follow-up correctly. Concept verified.");

  // Verify persistence in attempts list
  const attempts = store.getAttempts();
  const foundAttempt = attempts.find(a => a.id === correctEval.attemptId);
  assert(foundAttempt, 'Attempt should be persisted in store');
  assert.strictEqual(foundAttempt.attemptType, 'misconception-followup');
  assert.strictEqual(foundAttempt.score, 100);

  // Evaluate incorrect answer
  const incorrectEval = MisconceptionCoach.evaluateFollowUp({
    followUpQuestionId: followUpQuestion.id,
    submittedAnswer: 1,
    originalQuestionId: 'q-dijkstra-1',
    topic: 'Dijkstra Greedy Invariant'
  });

  assert.strictEqual(incorrectEval.success, true);
  assert.strictEqual(incorrectEval.isCorrect, false);
  assert.strictEqual(incorrectEval.feedbackMessage, "This concept may benefit from more practice.");
});

// 19. Misconception Coach: Grounded document retrieval vs General Knowledge
test('Misconception Coach: Grounded document retrieval when material is linked', async () => {
  const doc = {
    id: 'mat-coach-doc',
    fileName: 'Graph_Algorithms.pdf',
    pages: [
      {
        pageNumber: 1,
        text: "Dijkstra's algorithm computes single-source shortest paths on graphs with non-negative edge weights using a greedy min-heap priority queue."
      }
    ],
    passages: [
      {
        text: "Dijkstra's algorithm computes single-source shortest paths on graphs with non-negative edge weights using a greedy min-heap priority queue.",
        pageNumber: 1
      }
    ]
  };
  store.addMaterial(doc);

  const question = {
    id: 'q-grounded-coach',
    question: "Why does Dijkstra require non-negative edge weights?",
    options: ["Greedy min-heap invariant", "Network latency", "CPU limits", "Disk capacity"],
    correctAnswer: 0,
    topic: "Dijkstra algorithm"
  };

  const diagnosis = await MisconceptionCoach.diagnose({
    question,
    selectedOptionIndex: 1,
    materialId: 'mat-coach-doc'
  });

  assert.strictEqual(diagnosis.isGrounded, true);
  assert.strictEqual(diagnosis.pageNumber, 1);
  assert(diagnosis.sourceExcerpt.includes('non-negative edge weights'));
  assert.strictEqual(diagnosis.sourceCitation, 'Graph_Algorithms.pdf — Page 1');
});

// 20. End-to-End Adaptive Loop: Diagnosis -> Follow-up -> Topic Performance Update
test('Adaptive Loop: Diagnosis, Follow-up Submission, and Topic Performance Update', async () => {
  const initialTopicMap = store.getTopicMastery();
  const prevAttempts = initialTopicMap['Adaptive Graph Testing']?.attempts || 0;

  const followUpQuestion = {
    id: `fu-loop-${Date.now()}`,
    question: "Test question for loop verification?",
    options: ["Correct", "Wrong 1", "Wrong 2", "Wrong 3"],
    correctAnswer: 0,
    explanation: "Correct explanation",
    topic: "Adaptive Graph Testing"
  };
  store.registerFollowUpQuestion(followUpQuestion);

  const evalResult = MisconceptionCoach.evaluateFollowUp({
    followUpQuestionId: followUpQuestion.id,
    submittedAnswer: 0,
    topic: "Adaptive Graph Testing"
  });

  assert.strictEqual(evalResult.isCorrect, true);

  const updatedTopicMap = store.getTopicMastery();
  const newAttempts = updatedTopicMap['Adaptive Graph Testing']?.attempts || 0;
  assert.strictEqual(newAttempts, prevAttempts + 1, 'Attempts counter should increment by 1');
  assert.strictEqual(updatedTopicMap['Adaptive Graph Testing']?.accuracy, 100);
});

// Run all queued synchronous and asynchronous tests
async function runAll() {
  for (const t of testQueue) {
    totalTests++;
    try {
      await t.fn();
      console.log(`[PASS] ${t.name}`);
      passedTests++;
    } catch (err) {
      console.error(`[FAIL] ${t.name}:`, err.message);
    }
  }

  console.log(`\nResults: ${passedTests} / ${totalTests} tests passed.`);
  if (passedTests === totalTests) {
    console.log('ALL CORE TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('SOME TESTS FAILED.');
    process.exit(1);
  }
}

runAll();
