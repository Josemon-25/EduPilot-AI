# EduPilot AI — Intelligent Personalized Learning Platform

> *"Study smarter. Master what matters."*

EduPilot AI is a premium, full-stack, AI-powered personalized learning platform built for college students and hackathons. It transforms static lecture slides, textbooks, and notes into an adaptive learning feedback loop that diagnoses knowledge gaps, prioritizes time-constrained revision, and validates measurable improvement through empirical retesting.

---

## 🌟 The Adaptive Learning Loop

$$\text{Upload Notes} \longrightarrow \text{Extract Concepts} \longrightarrow \text{Generate Diagnostic Quiz} \longrightarrow \text{Assess Knowledge} \longrightarrow \text{Identify Weak Topics} \longrightarrow \text{Targeted Revision} \longrightarrow \text{Retest} \longrightarrow \text{Measure Delta}$$

Unlike generic summarization tools, EduPilot AI implements a closed-loop adaptive system:
1. **PDF Ingestion & Concept Extraction**: Validates documents (<10MB), extracts readable text, chunks content into sections, and identifies core algorithmic topics.
2. **Deterministic Server-Side Scoring**: Scored on the server; does not rely on LLM hallucinations for correctness.
3. **Adaptive Weak Topic Ranking**: Ranks topics using decay functions that factor in accuracy, practice recency, and exam proximity.
4. **Pre vs Post Revision Telemetry**: Retesting captures an empirical before/after delta (e.g. $58\% \rightarrow 85\%$, $+27\%$ knowledge gain).
5. **Time-Constrained Daily Revision Planner**: Allocates study tasks strictly within the student's declared daily capacity (e.g., max 3.5 hrs/day).
6. **Grounded AI Tutor**: Answers student questions strictly citing sections and invariants from uploaded lecture materials.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS (Custom `#0A0E1A` deep navy theme with indigo/violet accents), Lucide React, Recharts.
- **Backend**: Node.js (v22), Express 4.21, Multer (multipart upload validation), pdf-parse, Dotenv, CORS.
- **AI Services**: Modular architecture supporting Google Gemini, OpenAI, Anthropic, and a built-in deterministic adaptive content generator.
- **Data Persistence**: File-backed atomic JSON store (`server/data/db.json`) pre-seeded with realistic CS curricula.
- **Quality Assurance**: Automated regression test suite for quiz scoring, time constraints, PDF validation, and ranking algorithms.

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18 or newer recommended, tested on Node v22.14.0)
- npm (tested on v10.9.2)

### 1. Installation
```bash
# Clone or navigate to the project directory
cd d:\edupilot-ai

# Dependencies are already installed. If running on a fresh clone:
npm install
```

### 2. Environment Setup (Optional)
```bash
# Copy example configuration (works 100% out of the box in Demo Mode without external keys!)
cp .env.example .env
```

### 3. Start the Backend & Frontend

**Option A (Dual Servers in background):**
```bash
# Start the Express API server (Port 5000)
npm run server

# In another terminal, start the Vite frontend (Port 3000)
npm run dev
```

**Option B (Access the currently running instance):**
Both servers are already running in the background:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
*(Vite proxies all `/api/*` requests from port 3000 directly to port 5000).*

---

## 🧪 Running Automated Tests

Run the backend unit test suite to verify scoring, time constraints, PDF validation, and ranking algorithms:

```bash
npm test
```

Expected output:
```
--- RUNNING EDUPILOT AI BACKEND UNIT TESTS ---
[PASS] Mastery thresholds: <50% needs attention, 50-74% developing, >=75% strong
[PASS] Quiz scoring accurately calculates score and topic breakdown
[PASS] Adaptive topic ranking prioritizes lowest accuracy & oldest decay first
[PASS] Study plan time allocation never exceeds available daily study hours
[PASS] Pre vs Post revision accurately detects improvement without fabrication
[PASS] AI quiz validator rejects malformed questions and accepts valid 4-option questions
[PASS] PDF validation rejects non-PDF files and files larger than 10MB

Results: 7 / 7 tests passed.
ALL CORE TESTS PASSED SUCCESSFULLY!
```

