import React from 'react';
import { Flame, Clock, Trophy, CheckCircle2, TrendingUp } from 'lucide-react';

const iconMap = {
  Flame: Flame,
  Clock: Clock,
  Trophy: Trophy,
  CheckCircle2: CheckCircle2,
};

export default function KpiCard({ metric }) {
  const Icon = iconMap[metric.iconName] || Trophy;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${metric.color} flex items-center justify-center text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${metric.badgeColor}`}>
          {metric.badge}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {metric.title}
        </p>
        <div className="mt-1 flex items-baseline justify-between">
          <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {metric.value}
          </p>
          <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{metric.subtext.split(' ')[0]}</span>
          </div>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 truncate">
          {metric.subtext}
        </p>
      </div>
    </div>
  );
}
