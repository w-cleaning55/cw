'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface PerformanceState {
  isLowPowerMode: boolean;
  shouldReduceAnimations: boolean;
  shouldLazyLoad: boolean;
}

interface PerformanceContextType extends PerformanceState {
  enableLowPowerMode: () => void;
  disableLowPowerMode: () => void;
  getPerformanceStats: () => PerformanceState;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

interface PerformanceOptimizerProps {
  children: ReactNode;
}

export default function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  // Detect device capabilities and connection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkPerformance = () => {
      // Check if device prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check connection speed
      const connection = (navigator as any).connection;
      const isSlowConnection = connection && (
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' || 
        connection.saveData
      );

      if (prefersReducedMotion || isSlowConnection) {
        setIsLowPowerMode(true);
      }
    };

    checkPerformance();

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkPerformance);

    return () => {
      mediaQuery.removeEventListener('change', checkPerformance);
    };
  }, []);

  const enableLowPowerMode = () => setIsLowPowerMode(true);
  const disableLowPowerMode = () => setIsLowPowerMode(false);

  const getPerformanceStats = (): PerformanceState => ({
    isLowPowerMode,
    shouldReduceAnimations: isLowPowerMode,
    shouldLazyLoad: isLowPowerMode,
  });

  const value: PerformanceContextType = {
    isLowPowerMode,
    shouldReduceAnimations: isLowPowerMode,
    shouldLazyLoad: isLowPowerMode,
    enableLowPowerMode,
    disableLowPowerMode,
    getPerformanceStats,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceOptimizer');
  }
  return context;
}
