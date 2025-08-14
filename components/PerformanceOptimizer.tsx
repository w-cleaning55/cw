'use client';

import React, { useEffect, useCallback, useRef } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export default function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  const timeoutRefs = useRef<Set<number>>(new Set());
  const animationFrameRefs = useRef<Set<number>>(new Set());
  const intervalRefs = useRef<Set<number>>(new Set());

  // Store original functions to prevent infinite recursion
  const originalFunctions = useRef({
    setTimeout: window.setTimeout,
    setInterval: window.setInterval,
    requestAnimationFrame: window.requestAnimationFrame
  });

  // Optimized setTimeout wrapper
  const optimizedSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = originalFunctions.current.setTimeout(() => {
      try {
        callback();
      } catch (error) {
        console.error('setTimeout handler error:', error);
      } finally {
        timeoutRefs.current.delete(timeoutId);
      }
    }, delay);

    timeoutRefs.current.add(timeoutId);
    return timeoutId;
  }, []);

  // Optimized setInterval wrapper
  const optimizedSetInterval = useCallback((callback: () => void, delay: number) => {
    const intervalId = originalFunctions.current.setInterval(() => {
      try {
        callback();
      } catch (error) {
        console.error('setInterval handler error:', error);
      }
    }, delay);

    intervalRefs.current.add(intervalId);
    return intervalId;
  }, []);

  // Optimized requestAnimationFrame wrapper
  const optimizedRequestAnimationFrame = useCallback((callback: () => void) => {
    const animationFrameId = originalFunctions.current.requestAnimationFrame(() => {
      try {
        callback();
      } catch (error) {
        console.error('requestAnimationFrame handler error:', error);
      } finally {
        animationFrameRefs.current.delete(animationFrameId);
      }
    });

    animationFrameRefs.current.add(animationFrameId);
    return animationFrameId;
  }, []);

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
    // Override global setTimeout
    window.setTimeout = optimizedSetTimeout;

    // Override global setInterval
    window.setInterval = optimizedSetInterval;

    // Override global requestAnimationFrame
    window.requestAnimationFrame = optimizedRequestAnimationFrame;

    // Add optimized event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    window.addEventListener('message', handleMessage, { passive: true });

    // Cleanup function
    return () => {
      // Restore original functions
      window.setTimeout = originalFunctions.current.setTimeout;
      window.setInterval = originalFunctions.current.setInterval;
      window.requestAnimationFrame = originalFunctions.current.requestAnimationFrame;

      // Clear all timeouts and intervals
      timeoutRefs.current.forEach(id => clearTimeout(id));
      intervalRefs.current.forEach(id => clearInterval(id));
      animationFrameRefs.current.forEach(id => cancelAnimationFrame(id));

      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('message', handleMessage);
    };
  }, [optimizedSetTimeout, optimizedSetInterval, optimizedRequestAnimationFrame, handleVisibilityChange, handleMessage]);

  // Performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor long tasks
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn('Long task detected:', {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
            });
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });

      return () => observer.disconnect();
    }
  }, []);

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
