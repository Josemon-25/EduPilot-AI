import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Bookmark,
  FileText,
  Search,
  Filter,
  BarChart,
  Lightbulb
} from 'lucide-react';
import StudyMaterialModal from './StudyMaterialModal';

export default function MyLearningPage({ topics, studyMaterials, onStartQuiz }) {
  const [filter, setFilter] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const subjects = [
    {
      id: 'ds',
      title: 'Data Structures & Algorithmic Foundations',
      code: 'CS-201',
      instructor: 'Prof. David Chen & EduPilot AI',
      progress: 85,
      modulesCompleted: 18,
      totalModules: 22,
      difficulty: 'Advanced',
      difficultyColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
      nextTopic: 'Red-Black Tree Insertion & Double Rotations',
      estimatedHoursLeft: '6.5 hrs',
      lastStudied: 'Today, 11:30 AM',
      color: 'from-blue-600 to-indigo-600',
      description: 'Master linear and non-linear memory topologies, balanced search trees, graph representations, and dynamic memory architectures.'
    },
    {
      id: 'algo',
      title: 'Advanced Algorithms & Complexity Analysis',
      code: 'CS-204',
      instructor: 'Dr. Elena Rostova',
      progress: 68,
      modulesCompleted: 15,
      totalModules: 22,
      difficulty: 'Advanced',
      difficultyColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      nextTopic: 'Dijkstra Priority Queue vs Bellman-Ford Negative Cycles',
      estimatedHoursLeft: '11.0 hrs',
      lastStudied: 'Yesterday, 4:15 PM',
      color: 'from-indigo-600 to-violet-600',
      description: 'Asymptotic notation, divide-and-conquer, dynamic programming, network flow, NP-completeness and greedy heuristics.'
    },
    {
      id: 'db',
      title: 'Database Management Systems & Storage Engines',
      code: 'CS-305',
      instructor: 'Prof. Marcus Vance',
      progress: 92,
      modulesCompleted: 20,
      totalModules: 22,
      difficulty: 'Intermediate',
      difficultyColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      nextTopic: 'Two-Phase Commit (2PC) & Distributed MVCC',
      estimatedHoursLeft: '3.0 hrs',
      lastStudied: '2 days ago',
      color: 'from-violet-600 to-purple-600',
      description: 'Relational algebra, B+ Tree indexing, buffer pool management, ARIES write-ahead logging, and query optimization.'
    },
    {
      id: 'os',
      title: 'Operating Systems & Concurrency Architecture',
      code: 'CS-301',
      instructor: 'Dr. Sarah Jenkins',
      progress: 60,
      modulesCompleted: 13,
      totalModules: 22,
      difficulty: 'Hard',
      difficultyColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      nextTopic: 'Multi-Level Page Tables & TLB Translation',
      estimatedHoursLeft: '14.5 hrs',
      lastStudied: '3 days ago',
      color: 'from-purple-600 to-pink-600',
      description: 'Process scheduling, POSIX threads, synchronization primitives, virtual memory paging, and deadlock avoidance.'
    }
  ];

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'mastered') return s.progress >= 90;
    if (filter === 'in-progress') return s.progress < 90;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Filter bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Enrolled Computer Science Curricula
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Synchronized with your university syllabus. AI continuously calibrates mastery based on problem sets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search subject or course code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60 pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Filter pills */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                All (4)
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'in-progress'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                In Progress (3)
              </button>
              <button
                onClick={() => setFilter('mastered')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'mastered'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Mastered (1)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSubjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${sub.color} flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                      {sub.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {sub.title}
                    </h3>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${sub.difficultyColor}`}>
                  {sub.difficulty}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {sub.description}
              </p>

              {/* Progress bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Syllabus Mastery
                  </span>
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                    {sub.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sub.progress >= 90 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-violet-600'
                    }`}
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>{sub.modulesCompleted} / {sub.totalModules} Modules</span>
                  <span>{sub.estimatedHoursLeft} to complete</span>
                </div>
              </div>

              {/* Next topic pill */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-brand-500" />
                  <span>Next Recommended Lesson</span>
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                  {sub.nextTopic}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Studied: {sub.lastStudied}
              </span>
              <button
                onClick={() => {
                  const mat = studyMaterials.find(m => m.subject.toLowerCase().includes(sub.id)) || studyMaterials[0];
                  setSelectedMaterial(mat);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 transition-colors flex items-center space-x-1.5"
              >
                <span>Study Materials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Study Materials & AI Cheat Sheets Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                AI Synthesis & High-Yield Decks
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Smart Summaries
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Distilled concept summaries, algorithmic edge-case matrices, and interactive flashcard decks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studyMaterials.map((mat) => (
            <div
              key={mat.id}
              onClick={() => setSelectedMaterial(mat)}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 bg-white dark:bg-slate-900 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {mat.subject}
                  </span>
                  <span className="text-xs text-amber-500 font-semibold flex items-center space-x-1">
                    <span>★</span>
                    <span>{mat.rating}</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {mat.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                  {mat.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{mat.readTime}</span>
                <span className="font-semibold text-brand-600 dark:text-brand-400 flex items-center space-x-1">
                  <span>Open Deck</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal viewer */}
      {selectedMaterial && (
        <StudyMaterialModal
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
          onStartQuiz={onStartQuiz}
        />
      )}
    </div>
  );
}
