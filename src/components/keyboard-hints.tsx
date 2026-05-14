'use client';

import { useState, useEffect } from 'react';

const HINTS_SHOWN_KEY = 'violationalert_keyboard_hints_shown';

export function KeyboardHints() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem(HINTS_SHOWN_KEY) === 'true') return;

    sessionStorage.setItem(HINTS_SHOWN_KEY, 'true');
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="hidden sm:flex fixed bottom-4 left-4 z-40 items-center gap-2 px-3 py-2 rounded-xl bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium shadow-lg transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white/15 rounded text-[11px] font-mono">
        <span className="text-[10px]">&#8984;</span>K
      </kbd>
      <span className="text-gray-300">Search</span>
    </div>
  );
}