---

## 🎮 How to Access & Run Demo Mode (Judge Walkthrough)

EduPilot AI includes a guaranteed offline Demo Mode with pre-seeded sample course materials:
1. **Open Dashboard** at `http://localhost:3000`. Observe the 14-day streak and the **AI Recommendation Card** highlighting Dijkstra's 58% retention dip.
2. Click **"Learning Materials"** in the sidebar. Note the pre-indexed lecture PDFs (`CS204_Graph_Algorithms.pdf` and `CS305_Database_Storage_Engines.pdf`).
3. Click **"Generate Quiz"** on the Graph Algorithms PDF.
4. Answer the multiple-choice questions. Click **"Validate Answer"** on any question to view the instant AI explanation.
5. Finish the quiz to see the **Server-Scored Evaluation** and the measured $+42\%$ before/after delta banner.
6. Open **"Progress Analytics"** to inspect the **Pre-Revision vs Post-Revision Delta Card** comparing Attempt 1 ($58\%$) to Attempt 2 ($85\%$).
7. Open **"AI Tutor"** and click suggested prompt *"Why do negative edges fail in Dijkstra?"* to view the green grounded citation badge: `[Citation: Uploaded Notes - Slide 4]`.
8. Open **"AI Study Planner"** and click **"AI Smart Re-balance"** to observe spaced repetition re-sorting constrained within daily hours.

---

## 📁 Project Structure

```
edupilot-ai/
├── package.json                   # Scripts & dependencies
├── vite.config.js                 # Vite server & /api proxy to 5000
├── tailwind.config.js             # Navy theme & custom styles
├── .env.example                   # Environment template
├── PRESENTATION.md                # 3-minute pitch deck & architecture
├── README.md                      # Documentation & instructions
├── server/
│   ├── index.js                   # Express server entry point
│   ├── config/index.js            # Environment & upload limits
│   ├── data/
│   │   ├── store.js               # File-backed JSON data store
│   │   └── db.json                # Persisted materials, quizzes & attempts
│   ├── services/
│   │   ├── pdfService.js          # PDF extraction, chunking & validation
│   │   ├── aiService.js           # Modular LLM caller + adaptive generator
│   │   └── adaptiveEngine.js      # Server scoring, decay & before/after delta
│   ├── routes/
│   │   ├── health.js              # GET /api/health
│   │   ├── materials.js           # POST /api/materials/upload, GET /api/materials
│   │   ├── quizzes.js             # POST /api/quizzes/generate, /submit
│   │   ├── progress.js            # GET /api/progress (telemetry)
│   │   ├── studyPlan.js           # POST /api/study-plan/generate, PATCH /tasks
│   │   └── tutor.js               # POST /api/tutor/chat (grounded answers)
│   └── tests/
│       └── runTests.js            # Automated test suite
└── src/
    ├── main.jsx                   # React root
    ├── App.jsx                    # Root state orchestration & navigation
    ├── services/
    │   └── api.js                 # Unified API client with offline fallback
    ├── data/
    │   └── mockData.js            # Fallback seed data
    └── components/
        ├── layout/ (Sidebar, Header)
        ├── dashboard/ (WelcomeBanner, KpiCard, WeeklyActivityChart, TopicMasterySection, AiRecommendationCard, StudyPlanWidget, RecentActivityWidget)
        ├── materials/ (LearningMaterialsPage)
        ├── mylearning/ (MyLearningPage, StudyMaterialModal)
        ├── planner/ (StudyPlannerPage, AddTaskModal)
        ├── practice/ (PracticeQuizzesPage, QuizRunner)
        ├── analytics/ (ProgressAnalyticsPage)
        ├── tutor/ (AiTutorPage)
        ├── settings/ (SettingsPage)
        └── common/ (Toast)
```
