export const currentUser = {
  name: "Alex Rivera",
  email: "alex.rivera@tech.edu",
  university: "Stanford University",
  major: "Computer Science & Engineering",
  academicYear: "Junior (Year 3)",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  streakDays: 14,
  level: "Level 8 CS Scholar",
  xp: 4820,
  xpToNextLevel: 5000,
  targetExam: "Fall 2026 CS Finals & ACM ICPC Regional",
  studyGoalHours: 3.5
};

export const kpiMetrics = [
  {
    id: "streak",
    title: "Learning Streak",
    value: "14 Days",
    subtext: "+2 days vs last week",
    trend: "up",
    iconName: "Flame",
    color: "from-amber-500 to-orange-500",
    badge: "Top 5% Learner",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    id: "hours",
    title: "Study Hours",
    value: "38.5 hrs",
    subtext: "+4.2 hrs this week",
    trend: "up",
    iconName: "Clock",
    color: "from-indigo-500 to-blue-600",
    badge: "88% Weekly Target",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
  },
  {
    id: "quiz-score",
    title: "Average Quiz Score",
    value: "88.4%",
    subtext: "+5.1% improvement",
    trend: "up",
    iconName: "Trophy",
    color: "from-emerald-500 to-teal-600",
    badge: "18 Quizzes Taken",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    id: "mastery",
    title: "Topics Mastered",
    value: "24 / 32",
    subtext: "75% curriculum completed",
    trend: "up",
    iconName: "CheckCircle2",
    color: "from-violet-500 to-purple-600",
    badge: "8 In Progress",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200"
  }
];

export const weeklyActivityData = [
  { day: "Mon", hours: 4.5, quizzes: 3, target: 3.5, accuracy: 84 },
  { day: "Tue", hours: 5.2, quizzes: 4, target: 3.5, accuracy: 91 },
  { day: "Wed", hours: 3.8, quizzes: 2, target: 3.5, accuracy: 82 },
  { day: "Thu", hours: 6.0, quizzes: 5, target: 3.5, accuracy: 94 },
  { day: "Fri", hours: 4.2, quizzes: 3, target: 3.5, accuracy: 88 },
  { day: "Sat", hours: 7.5, quizzes: 6, target: 4.0, accuracy: 92 },
  { day: "Sun", hours: 5.0, quizzes: 4, target: 4.0, accuracy: 89 }
];

export const topicMasteryData = [
  {
    id: "ds",
    subject: "Data Structures",
    code: "CS-201",
    progress: 85,
    level: "Advanced",
    completedConcepts: 34,
    totalConcepts: 40,
    statusColor: "bg-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    weakAreas: ["Red-Black Tree Rotations", "Trie Prefix Compression"],
    strongAreas: ["Binary Search Trees", "Hash Tables", "Heaps"],
    lastActivity: "Today, 11:30 AM"
  },
  {
    id: "algo",
    subject: "Algorithms",
    code: "CS-204",
    progress: 68,
    level: "Intermediate",
    completedConcepts: 27,
    totalConcepts: 40,
    statusColor: "bg-indigo-500",
    badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200",
    weakAreas: ["Dijkstra Negative Edges", "Bellman-Ford", "DP Bitmasking"],
    strongAreas: ["Divide & Conquer", "Greedy Scheduling", "Binary Search"],
    lastActivity: "Yesterday, 4:15 PM"
  },
  {
    id: "db",
    subject: "Database Systems",
    code: "CS-305",
    progress: 92,
    level: "Mastered",
    completedConcepts: 37,
    totalConcepts: 40,
    statusColor: "bg-blue-600",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    weakAreas: ["Distributed 2PC Consensus"],
    strongAreas: ["B+ Tree Indexing", "ACID & MVCC", "3NF / BCNF Normalization"],
    lastActivity: "2 days ago"
  },
  {
    id: "os",
    subject: "Operating Systems",
    code: "CS-301",
    progress: 60,
    level: "Needs Review",
    completedConcepts: 24,
    totalConcepts: 40,
    statusColor: "bg-amber-500",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    weakAreas: ["Virtual Memory Inverted Tables", "Semaphores Deadlock Avoidance"],
    strongAreas: ["Process Scheduling (CFS)", "System Calls", "Thread Context Switching"],
    lastActivity: "3 days ago"
  }
];

