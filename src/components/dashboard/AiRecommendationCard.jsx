import React from 'react';
import { Sparkles, AlertTriangle, PlayCircle, HelpCircle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function AiRecommendationCard({ recommendation, onStartRevision, onConsultTutor }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-700/50 p-6 text-white shadow-lg shadow-indigo-950/30">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Retention Dip Detected (58%)</span>
            </span>
            <span className="text-xs font-medium text-slate-300 px-2 py-0.5 rounded bg-white/10">
              {recommendation.subject}
            </span>
          </div>

          <span className="flex items-center space-x-1 text-xs text-indigo-300 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{recommendation.impact}</span>
          </span>
        </div>

        {/* Content */}
        <div className="mt-4">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>{recommendation.topic}</span>
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {recommendation.reason}
          </p>

          {/* Key Insight Pill */}
          <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-indigo-200">
            <span className="font-semibold text-white">AI Diagnostic Note: </span>
            {recommendation.keyInsight}
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-indigo-800/60">
          <div className="flex items-center space-x-4 text-xs text-slate-300">
            <span className="flex items-center space-x-1">
              <span className="font-semibold text-white">{recommendation.estimatedTime}</span>
              <span>estimated</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span className="font-semibold text-white">{recommendation.questionsCount}</span>
              <span>targeted questions</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onConsultTutor(recommendation.topic)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Why Did I Miss This?</span>
            </button>

            <button
              onClick={() => onStartRevision(recommendation.quizId)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-950 hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 transform hover:-translate-y-0.5"
            >
              <PlayCircle className="w-4 h-4 text-indigo-600" />
              <span>{recommendation.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
