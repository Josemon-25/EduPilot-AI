import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-brand-500" />
  };

  const borderColors = {
    success: 'border-emerald-200 bg-white dark:bg-slate-900',
    warning: 'border-amber-200 bg-white dark:bg-slate-900',
    error: 'border-rose-200 bg-white dark:bg-slate-900',
    info: 'border-brand-200 bg-white dark:bg-slate-900'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-sm w-full">
      <div className={`p-4 rounded-xl shadow-xl border flex items-start space-x-3 ${borderColors[toast.type || 'info']}`}>
        <div className="flex-shrink-0 mt-0.5">
          {icons[toast.type || 'info']}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {toast.title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {toast.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
