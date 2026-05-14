'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  removing?: boolean;
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 4000;

const typeStyles: Record<ToastType, string> = {
  success: 'bg-emerald-600 text-white shadow-emerald-200/40',
  error: 'bg-red-600 text-white shadow-red-200/40',
  info: 'bg-indigo-600 text-white shadow-indigo-200/40',
};

const typeIcons: Record<ToastType, string> = {
  success: '\u2713',
  error: '\u2717',
  info: '\u2139',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Mark as removing to trigger slide-out
    setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 200);
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts(prev => {
      const next = [{ id, message, type }, ...prev];
      // Remove oldest if over max
      if (next.length > MAX_TOASTS) {
        const removed = next.pop();
        if (removed) {
          const timer = timersRef.current.get(removed.id);
          if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(removed.id);
          }
        }
      }
      return next;
    });
    const timer = setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
    timersRef.current.set(id, timer);
  }, [removeToast]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const toast = {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-sm:right-1/2 max-sm:translate-x-1/2 max-sm:w-[calc(100%-2rem)]"
        aria-live="polite"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            className={`
              flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg min-w-[280px] max-w-sm
              ${typeStyles[t.type]}
              transition-all duration-200 ease-out
              ${t.removing
                ? 'opacity-0 translate-x-4 max-sm:translate-x-0 max-sm:translate-y-4'
                : 'opacity-100 translate-x-0 translate-y-0 animate-slide-in'
              }
            `}
            role="alert"
          >
            <span className="text-lg font-bold leading-none shrink-0">{typeIcons[t.type]}</span>
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity text-lg leading-none ml-2"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      {/* Inline keyframes for slide-in animation */}
      <style>{`
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateY(0.75rem) scale(0.97);
          }
          70% {
            opacity: 1;
            transform: translateY(-2px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
