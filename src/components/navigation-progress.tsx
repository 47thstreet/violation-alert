'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  const startProgress = useCallback(() => {
    setVisible(true);
    setProgress(0);

    // Quick ramp to ~70%, then slow crawl
    let current = 0;
    const interval = setInterval(() => {
      current += (90 - current) * 0.08;
      if (current >= 89) {
        clearInterval(interval);
      }
      setProgress(current);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Complete on pathname change
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for click on links that trigger navigation
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a[href]');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;

      // Don't trigger for same-page links
      if (href === pathname) return;

      cleanup = startProgress();
    }

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      cleanup?.();
    };
  }, [pathname, startProgress]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 pointer-events-none">
      <div
        className="h-full bg-indigo-600 transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 8px rgba(79, 70, 229, 0.4)',
        }}
      />
    </div>
  );
}