export const aiRecommendation = {
  topic: "Graph Traversal & Shortest Path (Dijkstra's Algorithm)",
  subject: "Algorithms (CS-204)",
  retentionRate: 58,
  estimatedTime: "22 mins",
  questionsCount: 5,
  impact: "+6% overall Algorithms mastery",
  reason: "EduPilot AI detected a 58% retention dip on negative edge weights & priority queue implementations from your recent quiz errors.",
  actionLabel: "Start Targeted Revision",
  keyInsight: "Dijkstra assumes non-negative edge weights because greedy selection can fail if negative cycles or edges allow shorter delayed paths.",
  quizId: "quiz-dijkstra"
};

export const initialStudyTasks = [
  {
    id: "task-1",
    title: "Review B+ Tree Indexing & Range Queries",
    subject: "Database Systems",
    time: "4:00 PM Today",
    priority: "High",
    priorityColor: "text-rose-600 bg-rose-50 border-rose-200",
    duration: "35 mins",
    completed: false,
    reason: "Scheduled before weekly DBMS lab assessment."
  },
  {
    id: "task-2",
    title: "Complete Dijkstra Shortest Path Practice Quiz",
    subject: "Algorithms",
    time: "5:30 PM Today",
    priority: "High",
    priorityColor: "text-rose-600 bg-rose-50 border-rose-200",
    duration: "20 mins",
    completed: false,
    reason: "AI Recommended: Boost 58% retention score."
  },
  {
    id: "task-3",
    title: "Code AVL Tree Double Rotations in C++",
    subject: "Data Structures",
    time: "7:15 PM Today",
    priority: "Medium",
    priorityColor: "text-amber-600 bg-amber-50 border-amber-200",
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
    priorityColor: "text-rose-600 bg-rose-50 border-rose-200",
    duration: "40 mins",
    completed: false,
    reason: "Spaced repetition reminder: Day 4 curve."
  },
  {
    id: "task-5",
    title: "Solve 2 Dynamic Programming Knapsack Variations",
    subject: "Algorithms",
    time: "2:00 PM Tomorrow",
    priority: "Medium",
    priorityColor: "text-amber-600 bg-amber-50 border-amber-200",
    duration: "50 mins",
    completed: false,
    reason: "ICPC hackathon speed drill."
  }
];

export const recentActivities = [
  {
    id: "act-1",
    title: "Completed Tree Traversals & AVL Trees Quiz",
    category: "Practice Quiz",
    score: "92%",
    timeAgo: "2 hours ago",
    icon: "CheckCircle2",
    iconColor: "text-emerald-500 bg-emerald-50"
  },
  {
    id: "act-2",
    title: "AI Tutor: Deep Dive into Two-Phase Locking (2PL)",
    category: "AI Tutor Session",
    score: "12 min chat",
    timeAgo: "5 hours ago",
    icon: "Bot",
    iconColor: "text-indigo-500 bg-indigo-50"
  },
  {
    id: "act-3",
    title: "Mastered Concept: B-Tree Fanout & Disk Page Sizing",
    category: "Topic Mastery",
    score: "+40 XP",
    timeAgo: "Yesterday",
    icon: "Award",
    iconColor: "text-blue-500 bg-blue-50"
  },
  {
    id: "act-4",
    title: "Maintained 14-Day Learning Streak",
    category: "Milestone",
    score: "Streak Fire",
    timeAgo: "2 days ago",
    icon: "Flame",
    iconColor: "text-amber-500 bg-amber-50"
  }
];

