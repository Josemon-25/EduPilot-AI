import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  User,
  Moon,
  Sun,
  LogOut,
  ExternalLink,
  CheckCheck,
  ChevronDown,
  BookOpen,
  CheckSquare,
  HelpCircle,
  Activity,
  X
} from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  setMobileOpen,
  currentUser,
  notifications,
  setNotifications,
  darkMode,
  setDarkMode,
  onStartQuiz,
  backendStatus,
  isDemoMode,
  setIsDemoMode
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Close popovers on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const pageTitles = {
    overview: { title: 'Dashboard Overview', subtitle: 'Personalized AI study dashboard & learning trajectory' },
    materials: { title: 'Course Materials & Ingestion', subtitle: 'Upload lecture PDFs, extract concept graphs, and generate targeted evaluations' },
    mylearning: { title: 'My Learning & Courses', subtitle: 'Enrolled CS subjects, structured syllabi and revision decks' },
    planner: { title: 'AI Study Planner', subtitle: 'Dynamic spaced repetition schedule & task completion' },
    practice: { title: 'Practice & Quizzes', subtitle: 'Targeted algorithmic evaluations & immediate concept feedback' },
    analytics: { title: 'Progress Analytics', subtitle: 'Cognitive retention trends, pre vs post revision delta telemetry' },
    tutor: { title: 'AI Tutor & Mentor', subtitle: 'Grounded computer science dialogue & solution walkthroughs' },
    settings: { title: 'Account & Study Preferences', subtitle: 'Personalize learning goals, AI mentor mode and appearance' }
  };

  // Search filter data
  const searchResults = [
    { type: 'Page', title: 'Learning Materials (Upload PDF)', action: () => setActiveTab('materials') },
    { type: 'Page', title: 'AI Study Planner', action: () => setActiveTab('planner') },
    { type: 'Page', title: 'Practice Quizzes', action: () => setActiveTab('practice') },
    { type: 'Page', title: 'AI Tutor Chat', action: () => setActiveTab('tutor') },
    { type: 'Topic', title: 'Graph Traversal & Dijkstra Shortest Path', action: () => { setActiveTab('practice'); onStartQuiz && onStartQuiz('quiz-dijkstra'); } },
    { type: 'Topic', title: 'B+ Tree Indexing & Range Queries', action: () => setActiveTab('materials') },
    { type: 'Topic', title: 'AVL Trees & Balancing Rotations', action: () => { setActiveTab('practice'); onStartQuiz && onStartQuiz('quiz-trees'); } },
    { type: 'Topic', title: 'Virtual Memory & Page Replacement', action: () => setActiveTab('tutor') },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left Section: Mobile Toggle & Page Title */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {pageTitles[activeTab]?.title || 'EduPilot AI'}
              </h1>
              
              {/* Live Status indicator */}
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                title="Click to toggle Demo Mode vs Live API"
                className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                  !isDemoMode && backendStatus === 'ok'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800/60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${!isDemoMode && backendStatus === 'ok' ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`} />
                <span>{!isDemoMode && backendStatus === 'ok' ? 'Live Backend Connected' : 'Demo Mode Active'}</span>
              </button>
            </div>
            <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 font-normal">
              {pageTitles[activeTab]?.subtitle}
            </p>
          </div>
        </div>

        {/* Right Section: Search, AI Tutor CTA, Notifications & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Global Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search topics, PDFs, quizzes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                className="w-56 lg:w-72 pl-9 pr-12 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <kbd className="hidden lg:inline-flex absolute right-2.5 top-2 items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
                ⌘K
              </kbd>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="sm:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Instant Search Results Dropdown */}
            {showSearch && (
              <div className="absolute right-0 sm:left-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Quick Navigation
                </div>
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((res, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          res.action();
                          setShowSearch(false);
                          setSearchQuery('');
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-brand-50 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {res.type}
                          </span>
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                            {res.title}
                          </span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick AI Tutor Action Button */}
          <button
            onClick={() => setActiveTab('tutor')}
            className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 hover:from-indigo-100 hover:to-violet-100 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Ask AI</span>
          </button>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl transition-colors ${
                        item.read
                          ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400'
                          : 'bg-brand-50/60 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/40 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-xs mt-1 leading-relaxed">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
              />
              <span className="hidden md:block text-xs font-semibold text-slate-700 dark:text-slate-200">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                    Active Student • Level 8
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profile & Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      setDarkMode(!darkMode);
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <div className="flex items-center space-x-2.5">
                      {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-400" />}
                      <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {darkMode ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
