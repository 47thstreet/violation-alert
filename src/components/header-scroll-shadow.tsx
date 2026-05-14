'use client';

import { useEffect, useState } from 'react';

interface HeaderScrollShadowProps {
  children: React.ReactNode;
  className?: string;
}

export function HeaderScrollShadow({ children, className = '' }: HeaderScrollShadowProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={className} data-scrolled={scrolled}>
      {children}
    </header>
  );
}
