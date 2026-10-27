import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Brain,
  Award,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Target,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Zap
} from 'lucide-react';
import { ApiService } from '../../services/api';

export default function ProgressAnalyticsPage({ onStartQuiz }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Trend data across 4 weeks
  const trendData = [
    { week: 'W1', hours: 22, accuracy: 78, retention: 72 },
    { week: 'W2', hours: 28, accuracy: 82, retention: 80 },
    { week: 'W3', hours: 34, accuracy: 85, retention: 86 },
    { week: 'W4 (Current)', hours: 38.5, accuracy: 88.4, retention: 91 }
  ];

  // Subject mastery comparative data
  const domainMasteryData = [
    { subject: 'Database Systems', score: 92, target: 85, status: 'Mastered' },
    { subject: 'Data Structures', score: 85, target: 85, status: 'Proficient' },
    { subject: 'Algorithms', score: 68, target: 85, status: 'In Review' },
    { subject: 'Operating Systems', score: 60, target: 85, status: 'Needs Review' },
    { subject: 'Computer Networks', score: 48, target: 80, status: 'Beginner' },
    { subject: 'System Design', score: 55, target: 80, status: 'Beginner' }
  ];

  // Quiz progression history
  const quizHistory = [
    { name: 'Binary Trees', score: 90, date: 'Oct 12' },
    { name: 'Hash Maps', score: 88, date: 'Oct 15' },
    { name: 'Graph BFS/DFS', score: 82, date: 'Oct 18' },
    { name: 'Dijkstra & Heap', score: 58, date: 'Oct 21' },
    { name: 'B+ Tree Indexing', score: 95, date: 'Oct 23' },
    { name: 'AVL Rotations', score: 92, date: 'Oct 26' }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await ApiService.getProgress();
        setAnalyticsData(data);
      } catch (err) {
        console.warn('Could not fetch backend progress:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
          <p className="font-bold border-b border-slate-800 pb-1 mb-1.5">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="flex justify-between space-x-4">
              <span className="text-slate-400 capitalize">{p.name}:</span>
              <span className="font-semibold text-white">
                {p.value} {p.name === 'hours' ? 'hrs' : '%'}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const comparisons = (analyticsData && analyticsData.preVsPostComparisons) || [
    {
      topic: "Graph Traversal & Shortest Path (Dijkstra's Algorithm)",
      preScore: 58,
      postScore: 85,
      delta: 27,
      isImproved: true,
      preDate: "2026-10-26",
      postDate: "2026-10-27"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & KPI Telemetry */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Cognitive Performance & Retention Analytics
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
              EduPilot measures your knowledge decay curves, problem solving velocity, and syllabus mastery distribution in real-time.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Retention Index: 91% High</span>
            </span>
          </div>
        </div>

        {/* 4 Metric counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold uppercase text-slate-400">Cumulative Study Hours</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1">122.5 hrs</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18% vs prior month</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold uppercase text-slate-400">Average Quiz Accuracy</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-1">88.4%</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+5.1% since Week 1</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold uppercase text-slate-400">Knowledge Retention Curve</p>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 font-mono mt-1">91.2%</p>
            <p className="text-xs text-slate-400 mt-1">Spaced repetition active</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold uppercase text-slate-400">Concepts Validated</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">102 / 128</p>
            <p className="text-xs text-slate-400 mt-1">79.6% complete</p>
          </div>
        </div>
      </div>

      {/* Adaptive Learning Highlight: Pre-Revision vs Post-Revision Comparison */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Zap className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Pre-Revision vs Post-Revision Delta (Adaptive Feedback Loop)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Validating learning outcomes by measuring score improvement after targeted weak-topic practice
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 self-start sm:self-auto">
            Live Adaptive Telemetry
          </span>
        </div>

        {comparisons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisons.map((comp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                    Targeted Topic
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {comp.topic}
                  </h4>

                  {/* Before / After comparison visual */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 text-center">
                      <p className="text-[10px] uppercase font-bold text-rose-500">Attempt 1 (Pre-Revision)</p>
                      <p className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
                        {comp.preScore}%
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Diagnosed Weakness</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 text-center">
                      <p className="text-[10px] uppercase font-bold text-emerald-500">Attempt 2 (Post-Revision)</p>
                      <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                        {comp.postScore}%
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Targeted Mastery</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{comp.delta}% Measured Knowledge Gain</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Empirically Verified</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="font-semibold text-slate-600 dark:text-slate-300">Not enough re-test data yet</p>
            <p className="mt-1">Complete a practice quiz on a diagnosed weak topic to view your pre vs post revision delta.</p>
          </div>
        )}
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Study hours & Accuracy Trajectory (Area Chart) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Learning Volume & Retention Growth
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weekly study hours and cognitive retention trends
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
              4-Week Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="hours" name="Study Hours" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
                <Area type="monotone" dataKey="retention" name="Retention %" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRet)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Domain Mastery Comparison (Horizontal Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Computer Science Domain Mastery
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Assessed mastery % vs Target benchmark (85%)
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
              Target: 85%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainMasteryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis type="number" domain={[0, 100]} unit="%" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis type="category" dataKey="subject" width={110} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="Mastery Score %" fill="#6366F1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Quiz Score History (Line Chart) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Recent Quiz Accuracy Trajectory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Score breakdown over the last 6 practice quizzes
            </p>
          </div>
          <span className="text-xs text-slate-400">Recent 6 Assessments</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={quizHistory} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis domain={[40, 100]} unit="%" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" name="Quiz Score %" stroke="#4F46E5" strokeWidth={3} dot={{ r: 5, fill: '#4F46E5' }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weakness Diagnosis & AI Remediation Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Brain className="w-5 h-5 text-indigo-500" />
              <span>AI Weakness Diagnosis & Remediation Engine</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              EduPilot isolated 3 specific subtopics where failure modes occurred in your recent assessments
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Dijkstra Invariant with Negative Edge Weights
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    58% Retention (Needs Attention)
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Root Cause: Repeatedly applied greedy choice property to graphs with negative cycle potentials instead of Bellman-Ford.
                </p>
              </div>
            </div>

            <button
              onClick={() => onStartQuiz && onStartQuiz('quiz-dijkstra')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center space-x-1.5 self-start md:self-auto shrink-0"
            >
              <span>Solve Revision Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Virtual Memory Multi-Level Page Table Walking
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    64% Retention (Developing)
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Root Cause: Confusion on TLB miss penalty overhead and 4-level x86-64 page table memory cycles.
                </p>
              </div>
            </div>

            <button
              onClick={() => onStartQuiz && onStartQuiz('quiz-os')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm flex items-center space-x-1.5 self-start md:self-auto shrink-0"
            >
              <span>Review OS Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
