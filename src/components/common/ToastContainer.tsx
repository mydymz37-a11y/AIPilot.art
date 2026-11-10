import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-200'
                : isWarning
                ? 'bg-slate-900/95 border-amber-500/40 text-amber-200'
                : isError
                ? 'bg-slate-900/95 border-rose-500/40 text-rose-200'
                : 'bg-slate-900/95 border-indigo-500/40 text-slate-100'
            }`}
          >
            {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
            {isWarning && <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />}
            {isError && <XCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />}
            {!isSuccess && !isWarning && !isError && (
              <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-xs leading-relaxed font-medium">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