export const sampleQuizzes = [
  {
    id: "quiz-dijkstra",
    title: "Dijkstra & Graph Shortest Paths (AI Revision)",
    subject: "Algorithms",
    difficulty: "Medium",
    duration: "10 mins",
    questionCount: 5,
    tag: "AI Weakness Fix",
    tagColor: "bg-rose-100 text-rose-800 border-rose-200",
    questions: [
      {
        id: "q1",
        question: "Why does standard Dijkstra's algorithm fail when a graph contains negative-weight edge cycles?",
        options: [
          "It causes an infinite loop because distances continuously decrease without convergence.",
          "The priority queue becomes corrupted with negative keys.",
          "It visits vertices in random topological order instead of by distance.",
          "It requires adjacency matrices and cannot support negative weights."
        ],
        correctAnswer: 0,
        explanation: "Dijkstra's greedy choice assumes that once a node is settled with the minimum current distance, no shorter path to it will ever be discovered. A negative cycle continuously lowers distance, violating the optimal substructure invariant.",
        keyConcept: "Greedy Choice Invariant & Non-Negative Weights"
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
        explanation: "Each vertex is extracted from the min-heap once (O(V log V)) and each edge can trigger a decrease-key operation in the heap (O(E log V)), yielding total time complexity O((V + E) log V).",
        keyConcept: "Min-Heap vs Fibonacci Heap Complexity"
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
        explanation: "In a DAG, vertices can be topologically sorted in O(V + E) time, and relaxing edges in topological order computes single-source shortest paths in linear O(V + E) time, even with negative weights!",
        keyConcept: "DAG Shortest Path Linear Relaxation"
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
        keyConcept: "Edge Relaxation Invariant"
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
        keyConcept: "A* Admissible Heuristic Evaluation"
      }
    ]
  },
  {
    id: "quiz-trees",
    title: "Self-Balancing Trees & AVL Rotations",
    subject: "Data Structures",
    difficulty: "Hard",
    duration: "12 mins",
    questionCount: 4,
    tag: "Core DS",
    tagColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    questions: [
      {
        id: "qt1",
        question: "What is the balance factor of a node in an AVL tree, and what range must it satisfy for the tree to remain balanced?",
        options: [
          "Height(Left) - Height(Right); must be within {-1, 0, +1}",
          "Size(Left) / Size(Right); must be within [0.5, 2.0]",
          "Depth(Left) + Depth(Right); must be an even integer",
          "Black height difference; must be 0"
        ],
        correctAnswer: 0,
        explanation: "The AVL balance factor is defined as the height of the left subtree minus the height of the right subtree. Every node must maintain a balance factor of -1, 0, or +1.",
        keyConcept: "AVL Balance Invariant"
      },
      {
        id: "qt2",
        question: "If an insertion into the right subtree of the left child of node A causes an imbalance, which rotation sequence restores AVL balance?",
        options: [
          "Single Left Rotation",
          "Left-Right Double Rotation (LR Rotation)",
          "Right-Left Double Rotation (RL Rotation)",
          "Single Right Rotation"
        ],
        correctAnswer: 1,
        explanation: "A Left-Right (LR) imbalance occurs when a node is inserted into the right subtree of a left child. A left rotation on the child followed by a right rotation on the parent resolves this.",
        keyConcept: "Double Rotations (LR / RL)"
      },
      {
        id: "qt3",
        question: "What is the maximum height of an AVL tree with n nodes?",
        options: [
          "Approximately 1.44 log2(n)",
          "Exactly log2(n)",
          "2.0 log2(n)",
          "sqrt(n)"
        ],
        correctAnswer: 0,
        explanation: "Because an AVL tree is strictly balanced, its worst-case height is bounded by approximately 1.44 * log2(n), making search operations strictly O(log n).",
        keyConcept: "AVL Height Bound"
      },
      {
        id: "qt4",
        question: "How do Red-Black trees differ from AVL trees in terms of rebalancing overhead during frequent insertions and deletions?",
        options: [
          "Red-Black trees require at most 2 rotations on insert and 3 on delete, making them faster for write-heavy workloads.",
          "AVL trees require fewer rotations than Red-Black trees.",
          "Red-Black trees do not require rotations, only color flips.",
          "AVL trees have worse lookup times than Red-Black trees."
        ],
        correctAnswer: 0,
        explanation: "Red-Black trees have looser height balancing, requiring fewer rotations on inserts/deletes, which is why standard libraries (like C++ std::map, Java TreeMap) use Red-Black trees for write-intensive workflows.",
        keyConcept: "Red-Black vs AVL Tradeoffs"
      }
    ]
  },
  {
    id: "quiz-dbms",
    title: "SQL Indexing, B+ Trees & Transactions",
    subject: "Database Systems",
    difficulty: "Medium",
    duration: "10 mins",
    questionCount: 4,
    tag: "High Yield",
    tagColor: "bg-blue-100 text-blue-800 border-blue-200",
    questions: [
      {
        id: "qdb1",
        question: "Why do relational database engines (e.g., PostgreSQL, MySQL InnoDB) use B+ Trees instead of Binary Search Trees for on-disk indices?",
        options: [
          "B+ Trees have high fan-out, reducing tree height and minimizing expensive disk block I/O operations.",
          "Binary Search Trees cannot store duplicate keys.",
          "B+ Trees consume less RAM than BSTs.",
          "B+ Trees avoid log2(N) complexity."
        ],
        correctAnswer: 0,
        explanation: "Disk access is thousands of times slower than RAM. High fan-out (hundreds of keys per page) keeps B+ Trees shallow (3 to 4 levels for millions of rows), requiring very few disk page reads.",
        keyConcept: "High Fan-Out & Disk Page I/O"
      },
      {
        id: "qdb2",
        question: "What makes range queries (e.g., WHERE age BETWEEN 20 AND 30) uniquely efficient in a B+ Tree compared to a standard B-Tree?",
        options: [
          "All leaf nodes are linked in a sequential doubly/singly linked list.",
          "Leaf nodes store hashes of keys.",
          "Internal nodes contain all table records.",
          "B+ Trees duplicate keys in every level."
        ],
        correctAnswer: 0,
        explanation: "In a B+ Tree, data records or row pointers reside exclusively in leaves, and leaf nodes are linked together. Once the starting key is located in O(log N), range scans simply traverse the leaf linked list.",
        keyConcept: "Leaf Node Linked Traversal"
      },
      {
        id: "qdb3",
        question: "In transaction management, what does the 'I' in ACID represent and how is it commonly implemented?",
        options: [
          "Isolation; implemented via Two-Phase Locking (2PL) or Multi-Version Concurrency Control (MVCC).",
          "Integrity; implemented via Foreign Key constraints.",
          "Indexing; implemented via B+ Trees.",
          "Idempotency; implemented via Write-Ahead Logging (WAL)."
        ],
        correctAnswer: 0,
        explanation: "Isolation ensures concurrent transactions execute without interfering with each other. Modern relational engines use MVCC and locking mechanisms to enforce isolation levels.",
        keyConcept: "ACID Isolation & MVCC"
      },
      {
        id: "qdb4",
        question: "Which normal form requires eliminating partial dependency of non-prime attributes on composite candidate keys?",
        options: [
          "Second Normal Form (2NF)",
          "First Normal Form (1NF)",
          "Third Normal Form (3NF)",
          "Boyce-Codd Normal Form (BCNF)"
        ],
        correctAnswer: 0,
        explanation: "2NF requires that the table is in 1NF and all non-key attributes are fully functionally dependent on the primary key, eliminating partial functional dependencies.",
        keyConcept: "Database Normalization (2NF)"
      }
    ]
  },
  {
    id: "quiz-os",
    title: "OS Concurrency, Semaphores & Memory",
    subject: "Operating Systems",
    difficulty: "Hard",
    duration: "12 mins",
    questionCount: 4,
    tag: "Exam Prep",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    questions: [
      {
        id: "qos1",
        question: "What are the four necessary Coffman conditions required for a system deadlock to occur?",
        options: [
          "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",
          "Starvation, Race Condition, Paging, Context Switch",
          "Deadlock, Livelock, Priority Inversion, Thrashing",
          "Atomic operations, Semaphores, Mutexes, Spinlocks"
        ],
        correctAnswer: 0,
        explanation: "Deadlock can only arise if all 4 Coffman conditions hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Breaking any one prevents deadlock.",
        keyConcept: "Coffman Deadlock Conditions"
      },
      {
        id: "qos2",
        question: "What is Belady's Anomaly in operating system memory management?",
        options: [
          "Under FIFO page replacement, increasing the number of physical page frames can actually increase the number of page faults.",
          "LRU page replacement fails on sequential scans.",
          "Thrashing occurs when CPU utilization reaches 100%.",
          "Virtual memory exceeds the 64-bit address space."
        ],
        correctAnswer: 0,
        explanation: "Belady's Anomaly describes the counterintuitive phenomenon where allocating more page frames to a process using FIFO page replacement causes more page faults.",
        keyConcept: "Belady's Anomaly & Stack Algorithms"
      },
      {
        id: "qos3",
        question: "How does a counting semaphore differ from a binary mutex lock?",
        options: [
          "A counting semaphore can allow up to N concurrent threads access to a resource pool, whereas a mutex is strictly 0 or 1 with thread ownership.",
          "A mutex can be signaled by any thread, while a semaphore cannot.",
          "Counting semaphores cannot deadlock.",
          "Mutex locks require hardware interrupts while semaphores do not."
        ],
        correctAnswer: 0,
        explanation: "A counting semaphore maintains an integer counter allowing N units of a resource to be accessed simultaneously. A mutex is an ownership lock (only the locking thread may unlock it).",
        keyConcept: "Mutex vs Counting Semaphore"
      },
      {
        id: "qos4",
        question: "What is the primary role of the Translation Lookaside Buffer (TLB)?",
        options: [
          "A fast hardware cache of recent virtual-to-physical address translations to avoid multiple memory accesses during page table walking.",
          "A buffer for network packets in socket programming.",
          "A register storing the process control block.",
          "An L3 CPU cache for instruction prefetching."
        ],
        correctAnswer: 0,
        explanation: "The TLB is an on-chip associative cache in the MMU that stores recent page table entries, accelerating virtual address translation from multiple memory cycles to a single cycle on TLB hit.",
        keyConcept: "TLB & Hardware Address Translation"
      }
    ]
  }
];

