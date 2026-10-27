import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Calendar, BarChart2, CheckCircle2 } from 'lucide-react';

export default function WeeklyActivityChart({ data }) {
  const [metricMode, setMetricMode] = useState('hours'); // 'hours' | 'quizzes'

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-1.5 flex items-center justify-between">
            <span>{label} (Study Day)</span>
            <span className="text-emerald-400 font-mono">{item.accuracy}% Accuracy</span>
          </p>
          <div className="space-y-1">
            <p className="flex justify-between space-x-4">
              <span className="text-slate-400">Hours Studied:</span>
              <span className="font-semibold text-indigo-300">{item.hours} hrs</span>
            </p>
            <p className="flex justify-between space-x-4">
              <span className="text-slate-400">Quizzes Solved:</span>
              <span className="font-semibold text-emerald-300">{item.quizzes} sets</span>
            </p>
            <p className="flex justify-between space-x-4">
              <span className="text-slate-400">Target Pace:</span>
              <span className="font-semibold text-slate-300">{item.target} hrs</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalHours = (data || []).reduce((acc, curr) => acc + (curr.hours || 0), 0).toFixed(1);
  const totalQuizzes = (data || []).reduce((acc, curr) => acc + (curr.quizzes || 0), 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Weekly Learning Activity
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
              On Track
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Total this week: <span className="font-semibold text-slate-800 dark:text-slate-200">{totalHours} hrs</span> • <span className="font-semibold text-slate-800 dark:text-slate-200">{totalQuizzes} quizzes</span>
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 self-start sm:self-auto">
          <button
            onClick={() => setMetricMode('hours')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              metricMode === 'hours'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Study Hours
          </button>
          <button
            onClick={() => setMetricMode('quizzes')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              metricMode === 'quizzes'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Quizzes Taken
          </button>
        </div>
      </div>

      {/* Recharts Component Container */}
      <div className="h-64 sm:h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              unit={metricMode === 'hours' ? 'h' : ''}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9', opacity: 0.5 }} />
            {metricMode === 'hours' && (
              <ReferenceLine y={3.5} stroke="#6366F1" strokeDasharray="3 3" label={{ value: 'Target: 3.5h', fill: '#6366F1', fontSize: 10, position: 'right' }} />
            )}
            <Bar
              dataKey={metricMode === 'hours' ? 'hours' : 'quizzes'}
              radius={[6, 6, 0, 0]}
              fill={metricMode === 'hours' ? '#6366F1' : '#10B981'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Saturday was your most productive day (7.5h)</span>
        </div>
        <span className="font-medium text-brand-600 dark:text-brand-400">Goal: 25h / week</span>
      </div>
    </div>
  );
}
