import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, 'db.json');

// Initial seed data for guaranteed hackathon demo
const initialSeedData = {
  materials: [
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
        "A* Search & Admissible Heuristics",
        "Topological Sort Shortest Path in DAGs"
      ],
      summary: "Comprehensive lecture slides covering single-source shortest path algorithms, min-heap implementations, negative edge cycle detection, and DAG linear time relaxation.",
      pages: [
        {
          pageNumber: 1,
          pageReference: "Page 1",
          text: "Lecture 8: Graph Traversal & Shortest Path Algorithms. Dijkstra's Algorithm solves the single-source shortest path problem on weighted directed or undirected graphs where all edge weights are non-negative."
        },
        {
          pageNumber: 2,
          pageReference: "Page 2",
          text: "Invariant: When a vertex u is settled and removed from the Priority Queue, dist[u] is guaranteed to be minimal. Greedy Settlement: Once relaxed into the settled set, dist[u] will never decrease."
        },
        {
          pageNumber: 3,
          pageReference: "Page 3",
          text: "Failure Mode: If negative edge weights are present, earlier greedy settlements can be violated by delayed negative paths. Negative Cycles: Cycles with negative sum cause distances to decrease continuously without convergence."
        },
        {
          pageNumber: 4,
          pageReference: "Page 4",
          text: "Alternative: Use Bellman-Ford algorithm in O(V * E) time to detect negative weight cycles. Optimization: In Directed Acyclic Graphs (DAGs), relaxing vertices in topological order achieves single-source shortest path in O(V + E) linear time."
        }
      ],
      passages: [
        {
          id: "pas-mat1-p1-1",
          pageNumber: 1,
          pageReference: "Page 1",
          text: "Lecture 8: Graph Traversal & Shortest Path Algorithms. Dijkstra's Algorithm solves the single-source shortest path problem on weighted directed or undirected graphs where all edge weights are non-negative."
        },
        {
          id: "pas-mat1-p2-1",
          pageNumber: 2,
          pageReference: "Page 2",
          text: "Invariant: When a vertex u is settled and removed from the Priority Queue, dist[u] is guaranteed to be minimal. Greedy Settlement: Once relaxed into the settled set, dist[u] will never decrease."
        },
        {
          id: "pas-mat1-p3-1",
          pageNumber: 3,
          pageReference: "Page 3",
          text: "Failure Mode: If negative edge weights are present, earlier greedy settlements can be violated by delayed negative paths. Negative Cycles: Cycles with negative sum cause distances to decrease continuously without convergence."
        },
        {
          id: "pas-mat1-p4-1",
          pageNumber: 4,
          pageReference: "Page 4",
          text: "Alternative: Use Bellman-Ford algorithm in O(V * E) time to detect negative weight cycles. Optimization: In Directed Acyclic Graphs (DAGs), relaxing vertices in topological order achieves single-source shortest path in O(V + E) linear time."
        }
      ],
      sampleExtractedText: `Lecture 8: Graph Traversal & Shortest Path Algorithms.
Dijkstra's Algorithm solves the single-source shortest path problem on weighted directed or undirected graphs where all edge weights are non-negative.
Invariant: When a vertex u is settled and removed from the Priority Queue, dist[u] is guaranteed to be minimal.
Failure Mode: If negative edge weights are present, earlier greedy settlements can be violated by delayed negative paths.
Alternative: Use Bellman-Ford algorithm in O(V * E) time to detect negative weight cycles.
Optimization: In Directed Acyclic Graphs (DAGs), relaxing vertices in topological order achieves single-source shortest path in O(V + E) linear time.`
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
        "ACID Isolation Levels & MVCC",
        "Two-Phase Locking (2PL)"
      ],
      summary: "Database storage engine architecture notes covering high fan-out B+ Tree indexing, disk page retrieval, leaf node linked list traversal, and concurrency control.",
      pages: [
        {
          pageNumber: 1,
          pageReference: "Page 1",
          text: "Lecture 12: Database Storage Architecture & Indices. Why B+ Trees? Modern storage devices transfer data in fixed disk blocks (typically 4KB to 16KB)."
        },
        {
          pageNumber: 2,
          pageReference: "Page 2",
          text: "Disk Block Alignment & High Fan-Out: A high fan-out node fits hundreds of keys into one disk page, limiting tree depth to 3-4 levels for millions of records."
        },
        {
          pageNumber: 3,
          pageReference: "Page 3",
          text: "Range Scans & Leaf Doubly Linked Lists: Leaf nodes are linked in a bidirectional list, allowing O(1) sequential range query scans once the starting boundary key is located."
        },
        {
          pageNumber: 4,
          pageReference: "Page 4",
          text: "Concurrency Control & 2PL: Two-Phase Locking ensures serializability (ACID Isolation) across concurrent transaction read/write sets."
        }
      ],
      passages: [
        {
          id: "pas-mat2-p1-1",
          pageNumber: 1,
          pageReference: "Page 1",
          text: "Lecture 12: Database Storage Architecture & Indices. Why B+ Trees? Modern storage devices transfer data in fixed disk blocks (typically 4KB to 16KB)."
        },
        {
          id: "pas-mat2-p2-1",
          pageNumber: 2,
          pageReference: "Page 2",
          text: "Disk Block Alignment & High Fan-Out: A high fan-out node fits hundreds of keys into one disk page, limiting tree depth to 3-4 levels for millions of records."
        },
        {
          id: "pas-mat2-p3-1",
          pageNumber: 3,
          pageReference: "Page 3",
          text: "Range Scans & Leaf Doubly Linked Lists: Leaf nodes are linked in a bidirectional list, allowing O(1) sequential range query scans once the starting boundary key is located."
        },
        {
          id: "pas-mat2-p4-1",
          pageNumber: 4,
          pageReference: "Page 4",
          text: "Concurrency Control & 2PL: Two-Phase Locking ensures serializability (ACID Isolation) across concurrent transaction read/write sets."
        }
      ],
      sampleExtractedText: `Lecture 12: Database Storage Architecture & Indices.
Why B+ Trees? Modern storage devices transfer data in fixed disk blocks (typically 4KB to 16KB).
A high fan-out node fits hundreds of keys into one disk page, limiting tree depth to 3-4 levels for millions of records.
Leaf nodes are linked in a bidirectional list, allowing O(1) sequential range query scans once the starting boundary key is located.`
    }
  ],
  quizzes: [
    {
      id: "quiz-dijkstra",
      materialId: "mat-demo-1",
      title: "Dijkstra & Graph Shortest Paths (AI Revision)",
      subject: "Algorithms",
      difficulty: "Medium",
      duration: "10 mins",
      isTargetedRevision: true,
      weakTopicTarget: "Graph Traversal & Shortest Path (Dijkstra's Algorithm)",
      questions: [
        {
          id: "q1",
          question: "Why does standard Dijkstra's algorithm fail when a graph contains negative-weight edge cycles?",
          options: [
            "It causes distances to continuously decrease without convergence, violating greedy settlement invariants.",
            "The priority queue becomes corrupted with negative keys.",
            "It visits vertices in random topological order instead of by distance.",
            "It requires adjacency matrices and cannot support negative weights."
          ],
          correctAnswer: 0,
          explanation: "Dijkstra's greedy choice assumes that once a node is extracted from the Priority Queue, no shorter path to it will ever be discovered. Negative cycles violate this optimal substructure invariant.",
          topic: "Dijkstra Negative Edges",
          pageReference: "Page 4"
        },
        {
          id: "q2",
          question: "What is the optimal time complexity of Dijkstra's algorithm implemented with a Min-Heap (Binary Heap) for a graph with V vertices and E edges?",
          options: [
            "O(V^2)",
            "O((V + E) log V)",
            "O(V * E)",
            "O(E log E + V)"
          ],
          correctAnswer: 1,
          explanation: "Each vertex is extracted from the min-heap once (O(V log V)) and each edge relaxation can trigger a decrease-key operation in the heap (O(E log V)), yielding total time complexity O((V + E) log V).",
          topic: "Heap Complexity",
          pageReference: "Page 6"
        },
        {
          id: "q3",
          question: "Which algorithm should be preferred over Dijkstra if the graph is a Directed Acyclic Graph (DAG) with possible negative edge weights?",
          options: [
            "Bellman-Ford in O(V * E)",
            "Topological Sort Shortest Path in O(V + E)",
            "Floyd-Warshall in O(V^3)",
            "Prim's Minimum Spanning Tree"
          ],
          correctAnswer: 1,
          explanation: "In a DAG, vertices can be topologically sorted in O(V + E) time, and relaxing edges in topological order computes single-source shortest paths in linear O(V + E) time, even with negative weights.",
          topic: "DAG Shortest Path",
          pageReference: "Page 9"
        },
        {
          id: "q4",
          question: "In Dijkstra's algorithm, what does relaxing an edge (u, v) with weight w actually mean?",
          options: [
            "Checking if dist[u] + w < dist[v], and if so, updating dist[v] = dist[u] + w.",
            "Deleting the edge (u, v) if dist[v] is already shorter.",
            "Swapping vertices u and v in the priority queue.",
            "Normalizing weights by subtracting the minimum edge weight."
          ],
          correctAnswer: 0,
          explanation: "Edge relaxation evaluates whether routing through vertex u provides a shorter path to vertex v than previously known, updating dist[v] and the priority queue accordingly.",
          topic: "Edge Relaxation",
          pageReference: "Page 3"
        },
        {
          id: "q5",
          question: "How does the A* Search algorithm optimize standard Dijkstra's algorithm for finding the shortest path to a single target destination?",
          options: [
            "It uses Fibonacci heaps instead of binary heaps.",
            "It adds an admissible heuristic h(n) estimating the distance from node n to the target.",
            "It converts the graph into a spanning tree before searching.",
            "It avoids edge relaxation completely."
          ],
          correctAnswer: 1,
          explanation: "A* uses the evaluation function f(n) = g(n) + h(n), where g(n) is the cost from start to n and h(n) is an admissible heuristic directing the search frontier towards the goal.",
          topic: "A* Heuristic",
          pageReference: "Page 12"
        }
      ]
    }
  ],
  attempts: [
    {
      id: "att-initial-1",
      quizId: "quiz-dijkstra",
      subject: "Algorithms",
      topic: "Graph Traversal & Shortest Path (Dijkstra's Algorithm)",
      attemptType: "pre-revision",
      score: 58,
      totalQuestions: 5,
      correctCount: 2.9,
      timeSpentSeconds: 420,
      submittedAt: "2026-10-26T16:00:00.000Z",
      answers: { q1: 1, q2: 1, q3: 0, q4: 0, q5: 2 }
    }
  ],
  topicMastery: {
    "Data Structures": {
      subject: "Data Structures",
      code: "CS-201",
      attempts: 8,
      correct: 7,
      accuracy: 85,
      masteryLevel: "Strong", // Strong (>=75%), Developing (50-74%), Needs Attention (<50%)
      status: "Advanced",
      lastPracticed: "2026-10-27T06:00:00.000Z"
    },
    "Algorithms": {
      subject: "Algorithms",
      code: "CS-204",
      attempts: 6,
      correct: 4,
      accuracy: 68,
      masteryLevel: "Developing",
      status: "Intermediate",
      lastPracticed: "2026-10-26T16:00:00.000Z"
    },
    "Database Systems": {
      subject: "Database Systems",
      code: "CS-305",
      attempts: 9,
      correct: 8,
      accuracy: 92,
      masteryLevel: "Strong",
      status: "Mastered",
      lastPracticed: "2026-10-25T11:00:00.000Z"
    },
    "Operating Systems": {
      subject: "Operating Systems",
      code: "CS-301",
      attempts: 5,
      correct: 3,
      accuracy: 60,
      masteryLevel: "Developing",
      status: "Needs Review",
      lastPracticed: "2026-10-24T18:00:00.000Z"
    },
    "Graph Traversal & Shortest Path (Dijkstra's Algorithm)": {
      subject: "Algorithms",
      code: "CS-204",
      attempts: 1,
      correct: 1,
      accuracy: 58,
      masteryLevel: "Developing",
      status: "Weak Topic",
      lastPracticed: "2026-10-26T16:00:00.000Z"
    }
  },
  studyTasks: [
    {
      id: "task-1",
      title: "Review B+ Tree Indexing & Range Queries",
      subject: "Database Systems",
      time: "4:00 PM Today",
      priority: "High",
      duration: "35 mins",
      completed: false,
      reason: "Scheduled before weekly DBMS assessment."
    },
    {
      id: "task-2",
      title: "Complete Dijkstra Shortest Path Practice Quiz",
      subject: "Algorithms",
      time: "5:30 PM Today",
      priority: "High",
      duration: "20 mins",
      completed: false,
      reason: "AI Recommended: Resolve 58% retention dip on negative cycles."
    },
    {
      id: "task-3",
      title: "Code AVL Tree Double Rotations in C++",
      subject: "Data Structures",
      time: "7:15 PM Today",
      priority: "Medium",
      duration: "45 mins",
      completed: true,
      reason: "Hands-on coding reinforcement."
    },
    {
      id: "task-4",
      title: "OS Virtual Memory & Page Replacement (LRU vs Clock)",
      subject: "Operating Systems",
      time: "10:00 AM Tomorrow",
      priority: "High",
      duration: "40 mins",
      completed: false,
      reason: "Spaced repetition reminder: Day 4 curve."
    }
  ],
  tutorHistory: []
};

