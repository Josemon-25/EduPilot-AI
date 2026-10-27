# EduPilot AI — Hackathon Presentation & Pitch Deck

**Product**: EduPilot AI  
**Tagline**: *"Study smarter. Master what matters."*  
**Track**: Education Technology / AI Productivity  

---

## 1. Problem Statement

College students preparing for competitive exams, midterms, and technical interviews face a universal bottleneck: **passive, uncalibrated studying**.
- Students read through hundreds of pages of lecture slides, textbook PDFs, and lab notes without knowing where their actual knowledge gaps lie.
- Generic AI tools only provide text summaries or flashcard dumps—they fail to diagnose misconceptions, prioritize revision based on memory decay, or measure whether a student has genuinely improved after study sessions.

---

## 2. Target Users

- **Undergraduate & Graduate Computer Science / Engineering Students** preparing for rigorous examinations, technical hackathons, and interviews.
- **Time-constrained learners** who need an intelligent system that tells them *exactly what to study today* within their available study hours.

---

## 3. The Proposed Solution

**EduPilot AI** transforms passive course materials into an active, adaptive learning loop:

$$\text{Upload Notes} \longrightarrow \text{Extract Concepts} \longrightarrow \text{Generate Diagnostic Quiz} \longrightarrow \text{Assess Knowledge} \longrightarrow \text{Identify Weak Topics} \longrightarrow \text{Targeted Revision} \longrightarrow \text{Retest} \longrightarrow \text{Measure Delta}$$

### Why EduPilot AI is Fundamentally Different:
Most AI study tools stop at summarization. EduPilot AI implements a **closed-loop adaptive engine**:
1. **Server-Side Deterministic Scoring**: Does not rely on LLM hallucinations to determine if an answer is mathematically or logically correct.
2. **Knowledge Decay & Priority Scoring**: Ranks topics using $(100 - \text{accuracy}) \times 0.6 + \text{decay factor} \times 0.4$.
3. **Pre vs Post Revision Telemetry**: Retesting captures an empirical before/after delta (e.g. $58\% \rightarrow 85\%$, $+27\%$ measured knowledge gain).
4. **Time-Constrained Daily Revision Planner**: Allocates study tasks strictly within the student's declared daily capacity (e.g., max 3.5 hrs/day).

---

## 4. System Architecture

```
[ Frontend: React 18 + Vite + Tailwind CSS + Recharts + Lucide Icons ]
                                │
                        REST API (HTTP/JSON)
                                │
[ Backend: Node.js + Express 4.x (Port 5000 / Proxied via Port 3000) ]
       │                        │                            │
[ PDF Extraction ]    [ Adaptive Engine ]          [ Modular AI Service ]
  - pdf-parse           - Server-side scoring        - Gemini / OpenAI / Anthropic
  - 10MB limit          - Mastery classification     - Deterministic Fallback
  - Section chunking    - Pre vs Post Delta          - Document Citation Grounding
  - Metadata parser     - Time-capped Planner        - JSON Schema Validation
                                │
                     [ Data Persistence ]
                       - File-backed JSON DB (db.json)
                       - Auto-seeded demo state
```

---

## 5. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Custom `#0A0E1A` deep navy palette), Lucide React, Recharts.
- **Backend**: Node.js 22, Express 4.21, Multer (multipart upload validation), pdf-parse, Dotenv, CORS.
- **Adaptive Engine**: Custom TypeScript/JavaScript module for spaced repetition calculation, Coffman deadlock detection, and algorithmic proof validation.
- **Testing**: Built-in automated regression test suite covering scoring, time constraints, PDF validation, and ranking.

---

## 6. Three-Minute Live Demo Script (For Judges)

### 0:00 – 0:30 (The Problem & Vision)
> *"Hello judges! As CS students, we spend hours reading 50-page slide decks before exams, but we never know our real weak spots until we fail a question on test day. EduPilot AI solves this with an adaptive feedback loop that ingests course PDFs, identifies knowledge gaps, and proves learning gains through empirical retesting."*

### 0:30 – 2:00 (The Complete 9-Step End-to-End Workflow)
1. **Dashboard Overview**: Show Alex's dashboard: 14-day streak, 88.4% average score, and the **AI Recommendation Card** flagging a 58% retention dip in Dijkstra's Algorithm.
2. **Learning Materials**: Navigate to *Learning Materials*. Highlight the uploaded slide decks (`CS204_Graph_Algorithms.pdf` and `CS305_Database_Storage_Engines.pdf`). Drag and drop a PDF to show instant validation (<10MB check) and topic extraction.
3. **Adaptive Quiz Engine**: Click *"Start Targeted Revision"*. Take the Dijkstra quiz. Select answers, click *"Validate Answer"*, and showcase the **Instant AI Reasoning Breakdown** explaining why negative edge weights violate the greedy settlement invariant.
4. **Server Scoring & Measured Delta**: Submit the quiz. Highlight the server-calculated result ($100\%$) and the measured $+42\%$ knowledge gain banner.
5. **Progress Analytics**: Open *Progress Analytics*. Show the **Pre-Revision vs Post-Revision Delta Card** comparing Attempt 1 ($58\%$) to Attempt 2 ($85\%$) alongside Recharts area and horizontal bar visualizations.
6. **Grounded AI Tutor**: Open *AI Tutor*. Click suggested prompt *"Why do negative edges fail in Dijkstra?"* Point out the green citation badge: `[Citation: Uploaded Notes - Slide 4: Invariants and Negative Edge Weight Limitations]`.
7. **Study Planner**: Open *AI Study Planner*. Click *"AI Smart Re-balance"*. Show how the planner reorganizes tasks based on the forgetting curve without exceeding the 3.5 hr/day limit. Check off a task to show instant reactive UI updates.

### 2:00 – 2:30 (Adaptive Engine & Technical Excellence)
> *"Under the hood, EduPilot doesn't just ask an LLM to guess. We built a deterministic scoring engine that validates options, calculates decay curves, and provides a guaranteed offline Demo Mode fallback if external API keys or networks fail."*

### 2:30 – 3:00 (Impact & Future Scope)
> *"EduPilot AI makes studying high-yield and measurable. Next steps include canvas LMS integration, vector embeddings for full textbook semantic search, and collaborative study group analytics. Thank you!"*

---

## 7. Known Limitations & Future Scope

- **OCR for Scanned Hand-written Notes**: Current PDF extractor requires digital text layers. Future scope includes Tesseract/Google Vision OCR for handwritten professor whiteboards.
- **Multi-student Cohort Analytics**: Currently optimized for single-student adaptive learning; can be extended to university professor dashboards to identify class-wide conceptual stumbling blocks.
