import assert from 'assert';
import { AIService } from '../services/aiService.js';
import { store } from '../data/store.js';

async function testTutorFollowUps() {
  console.log('=== TEST: TUTOR SEQUENTIAL QUESTIONS, FOLLOW-UPS & HISTORY ===\n');

  // 1. Sequential distinct questions receive distinct answers
  const qDijkstra = await AIService.tutorChat({
    query: "Why does Dijkstra's algorithm fail on negative edge weights?"
  });
  assert.ok(qDijkstra.answer.includes("Dijkstra's Algorithm"), 'Q1 must explain Dijkstra');
  assert.strictEqual(qDijkstra.groundingType, 'general-knowledge');

  const qBTree = await AIService.tutorChat({
    query: "Why do databases use B+ Trees instead of Binary Search Trees?"
  });
  assert.ok(qBTree.answer.includes("B+ Tree"), 'Q2 must explain B+ Tree');
  assert.notStrictEqual(qDijkstra.answer, qBTree.answer, 'Q1 and Q2 answers must be completely distinct');

  console.log('[PASS] 1. Distinct sequential questions receive distinct topic answers');

  // 2. Follow-up query contextualization using conversation history
  const history = [
    { sender: 'user', text: "Explain Dijkstra's shortest path algorithm" },
    { sender: 'ai', text: "Dijkstra is a greedy single-source shortest path algorithm..." }
  ];

  const qFollowUp = await AIService.tutorChat({
    query: "What is its time complexity?",
    history
  });
  assert.ok(qFollowUp.answer.includes("Dijkstra") || qFollowUp.answer.includes("Min-Heap"), 'Follow-up must resolve topic from history');
  assert.ok(qFollowUp.answer.includes("Time Complexity"), 'Follow-up must explain time complexity');

  console.log('[PASS] 2. Conversational follow-up resolves context from conversation history');

  // 3. Newly added knowledge areas
  const qDeadlock = await AIService.tutorChat({
    query: "What are the four Coffman conditions for deadlock?"
  });
  assert.ok(qDeadlock.answer.includes("Coffman"), 'Deadlock query must explain Coffman conditions');
  assert.ok(qDeadlock.answer.includes("Mutual Exclusion"), 'Must mention Mutual Exclusion');

  const qTrees = await AIService.tutorChat({
    query: "What is the difference between AVL and Red-Black trees?"
  });
  assert.ok(qTrees.answer.includes("AVL Trees"), 'Trees query must explain AVL');
  assert.ok(qTrees.answer.includes("Red-Black"), 'Trees query must explain Red-Black');

  console.log('[PASS] 3. Expanded CS knowledge domains (Deadlocks, Balancing Trees) verified');

  // 4. Live HTTP verification over port 5000
  const httpRes = await fetch('http://localhost:5000/api/tutor/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: "What is its time complexity?",
      history: [
        { sender: 'user', text: "Can you explain Dijkstra's algorithm?" },
        { sender: 'ai', text: "Dijkstra's algorithm is a greedy shortest path algorithm..." }
      ]
    })
  });
  assert.strictEqual(httpRes.status, 200);
  const httpData = await httpRes.json();
  assert.ok(httpData.answer.includes("Time Complexity"));

  console.log('[PASS] 4. Live HTTP endpoint correctly processes conversational follow-up history');

  console.log('\nALL TUTOR FOLLOW-UP & HISTORY TESTS PASSED!\n');
}

testTutorFollowUps().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
