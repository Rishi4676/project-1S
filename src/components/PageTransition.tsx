"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // When pathname changes, trigger a quick, high-performance transition
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Top Instant Route Progress Indicator */}
      {isNavigating && (
        <div
          role="progressbar"
          aria-label="Page loading"
          className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-amber-400 to-teal-400 z-[9999] shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
        />
      )}

      {/* Hardware-Accelerated Smooth Page Container */}
      <div
        key={pathname}
        className="w-full min-h-full transform-gpu animate-in fade-in duration-150"
      >
        {children}
      </div>
    </>
  );
};
