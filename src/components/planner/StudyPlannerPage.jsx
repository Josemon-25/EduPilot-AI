import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Plus,
  Filter,
  Check,
  AlertCircle,
  RotateCcw,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import AddTaskModal from './AddTaskModal';

export default function StudyPlannerPage({ tasks, setTasks, showToast, onConsultTutor }) {
  const [selectedDay, setSelectedDay] = useState('Today');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'pending' | 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Weekend'];

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) {
            showToast({
              type: 'success',
              title: 'Task Completed! 🎉',
              message: `Marked "${t.title}" as completed (+25 XP).`
            });
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    showToast({
      type: 'success',
      title: 'Task Scheduled',
      message: `"${newTask.title}" added to your study queue.`
    });
  };

  const handleAiOptimize = () => {
    showToast({
      type: 'info',
      title: 'Optimizing Spaced Repetition...',
      message: 'EduPilot AI rebalanced your study sequence according to Ebbinghaus forgetting curves.'
    });

    // Sort: high priority first, uncompleted first
    setTimeout(() => {
      setTasks((prev) => {
        const sorted = [...prev].sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          if (a.priority === 'High' && b.priority !== 'High') return -1;
          if (b.priority === 'High' && a.priority !== 'High') return 1;
          return 0;
        });
        return sorted;
      });
      showToast({
        type: 'success',
        title: 'Plan Optimized ✨',
        message: 'High retention priority tasks prioritized for maximum retention.'
      });
    }, 600);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100) || 0;

  const filteredTasks = tasks.filter((t) => {
    if (filterMode === 'pending') return !t.completed;
    if (filterMode === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Control Deck */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Calendar className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                AI Cognitive Revision Planner
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
              EduPilot continuously calibrates your revision intervals using spaced repetition algorithms. Tasks automatically adjust based on quiz accuracy scores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAiOptimize}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 transition-colors flex items-center space-x-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>AI Smart Re-balance</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-colors flex items-center space-x-2 shadow-md shadow-brand-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Task</span>
            </button>
          </div>
        </div>

        {/* Progress bar across whole day */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Daily Study Target</span>
              <span className="text-slate-400">•</span>
              <span className="font-bold text-brand-600 dark:text-brand-400">
                {completedCount} of {totalCount} Tasks Complete ({progressPercent}%)
              </span>
            </div>
            <span className="text-slate-400">Target: 100% before 10:00 PM</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Day Selector Tabs & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Days pill tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDay === day
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Status filter toggle */}
        <div className="inline-flex rounded-xl bg-slate-200/60 dark:bg-slate-800 p-1 self-start sm:self-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'pending'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Pending ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilterMode('completed')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'completed'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Task List Grid */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                task.completed
                  ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 group-hover:text-brand-600 transition-colors focus:outline-none"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {task.subject}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${task.priorityColor}`}>
                      {task.priority} Priority
                    </span>
                    {task.completed && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                        Validated
                      </span>
                    )}
                  </div>

                  <h4
                    className={`text-sm sm:text-base font-bold mt-1.5 transition-colors ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-2">
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">AI Scheduling Rationale:</span>
                    <span>{task.reason}</span>
                  </p>
                </div>
              </div>

              {/* Time slot & action */}
              <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.time}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{task.duration} estimated</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onConsultTutor && onConsultTutor(task.title);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/40 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>Prep with AI</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">All caught up!</h3>
            <p className="text-xs text-slate-400 mt-1">No tasks matching this filter for {selectedDay}.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddTaskModal
          onClose={() => setIsModalOpen(false)}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
}
