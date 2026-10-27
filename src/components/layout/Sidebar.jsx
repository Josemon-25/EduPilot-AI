import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  CheckSquare,
  BarChart3,
  Bot,
  Settings,
  Flame,
  Sparkles,
  ChevronRight,
  GraduationCap,
  FileText,
  X
} from 'lucide-react';

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'materials', label: 'Learning Materials', icon: FileText, badge: 'PDF & Notes', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
  { id: 'mylearning', label: 'My Learning', icon: BookOpen, badge: '4 Subjects' },
  { id: 'planner', label: 'AI Study Planner', icon: CalendarCheck, badge: '3 Tasks', badgeColor: 'bg-brand-500/20 text-brand-300' },
  { id: 'practice', label: 'Practice & Quizzes', icon: CheckSquare, badge: '1 Alert', badgeColor: 'bg-amber-500/20 text-amber-300' },
  { id: 'analytics', label: 'Progress Analytics', icon: BarChart3 },
  { id: 'tutor', label: 'AI Tutor', icon: Bot, isAi: true, badge: 'Online', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen, currentUser }) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0A0E1A] text-slate-300 flex flex-col border-r border-[#19223C] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-[#19223C] pt-4 pb-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-white tracking-tight">EduPilot</span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart Learning OS</p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Readiness Status Pill */}
        <div className="px-4 py-3">
          <div className="p-2.5 rounded-xl bg-[#121829] border border-[#1E2640] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-300">Adaptive Loop</span>
            </div>
            <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Active v1.0
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-1.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">Navigation</span>
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#161F36]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'text-white scale-105' : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-105'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border border-white/10 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Streak at Bottom */}
        <div className="p-3 border-t border-[#19223C] bg-[#0c1120]">
          {/* Quick Streak Bar */}
          <div className="mb-2.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{currentUser.streakDays} Day Streak</p>
                <p className="text-[10px] text-amber-300 font-medium">Keep it burning!</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded">
              Active
            </span>
          </div>

          {/* User profile toggle */}
          <div
            onClick={() => setActiveTab('settings')}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-[#161F36] transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/50"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0c1120]"></span>
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.level}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
