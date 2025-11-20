import React from 'react';
import { X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const typeStyles = {
  success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  error: 'bg-red-50 text-red-900 border-red-200',
  warning: 'bg-amber-50 text-amber-900 border-amber-200',
  info: 'bg-blue-50 text-blue-900 border-blue-200',
};

const typeIconColors = {
  success: 'text-emerald-600',
  error: 'text-red-600',
  warning: 'text-amber-600',
  info: 'text-blue-600',
};

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto ${typeStyles[toast.type]}`}
        >
          <div className={`h-5 w-5 rounded-full flex-shrink-0 ${typeIconColors[toast.type]}`}>
            {toast.type === 'success' && <span>✓</span>}
            {toast.type === 'error' && <span>!</span>}
            {toast.type === 'warning' && <span>⚠</span>}
            {toast.type === 'info' && <span>ℹ</span>}
          </div>
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
