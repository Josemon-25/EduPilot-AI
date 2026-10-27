import React, { useState } from 'react';
import {
  User,
  Settings,
  Moon,
  Sun,
  Bell,
  Sparkles,
  Shield,
  Save,
  Check,
  GraduationCap,
  Clock,
  Target
} from 'lucide-react';

export default function SettingsPage({
  currentUser,
  setCurrentUser,
  darkMode,
  setDarkMode,
  showToast
}) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [university, setUniversity] = useState(currentUser.university);
  const [major, setMajor] = useState(currentUser.major);
  const [targetExam, setTargetExam] = useState(currentUser.targetExam);
  const [studyHours, setStudyHours] = useState(currentUser.studyGoalHours || 3.5);

  const [aiPersona, setAiPersona] = useState('socratic'); // 'socratic' | 'direct' | 'academic'
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [spacedRepetitionAlerts, setSpacedRepetitionAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setCurrentUser((prev) => ({
        ...prev,
        name,
        email,
        university,
        major,
        targetExam,
        studyGoalHours: studyHours
      }));
      setIsSaving(false);
      showToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your profile and AI study preferences were successfully updated.'
      });
    }, 500);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Settings className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Platform Settings & Preferences
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize your student profile, AI tutoring behavior, and interface appearance
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Academic Student Profile
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-brand-500/20 shadow-md"
            />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
              <p className="text-xs text-slate-400">{currentUser.level} • {university}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Active Student Account
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Academic Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                University / Institution
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Degree & Major
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Learning Milestone / Target Goal
              </label>
              <input
                type="text"
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* AI Tutor & Study Configuration */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI Tutor Personality & Pacing Model
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Tutoring Persona
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'socratic', title: 'Socratic Guide', desc: 'Prompts with guiding questions to foster deep self-discovery.' },
                { id: 'direct', title: 'Direct & Concise', desc: 'Fast answers, bullet points, and code snippets without fluff.' },
                { id: 'academic', title: 'Deep Academic', desc: 'Rigorous formal proofs, invariants, and textbook literature.' }
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => setAiPersona(p.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    aiPersona === p.id
                      ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Daily Study Target ({studyHours} hours / day)
              </label>
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                {studyHours} hrs
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={studyHours}
              onChange={(e) => setStudyHours(parseFloat(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Appearance & Notifications */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Moon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interface & Notification Preferences
            </h3>
          </div>

          {/* Dark mode switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Workspace Theme</p>
              <p className="text-[11px] text-slate-400">
                {darkMode ? 'Dark navy workspace active' : 'Light modern workspace active'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 shadow-xs flex items-center space-x-2"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              <span>Switch to {darkMode ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Spaced Repetition Decay Warnings
                </p>
                <p className="text-[11px] text-slate-400">
                  Notify when memory retention drops below 65% for a topic
                </p>
              </div>
              <input
                type="checkbox"
                checked={spacedRepetitionAlerts}
                onChange={(e) => setSpacedRepetitionAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Streak Protection Alerts
                </p>
                <p className="text-[11px] text-slate-400">
                  Daily evening prompt if study target has not yet been logged
                </p>
              </div>
              <input
                type="checkbox"
                checked={streakAlerts}
                onChange={(e) => setStreakAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white shadow-lg shadow-brand-500/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            {isSaving ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