class DataStore {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        const loaded = JSON.parse(fileContent);
        // Ensure seed materials have pages & passages if missing
        if (Array.isArray(loaded.materials)) {
          for (const m of loaded.materials) {
            const seed = initialSeedData.materials.find((s) => s.id === m.id);
            if (seed && (!m.pages || !m.passages)) {
              m.pages = seed.pages;
              m.passages = seed.passages;
            }
          }
        }
        return loaded;
      }
    } catch (err) {
      console.warn('[DataStore] Warning: Could not read db.json, initializing with seed data.', err.message);
    }
    this.saveData(initialSeedData);
    return JSON.parse(JSON.stringify(initialSeedData));
  }

  saveData(dataToSave = this.data) {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DataStore] Error persisting db.json:', err.message);
    }
  }

  // Materials
  getMaterials() {
    return this.data.materials || [];
  }

  getMaterialById(id) {
    return (this.data.materials || []).find((m) => m.id === id);
  }

  addMaterial(material) {
    if (!this.data.materials) this.data.materials = [];
    this.data.materials.unshift(material);
    this.saveData();
    return material;
  }

  // Quizzes
  getQuizzes() {
    return this.data.quizzes || [];
  }

  getQuizById(id) {
    return (this.data.quizzes || []).find((q) => q.id === id);
  }

  addQuiz(quiz) {
    if (!this.data.quizzes) this.data.quizzes = [];
    this.data.quizzes.unshift(quiz);
    this.saveData();
    return quiz;
  }

  // Attempts
  getAttempts() {
    return this.data.attempts || [];
  }

  addAttempt(attempt) {
    if (!this.data.attempts) this.data.attempts = [];
    this.data.attempts.unshift(attempt);
    this.saveData();
    return attempt;
  }

  // Topic Mastery
  getTopicMastery() {
    return this.data.topicMastery || {};
  }

  updateTopicMastery(topicName, stats) {
    if (!this.data.topicMastery) this.data.topicMastery = {};
    const existing = this.data.topicMastery[topicName] || {
      subject: stats.subject || "Computer Science",
      code: stats.code || "CS",
      attempts: 0,
      correct: 0,
      accuracy: 0,
      masteryLevel: "Not enough data"
    };

    const newAttempts = (existing.attempts || 0) + (stats.attempts || 1);
    const newCorrect = (existing.correct || 0) + (stats.correct || 0);
    const accuracy = Math.round((newCorrect / newAttempts) * 100);

    let masteryLevel = "Not enough data";
    if (newAttempts >= 2) {
      if (accuracy >= 75) masteryLevel = "Strong";
      else if (accuracy >= 50) masteryLevel = "Developing";
      else masteryLevel = "Needs attention";
    }

    this.data.topicMastery[topicName] = {
      ...existing,
      ...stats,
      attempts: newAttempts,
      correct: newCorrect,
      accuracy,
      masteryLevel,
      lastPracticed: new Date().toISOString()
    };

    this.saveData();
    return this.data.topicMastery[topicName];
  }

  // Study tasks
  getStudyTasks() {
    return this.data.studyTasks || [];
  }

  setStudyTasks(tasks) {
    this.data.studyTasks = tasks;
    this.saveData();
    return this.data.studyTasks;
  }

  updateStudyTask(taskId, updates) {
    if (!this.data.studyTasks) this.data.studyTasks = [];
    this.data.studyTasks = this.data.studyTasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, ...updates };
      }
      return t;
    });
    this.saveData();
    return this.data.studyTasks.find((t) => t.id === taskId);
  }

  // Follow-up questions (Misconception Coach)
  registerFollowUpQuestion(question) {
    if (!this.data.followUpQuestions) this.data.followUpQuestions = {};
    this.data.followUpQuestions[question.id] = question;
    this.saveData();
    return question;
  }

  getFollowUpQuestion(id) {
    if (!this.data.followUpQuestions) return null;
    return this.data.followUpQuestions[id] || null;
  }
}

export const store = new DataStore();
