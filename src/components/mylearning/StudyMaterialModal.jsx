import React, { useState } from 'react';
import { X, Bookmark, Share2, Sparkles, ChevronLeft, ChevronRight, RotateCw, CheckCircle, Lightbulb, FileText, Check } from 'lucide-react';

export default function StudyMaterialModal({ material, onClose, onStartQuiz }) {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'flashcards'
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [knownCards, setKnownCards] = useState({});

  if (!material) return null;

  const flashcards = [
    {
      q: "When does Dijkstra's algorithm fail?",
      a: "When the graph contains negative weight edges. Dijkstra's greedy selection assumes once a node is extracted from the min-heap, no shorter path can be discovered.",
      hint: "Think about greedy choice property."
    },
    {
      q: "Why do databases use B+ Trees instead of AVL Trees for indices?",
      a: "High fan-out (hundreds of keys per node) minimizes disk block I/O operations by keeping tree depth shallow (3-4 levels for millions of rows), plus leaf nodes form a sequential doubly-linked list for fast range queries.",
      hint: "Consider disk page size vs CPU RAM speed."
    },
    {
      q: "What are the 4 Coffman conditions for Deadlock?",
      a: "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait.\nBreaking any one condition prevents deadlock.",
      hint: "Remember: ME, HW, NP, CW."
    },
    {
      q: "What is the time complexity of building a heap from an array of N elements?",
      a: "O(N) time using bottom-up heapify (Floyd's algorithm), NOT O(N log N).",
      hint: "Mathematical summation of (h / 2^h)."
    }
  ];

  const currentCard = flashcards[cardIndex];

  const toggleKnown = (index) => {
    setKnownCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
                {material.subject}
              </span>
              <span className="text-xs text-slate-400">• {material.type}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {material.title}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Bookmark material"
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher: Summary vs Interactive Flashcards */}
        <div className="px-6 pt-4 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-6">
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'notes'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>AI Revision Summary</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'flashcards'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Smart Flashcards ({flashcards.length})</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6">
          {activeTab === 'notes' ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {material.summary}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>High-Yield Revision Points</span>
                </h4>
                <ul className="space-y-2.5">
                  {material.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Exam Pro-Tip: </span>
                  Always state your graph representation assumptions (adjacency list vs matrix) and explain edge case complexity in technical interviews.
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Flashcard container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[220px] rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/80 dark:from-slate-800 dark:via-slate-800 dark:to-indigo-950/40 border-2 border-dashed border-indigo-200 dark:border-indigo-800/80 p-6 flex flex-col justify-between cursor-pointer select-none transition-all hover:border-indigo-400 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Card {cardIndex + 1} of {flashcards.length}
                  </span>
                  <span className="text-xs text-brand-600 dark:text-brand-400 flex items-center space-x-1">
                    <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
                    <span>Click to flip</span>
                  </span>
                </div>

                <div className="py-4 text-center">
                  {!isFlipped ? (
                    <div>
                      <p className="text-xs font-semibold uppercase text-brand-600 dark:text-brand-400 mb-1">
                        Question
                      </p>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {currentCard.q}
                      </h3>
                      <p className="text-xs text-slate-400 mt-3 italic">
                        Hint: {currentCard.hint}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400 mb-1">
                        Model Solution
                      </p>
                      <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                        {currentCard.a}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleKnown(cardIndex);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition-colors ${
                      knownCards[cardIndex]
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{knownCards[cardIndex] ? 'Mastered!' : 'Mark as Mastered'}</span>
                  </button>
                  <span className="text-slate-400 text-[11px]">EduPilot Spaced Repetition</span>
                </div>
              </div>

              {/* Flashcard navigation buttons */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  disabled={cardIndex === 0}
                  onClick={() => {
                    setCardIndex(cardIndex - 1);
                    setIsFlipped(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-1">
                  {flashcards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCardIndex(idx);
                        setIsFlipped(false);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === cardIndex
                          ? 'bg-brand-600 w-5'
                          : knownCards[idx]
                          ? 'bg-emerald-400'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={cardIndex === flashcards.length - 1}
                  onClick={() => {
                    setCardIndex(cardIndex + 1);
                    setIsFlipped(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {material.readTime} • ★ {material.rating} rating
          </span>
          <button
            onClick={() => {
              onClose();
              onStartQuiz && onStartQuiz('quiz-dijkstra');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
          >
            Take Associated Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
