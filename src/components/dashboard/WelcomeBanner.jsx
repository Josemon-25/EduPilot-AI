import React from 'react';
import { Sparkles, ArrowRight, Flame, Target, Compass } from 'lucide-react';

export default function WelcomeBanner({ currentUser, onStartRevision, onOpenTutor }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-900/40 shadow-xl">
      {/* Background glowing ambient orbs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>EduPilot AI Adaptive Mode</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{currentUser.streakDays}-Day Active Streak</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {getGreeting()}, {currentUser.name.split(' ')[0]} 👋
          </h2>

          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            You're on track to master <span className="text-indigo-300 font-semibold">Data Structures & Algorithms</span> before your midterm finals. EduPilot detected a 58% retention dip on graph algorithms—ready to resolve it with today's 10-minute focus session?
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Goal: {currentUser.targetExam}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Study Target: 3.5 hrs/day</span>
            </div>
          </div>
        </div>

        {/* Quick Action CTA Box */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
          <button
            onClick={onStartRevision}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start Focus Revision</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenTutor}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 text-xs font-semibold backdrop-blur-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Consult AI Tutor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