export const sampleStudyMaterials = [
  {
    id: "mat-1",
    title: "Graph Traversal & Shortest Path Deep Dive",
    subject: "Algorithms",
    type: "AI Revision Deck",
    readTime: "12 min read",
    rating: 4.9,
    bookmarks: 142,
    highlights: [
      "Dijkstra vs Bellman-Ford decision matrix",
      "Fibonacci Heap O(E + V log V) proof",
      "Bidirectional Dijkstra speedup for roadmap routing",
      "Common hackathon edge cases (disconnected vertices, self-loops)"
    ],
    summary: "Comprehensive guide detailing single-source shortest path algorithms, time-complexity analysis, priority queue data structures, and real-world network routing applications."
  },
  {
    id: "mat-2",
    title: "B+ Tree Indexing & Storage Engine Architecture",
    subject: "Database Systems",
    type: "Architecture Notes",
    readTime: "15 min read",
    rating: 4.8,
    bookmarks: 98,
    highlights: [
      "Leaf node doubly-linked list traversal",
      "Split and merge mechanics during insertions/deletions",
      "Clustered vs Non-clustered indexing in InnoDB",
      "WAL Write-Ahead Logging & ARIES recovery protocol"
    ],
    summary: "In-depth review of database storage engine internals, page layout, buffer pool caching algorithms, and transaction logging protocols."
  },
  {
    id: "mat-3",
    title: "Concurrency Primitives: Semaphores, Mutex & Monitors",
    subject: "Operating Systems",
    type: "Cheat Sheet",
    readTime: "8 min read",
    rating: 4.9,
    bookmarks: 215,
    highlights: [
      "Classic Dining Philosophers solution in C",
      "Reader-Writer lock priority policies",
      "Peterson's Algorithm software mutual exclusion",
      "Condition variables and spurious wakeups"
    ],
    summary: "Visual cheat sheet explaining synchronization primitives, race condition debugging, deadlock prevention protocols, and POSIX pthread implementations."
  },
  {
    id: "mat-4",
    title: "Dynamic Programming: 1D to 2D Memoization Patterns",
    subject: "Algorithms",
    type: "Interactive Guide",
    readTime: "20 min read",
    rating: 5.0,
    bookmarks: 310,
    highlights: [
      "0/1 Knapsack vs Unbounded Knapsack space optimization",
      "Longest Common Subsequence (LCS) traceback",
      "Matrix Chain Multiplication state representation",
      "Top-down memoization vs Bottom-up tabulation trade-offs"
    ],
    summary: "Master DP state transitions with step-by-step recurrence derivations, memory compaction techniques, and annotated Python/C++ code samples."
  }
];

