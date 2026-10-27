import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Sparkles,
  Trophy,
  ArrowRight,
  Filter,
  PlayCircle,
  HelpCircle,
  Flame,
  Award,
  AlertTriangle
} from 'lucide-react';
import QuizRunner from './QuizRunner';

export default function PracticeQuizzesPage({ quizzes, activeQuizId, onSelectQuiz, onConsultTutor }) {
  const [activeQuiz, setActiveQuiz] = useState(
    activeQuizId ? quizzes.find((q) => q.id === activeQuizId) : null
  );
  const [filterSubject, setFilterSubject] = useState('all');

  const filteredQuizzes = quizzes.filter((q) => {
    if (filterSubject === 'all') return true;
    return q.subject.toLowerCase().includes(filterSubject.toLowerCase());
  });

  if (activeQuiz) {
    return (
      <div className="animate-in fade-in duration-200">
        <QuizRunner
          quiz={activeQuiz}
          onConsultTutor={onConsultTutor}
          onExit={() => {
            setActiveQuiz(null);
            onSelectQuiz && onSelectQuiz(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner with Quiz Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckSquare className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Interactive Practice & Algorithmic Evaluations
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
              Timed practice sets with instantaneous AI feedback. Question parameters are calibrated dynamically to target diagnosed misconceptions.
            </p>
          </div>

          <div className="flex items-center space-x-4 self-start lg:self-auto">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center min-w-[90px]">
              <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">18</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Quizzes Solved</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center min-w-[90px]">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">88.4%</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Avg Accuracy</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center min-w-[90px]">
              <p className="text-xl font-bold text-amber-500 font-mono">+120</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Weekly XP</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          {['all', 'Algorithms', 'Data Structures', 'Database Systems', 'Operating Systems'].map((sub) => (
            <button
              key={sub}
              onClick={() => setFilterSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterSubject === sub
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sub === 'all' ? 'All Subjects' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Featured AI Recommendation Drill Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-900/90 via-indigo-950 to-slate-900 border border-rose-800/40 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Recommended Drill #1</span>
            </span>
            <span className="text-xs text-slate-300">Targeting Dijkstra Retention Dip (58%)</span>
          </div>

          <h3 className="text-lg font-bold text-white mt-2">
            Dijkstra & Graph Shortest Paths Adaptive Set
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Focus on negative cycle invariants, min-heap decrease-key complexity, and DAG topological sort alternatives.
          </p>
        </div>

        <button
          onClick={() => {
            const dijkstraQuiz = quizzes.find((q) => q.id === 'quiz-dijkstra') || quizzes[0];
            setActiveQuiz(dijkstraQuiz);
          }}
          className="px-5 py-3 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs shadow-md flex items-center space-x-2 self-start md:self-auto shrink-0"
        >
          <PlayCircle className="w-4 h-4 text-rose-600" />
          <span>Launch Priority Revision (5 Qs)</span>
        </button>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {quiz.subject}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${quiz.tagColor}`}>
                  {quiz.tag}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {quiz.title}
              </h4>

              <div className="mt-3 flex items-center space-x-4 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{quiz.duration}</span>
                </span>
                <span>•</span>
                <span>{quiz.questionCount} Questions</span>
                <span>•</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{quiz.difficulty}</span>
              </div>

              {/* Sample question preview pill */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">Sample Topic: </span>
                {quiz.questions[0]?.keyConcept || 'Algorithmic fundamentals'}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Instant AI Explanations</span>
              <button
                onClick={() => setActiveQuiz(quiz)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center space-x-1.5 transition-colors"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
