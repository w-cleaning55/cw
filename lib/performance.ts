import React from "react";

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {},
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
}

// Default fallback component
const DefaultFallback: React.ComponentType = () =>
  React.createElement("div", {
    className: "animate-pulse bg-gray-200 h-48 rounded",
  });

// Lazy loading component wrapper
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  fallback: React.ComponentType = DefaultFallback,
) {
  return React.forwardRef<HTMLDivElement, P>((props, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { hasIntersected } = useIntersectionObserver(containerRef);

    React.useImperativeHandle(ref, () => containerRef.current!);

    return React.createElement(
      "div",
      { ref: containerRef },
      hasIntersected
        ? React.createElement(Component, props)
        : React.createElement(fallback),
    );
  });
}

// Image lazy loading hook
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = React.useState(placeholder || "");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const image = new Image();
          image.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
          };
          image.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [src]);

  return { imageSrc, isLoaded, imgRef };
}

// Debounced state hook
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300,
): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = React.useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = React.useState<T>(initialValue);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return [value, debouncedValue, setValue];
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderStart = React.useRef<number>(0);
  const renderCount = React.useRef<number>(0);

  React.useLayoutEffect(() => {
    renderStart.current = performance.now();
    renderCount.current += 1;
  });

  React.useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    if (process.env.NODE_ENV === "development" && renderTime > 100) {
      console.log(
        `${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`,
      );
    }
  });

  return { renderCount: renderCount.current };
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && "memory" in performance) {
      const updateMemoryInfo = () => {
        setMemoryInfo((performance as any).memory);
      };

      updateMemoryInfo();
      const interval = setInterval(updateMemoryInfo, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  return memoryInfo;
}

// Bundle splitting helper
export function createAsyncComponent<P = {}>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
) {
  const LazyComponent = React.lazy(importFunc);

  return React.forwardRef<any, P>((props, ref) =>
    React.createElement(
      React.Suspense,
      { fallback: React.createElement("div", { children: "Loading..." }) },
      React.createElement(LazyComponent, { ...props, ref }),
    ),
  );
}

// Virtual scrolling for large lists
export function useVirtualScrolling(
  items: any[],
  itemHeight: number,
  containerHeight: number,
) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length,
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
}

// Resource preloading
export function useResourcePreload(resources: string[]) {
  React.useEffect(() => {
    resources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = resource.endsWith(".css") ? "style" : "script";
      link.href = resource;
      document.head.appendChild(link);
    });
  }, [resources]);
}

// Error boundary HOC
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  ErrorFallback?: React.ComponentType<{ error: Error; resetError: () => void }>,
) {
  return class extends React.Component<
    P,
    { hasError: boolean; error?: Error }
  > {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error("Error caught by boundary:", error, errorInfo);
    }

    resetError = () => {
      this.setState({ hasError: false, error: undefined });
    };

    render() {
      if (this.state.hasError) {
        const FallbackComponent =
          ErrorFallback ||
          (() =>
            React.createElement("div", {
              children: "Something went wrong. Please try again.",
            }));
        return React.createElement(FallbackComponent, {
          error: this.state.error!,
          resetError: this.resetError,
        });
      }

      return React.createElement(Component, this.props);
    }
  };
}

// Cache management hook
export function useCache<T>(key: string, defaultValue: T) {
  const [value, setValue] = React.useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;

    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setCachedValue = React.useCallback(
    (newValue: T) => {
      setValue(newValue);
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.warn("Failed to cache value:", error);
      }
    },
    [key],
  );

  return [value, setCachedValue] as const;
}
