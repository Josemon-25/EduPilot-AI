import React from 'react';
import { Calendar, CheckCircle2, Circle, Clock, ArrowRight, Plus } from 'lucide-react';

export default function StudyPlanWidget({ tasks, onToggleTask, onViewPlanner, onAddTask }) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100) || 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Upcoming Study Tasks
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {completedCount}/{tasks.length} Done
            </span>
          </div>
          <button
            onClick={onViewPlanner}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>Full Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Small progress meter */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
          <div
            className="bg-brand-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Task list items */}
        <div className="space-y-2.5">
          {(tasks || []).slice(0, 4).map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 group ${
                task.completed
                  ? 'bg-slate-50/70 dark:bg-slate-800/20 border-slate-200/50 dark:border-slate-800/50 opacity-75'
                  : 'bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60 hover:border-brand-300 dark:hover:border-brand-700'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 group-hover:text-brand-600 transition-colors focus:outline-none"
                aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-xs sm:text-sm font-semibold truncate transition-colors ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {task.title}
                  </p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${task.priorityColor}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="mt-1 flex items-center space-x-3 text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{task.subject}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{task.time}</span>
                  </span>
                  <span>•</span>
                  <span>{task.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Click any task to toggle status</span>
        <button
          onClick={onAddTask}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Task</span>
        </button>
      </div>
    </div>
  );
}
