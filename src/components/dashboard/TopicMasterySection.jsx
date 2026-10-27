import React from 'react';
import { ArrowUpRight, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TopicMasterySection({ topics, onSelectSubject }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Curriculum Topic Mastery
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time retention telemetry based on quizzes & assignments
          </p>
        </div>
        <button
          onClick={() => onSelectSubject && onSelectSubject('all')}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center space-x-1"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-4">
        {(topics || []).map((topic) => {
          const isMastered = topic.progress >= 90;
          const isNeedsReview = topic.progress < 70;

          return (
            <div
              key={topic.id}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 transition-all cursor-pointer group"
              onClick={() => onSelectSubject && onSelectSubject(topic.id)}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {topic.subject}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {topic.code}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${topic.badgeClass}`}>
                    {topic.level}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    {topic.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isMastered
                      ? 'bg-emerald-500'
                      : isNeedsReview
                      ? 'bg-amber-500'
                      : 'bg-indigo-600'
                  }`}
                  style={{ width: `${topic.progress}%` }}
                />
              </div>

              {/* Secondary details */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{topic.completedConcepts} of {topic.totalConcepts} concepts validated</span>
                {topic.weakAreas && topic.weakAreas.length > 0 && (
                  <span className="text-amber-600 dark:text-amber-400 font-medium truncate max-w-[180px]">
                    Focus: {topic.weakAreas[0]}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Target: 85% mastery before hackathon sprint</span>
        <span className="text-brand-600 dark:text-brand-400 font-semibold cursor-pointer" onClick={() => onSelectSubject && onSelectSubject('all')}>
          Course Syllabus →
        </span>
      </div>
    </div>
  );
}
