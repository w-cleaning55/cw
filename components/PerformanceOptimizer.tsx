'use client';

import React, { useEffect, useCallback, useRef } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export default function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  const timeoutRefs = useRef<Set<number>>(new Set());
  const animationFrameRefs = useRef<Set<number>>(new Set());
  const intervalRefs = useRef<Set<number>>(new Set());

  // Optimized visibility change handler
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // Pause heavy operations when tab is not visible
      console.log('Tab hidden - pausing heavy operations');
    } else {
      // Resume operations when tab becomes visible
      console.log('Tab visible - resuming operations');
    }
  }, []);

  // Optimized message handler
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      // Handle messages efficiently
      if (event.data && typeof event.data === 'object') {
        // Process message data
        console.log('Message received:', event.data);
      }
    } catch (error) {
      console.error('Message handler error:', error);
    }
  }, []);

  useEffect(() => {
    // Add optimized event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    window.addEventListener('message', handleMessage, { passive: true });

    // Cleanup function
    return () => {
      // Clear all timeouts and intervals
      timeoutRefs.current.forEach(id => clearTimeout(id));
      intervalRefs.current.forEach(id => clearInterval(id));
      animationFrameRefs.current.forEach(id => cancelAnimationFrame(id));

      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('message', handleMessage);
    };
  }, [handleVisibilityChange, handleMessage]);

  // Performance monitoring (disabled to prevent chunk loading issues)
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && 'performance' in window) {
  //     // Monitor long tasks (only in development)
  //     if (process.env.NODE_ENV === 'development') {
  //       const observer = new PerformanceObserver((list) => {
  //         for (const entry of list.getEntries()) {
  //           if (entry.duration > 50) { // Tasks longer than 50ms
  //             console.warn('Long task detected:', {
  //               name: entry.name,
  //               duration: entry.duration,
  //               startTime: entry.startTime,
  //             });
  //           }
  //         }
  //       });

  //       observer.observe({ entryTypes: ['longtask'] });
  //     }

  //     return () => observer.disconnect();
  //   }
  // }, []);

  return <>{children}</>;
}

// Hook for optimized event handling
export function useOptimizedEventHandler() {
  const handlerRef = useRef<((...args: any[]) => void) | null>(null);

  const setHandler = useCallback((handler: (...args: any[]) => void) => {
    handlerRef.current = handler;
  }, []);

  const optimizedHandler = useCallback((...args: any[]) => {
    if (handlerRef.current) {
      try {
        handlerRef.current(...args);
      } catch (error) {
        console.error('Optimized handler error:', error);
      }
    }
  }, []);

  return { setHandler, optimizedHandler };
}

// Hook for debounced functions
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    }) as T,
    [callback, delay]
  );
}

// Hook for throttled functions
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef(0);

  return useCallback(
    ((...args: any[]) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}