export const cannedTutorResponses = [
  {
    trigger: "gcp",
    aliases: ["gce", "gae", "cloud", "compute engine", "app engine"],
    response: `### Cloud Architecture: GCP, GCE, and GAE (General CS Knowledge)

Google Cloud Platform (GCP) provides a continuum of compute abstractions spanning raw infrastructure to fully managed serverless runtimes.

---

#### 1. Google Cloud Platform (GCP) Core Invariants & Architecture
* **Global Hyperscale Backbone**: Resources are deployed across multi-datacenter **Availability Zones (AZs)** and geographically dispersed **Regions**, interconnected via Google's private software-defined network (Andromeda SDN and Jupiter fabric).
* **Resource Hierarchy**: Enforces deterministic access control: \`Organization -> Folders -> Projects -> Resources\`. Every compute asset belongs to exactly one Project.
* **Security & IAM Invariant**: Zero-trust architecture with default least privilege; communication between services requires authenticated identity tokens (Service Accounts).

---

#### 2. Google Compute Engine (GCE) — Infrastructure-as-a-Service (IaaS)
GCE provides raw, unmanaged Virtual Machines (VMs) running on KVM hypervisors with full root and kernel access.

* **Core Architectural Model**:
  - **Granular Control**: Choose vCPU/RAM ratios, GPU accelerators, custom OS images, and Persistent Disks (Zonal or Regional SSD/HDD).
  - **Networking**: Direct interface with Google Virtual Private Cloud (VPC), custom firewall rules, and internal load balancers.
* **System Invariant**:
  - *Shared Responsibility Model*: Google guarantees physical hardware, hypervisor availability, and host networking. The **user is strictly responsible** for guest OS patching, security hardening, runtime installations, and application scaling.
* **Scaling Dynamics**:
  - Scales horizontally via **Managed Instance Groups (MIGs)** based on CPU utilization or custom metrics, typically taking 30–60 seconds to provision new instances.

---

#### 3. Google App Engine (GAE) — Platform-as-a-Service (PaaS)
GAE is a fully managed, serverless platform designed for deploying web applications and microservices without managing servers or network configuration.

* **Core Environments**:
  - **Standard Environment**: Runs application code in preconfigured language sandboxes (Python, Node.js, Java, Go). Instances spin up in milliseconds and can **scale down to zero** when traffic ceases, incurring zero idle cost.
  - **Flexible Environment**: Runs app containers on background GCE VMs with support for custom Docker runtimes, background threads, and persistent network sockets.
* **System Invariant**:
  - *Stateless Request Invariant*: Web tier instances must be completely **stateless**. Ephemeral local disk storage is wiped upon instance recycle. All persistent state must be externalized to managed databases (Cloud SQL, Firestore, or Cloud Storage).

---

#### 4. Architectural Comparison & Decision Matrix

| Dimension | Google Compute Engine (GCE) | Google App Engine (GAE) |
|---|---|---|
| **Service Model** | Infrastructure-as-a-Service (IaaS) | Platform-as-a-Service (PaaS) |
| **Level of Abstraction** | Low (Virtual Machines, Kernels, Disks) | High (Code, Runtimes, HTTP Handlers) |
| **Scaling Granularity** | Instance-level via MIGs (minutes) | Request-driven autoscaling (seconds/sub-second) |
| **Scale-to-Zero** | No (Minimum 1 VM or manual shutdown) | Yes (Standard Environment idle = $0) |
| **OS / Patching Maintenance** | User responsibility | Fully automated by Google |
| **State Handling** | Supports attached persistent block disks | Requires external persistent data stores |
| **Best Used For** | Custom kernels, legacy software, databases | Web APIs, microservices, rapid development |`
  },
  {
    trigger: "dijkstra",
    response: `### Dijkstra's Algorithm: Core Mechanism & Failure Cases

**Dijkstra's Algorithm** is a greedy algorithm that finds the shortest path from a single source vertex to all other vertices in a weighted graph with **non-negative edge weights**.

#### 1. Why Negative Edges Break Dijkstra
Dijkstra permanently marks a vertex as "visited" once it is extracted from the Priority Queue, guaranteeing that its shortest distance is finalized.

When negative weights exist, a longer positive path discovered earlier might later be surpassed by a path containing negative weights, violating the **greedy optimal substructure property**:

\`\`\`
     (A) ---- 3 ----> (B)
      |                ^
      | 5              | -4
      v                |
     (C) --------------+
\`\`\`
* Dijkstra calculates: \`dist[B] = 3\` and marks B visited immediately.
* But path \`A -> C -> B\` costs \`5 + (-4) = 1\`, which is shorter! Dijkstra misses this.

#### 2. Time Complexities
| Implementation | Priority Queue | Complexity | Best For |
|---|---|---|---|
| Adjacency Matrix | Array | \\(O(V^2)\\) | Dense graphs (\\(E \\approx V^2\\)) |
| Adjacency List | Binary Min-Heap | \\(O((V+E) \\log V)\\) | Sparse graphs (standard) |
| Adjacency List | Fibonacci Heap | \\(O(E + V \\log V)\\) | Theoretical optimum |

#### 3. When to use what?
* **All weights non-negative**: Use Dijkstra \\(O((V+E) \\log V)\\).
* **Negative edge weights allowed**: Use **Bellman-Ford** \\(O(V \\cdot E)\\).
* **Graph is a DAG**: Use **Topological Sort relaxation** in linear \\(O(V + E)\\).
* **All-Pairs Shortest Path**: Use **Floyd-Warshall** \\(O(V^3)\\).`
  },
  {
    trigger: "b+ tree",
    response: `### Why Databases Choose B+ Trees Over Binary Search Trees

Relational database storage engines (such as MySQL InnoDB and PostgreSQL) rely on **B+ Trees** rather than balanced binary search trees (AVL or Red-Black trees) because of **hardware disk hierarchy physics**:

#### 1. Disk Block / Page Alignment
* Reading from SSD/HDD is done in **pages** (typically 4KB to 16KB).
* In a Binary Search Tree, each node stores 1 key and 2 pointers (approx. 24 bytes). A disk page fetch would waste 99% of loaded data.
* In a **B+ Tree**, each node holds hundreds of keys fitting exactly into one 16KB disk page. This is known as **high fan-out** (typically 100 to 500 children per node).

\`\`\`
Fan-out = 200:
- Level 1 (Root): 1 page = 200 keys
- Level 2: 200 pages = 40,000 keys
- Level 3: 40,000 pages = 8,000,000 keys
\`\`\`
> With just **3 disk I/O reads**, you can search across **8 million records**!

#### 2. High Efficiency for Range Queries (\`BETWEEN\`, \`>\`, \`<\`)
* In a standard B-Tree, records are scattered across all levels. A range query requires an expensive tree traversal back and forth.
* In a **B+ Tree**, data records exist **only in leaf nodes**, and all leaf nodes form a **doubly linked list**.
* Once the start key is located, the database engine simply scans the sequential leaf pointers on disk sequentially!`
  },
  {
    trigger: "virtual memory",
    response: `### Virtual Memory & Hardware Address Translation (Paging)

Virtual memory creates the illusion of a large, contiguous, private address space for each running process, isolated from physical RAM.

#### 1. The Translation Pipeline: Virtual to Physical
A 64-bit virtual address is split into:
1. **Virtual Page Number (VPN)**: Identifies the 4KB page.
2. **Page Offset**: Exact byte offset within the page (12 bits for a 4KB page: \\(2^{12} = 4096\\)).

\`\`\`
+-----------------------+---------------+
| Virtual Page Number   | Page Offset   |
| (VPN - 52 bits)       | (12 bits)     |
+-----------------------+---------------+
           |                     |
           v                     |
      [ MMU / TLB ]              |
           |                     |
           v                     |
+-----------------------+        |
| Physical Frame Number | <------+
| (PFN)                 |
+-----------------------+
\`\`\`

#### 2. Role of the TLB (Translation Lookaside Buffer)
* Walking a multi-level page table (e.g., 4 levels in x86-64) requires **4 separate RAM accesses** just to resolve 1 pointer!
* The **TLB** is an ultra-fast hardware associative cache on the CPU chip.
* **TLB Hit**: Address translated in 1 clock cycle (~0.5 ns).
* **TLB Miss**: CPU page-table walker accesses main memory, updates TLB (~10-50 ns).

#### 3. What Happens on a Page Fault?
1. Process accesses a valid virtual address whose page is currently swapped out on disk.
2. MMU triggers a CPU interrupt: **Page Fault Exception (Trap)**.
3. OS kernel saves process context, reads page from disk swap space into a free physical frame.
4. Kernel updates Page Table valid bit to \`1\` and resumes the interrupted instruction.`
  },
  {
    trigger: "dynamic programming",
    response: `### Dynamic Programming: Mental Framework & 0/1 Knapsack

Dynamic Programming (DP) solves optimization problems by breaking them into overlapping subproblems and storing intermediate answers to avoid recomputation.

#### Step 1: Formulate the State
For the classic **0/1 Knapsack Problem** (items with weights \\(W\\) and values \\(V\\), max capacity \\(C\\)):
* State: \`dp[i][w]\` = Maximum value possible considering the first \`i\` items with a current weight limit \`w\`.

#### Step 2: Recurrence Relation
For item \\(i\\) with weight \\(w_i\\) and value \\(v_i\\):
1. **Exclude item**: \`dp[i][w] = dp[i-1][w]\`
2. **Include item** (if \\(w \\ge w_i\\)): \`dp[i][w] = \\max(dp[i-1][w], \\, dp[i-1][w - w_i] + v_i)\`

#### Python Implementation with 1D Space Optimization:
\`\`\`python
def knapsack(weights, values, capacity):
    # Space optimization: iterate backwards to reuse previous state
    dp = [0] * (capacity + 1)
    
    for w_i, v_i in zip(weights, values):
        for w in range(capacity, w_i - 1, -1):
            dp[w] = max(dp[w], dp[w - w_i] + v_i)
            
    return dp[capacity]

# Example run:
weights = [2, 3, 4, 5]
values = [3, 4, 5, 8]
print("Max Profit:", knapsack(weights, values, 8)) # Output: 12
\`\`\`

#### Pro-Tip for Hackathons:
Whenever you see *“maximize or minimize subject to a constraint where choices affect future availability”*, check:
1. Greedy (if local choice is globally optimal).
2. If Greedy fails on counterexamples, use **DP**!`
  },
  {
    trigger: "deadlock",
    aliases: ["concurrency", "2pl", "semaphore", "mutex", "two-phase locking"],
    response: `### Concurrency Control & Deadlock Invariants (General CS Knowledge)

In multi-threaded and distributed database environments, concurrency control ensures serializability while preventing deadlock stagnation.

#### 1. Four Necessary Coffman Conditions for Deadlock:
Deadlock can occur if and only if all four conditions hold simultaneously:
1. **Mutual Exclusion**: Resources cannot be shared simultaneously.
2. **Hold and Wait**: Processes holding resources can request additional ones.
3. **No Preemption**: Resources cannot be forcibly revoked from a process.
4. **Circular Wait**: A closed loop of processes exists where each waits for a resource held by the next.

> *Deadlock Prevention Principle*: Breaking any single condition (e.g., global lock acquisition ordering or resource preemption) guarantees deadlock freedom.

#### 2. Two-Phase Locking (2PL) Protocol:
* **Growing Phase**: Transactions acquire locks; no locks can be released.
* **Shrinking Phase**: Transactions release locks; no new locks can be acquired.
* **Invariant**: 2PL guarantees serializable transaction execution. Strict 2PL (holding exclusive locks until commit) additionally prevents cascading aborts.`
  },
  {
    trigger: "avl",
    aliases: ["red-black", "rotation", "balance factor", "bst", "binary search tree"],
    response: `### Self-Balancing Binary Search Trees: AVL vs Red-Black (General CS Knowledge)

Self-balancing BSTs prevent worst-case \\(O(N)\\) degeneration on sorted insertions by maintaining height balance invariants.

#### 1. Structural Comparison:
* **AVL Trees**:
  - *Invariant*: Balance Factor \\(BF = |\\text{height}(L) - \\text{height}(R)| \\le 1\\) at every node.
  - *Strictness*: Strictly balanced (maximum height \\(\\approx 1.44 \\log_2 N\\)).
  - *Best For*: Lookup-intensive workloads where searches vastly outnumber insertions/deletions.
* **Red-Black Trees**:
  - *Invariants*: Root is black; no two consecutive red nodes; every path from root to null leaf contains the same number of black nodes.
  - *Strictness*: Looser balance (maximum height \\(\\le 2 \\log_2(N + 1)\\)).
  - *Best For*: Frequent insertion/deletion workloads (standard in C++ \`std::map\` and Java \`TreeMap\`) due to fewer rebalancing rotations (maximum 2 rotations on insert).`
  },
  {
    trigger: "scheduling",
    aliases: ["round robin", "cfs", "context switch", "scheduler"],
    response: `### CPU Process Scheduling & Context Switching (General CS Knowledge)

Operating system schedulers allocate CPU execution time across competing threads to maximize throughput and minimize latency.

#### 1. Classical Scheduling Paradigms:
* **Round Robin (RR)**: Preemptive scheduling allocating fixed time quanta (typically 10–100ms). Prevents starvation with \\(O(1)\\) FIFO queueing. Quanta sizing represents a trade-off between responsiveness and context switch overhead.
* **Completely Fair Scheduler (CFS)**: Linux default scheduler utilizing a red-black tree indexed by thread \`vruntime\` (virtual runtime). Ensures fair CPU allocation proportional to process nice values in \\(O(\\log N)\\).
* **Multi-Level Feedback Queues (MLFQ)**: Dynamically adjusts process priorities based on I/O burst behavior, favoring interactive short tasks over compute-bound batch jobs.`
  }
];

export const notificationsList = [
  {
    id: "notif-1",
    title: "AI Weak Topic Alert",
    message: "Dijkstra negative weight quiz accuracy dropped below 60%. Revision recommended.",
    time: "10 mins ago",
    read: false,
    type: "warning"
  },
  {
    id: "notif-2",
    title: "Streak Milestone Achieved",
    message: "You've maintained a 14-day streak! Keep going to unlock the Level 9 Scholar badge.",
    time: "2 hours ago",
    read: false,
    type: "success"
  },
  {
    id: "notif-3",
    title: "Study Schedule Reminder",
    message: "Upcoming: B+ Tree Indexing & Range Queries review starts at 4:00 PM.",
    time: "1 hour ago",
    read: true,
    type: "info"
  }
];
