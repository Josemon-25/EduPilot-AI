import React from 'react';
import { CheckCircle2, Bot, Award, Flame, ArrowUpRight, Activity } from 'lucide-react';

const iconComponents = {
  CheckCircle2: CheckCircle2,
  Bot: Bot,
  Award: Award,
  Flame: Flame,
};

export default function RecentActivityWidget({ activities, onViewAll }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Recent Activity & Milestones
            </h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </div>
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>Activity log</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {(activities || []).map((act) => {
            const Icon = iconComponents[act.icon] || Activity;
            return (
              <div
                key={act.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {act.title}
                    </p>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{act.category}</span>
                      <span>•</span>
                      <span>{act.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 shrink-0">
                  {act.score}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Synchronized with EduPilot Cloud</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">All systems green</span>
      </div>
    </div>
  );
}
