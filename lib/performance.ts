import React from "react";

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
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
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
}

// Lazy loading component wrapper
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  fallback: React.ComponentType = () => <div className="animate-pulse bg-gray-200 h-48 rounded" />
) {
  return React.forwardRef<HTMLDivElement, P>((props, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { hasIntersected } = useIntersectionObserver(containerRef);

    React.useImperativeHandle(ref, () => containerRef.current!);

    return (
      <div ref={containerRef}>
        {hasIntersected ? <Component {...props} /> : React.createElement(fallback)}
      </div>
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
      { threshold: 0.1 }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [src]);

  return { imageSrc, isLoaded, imgRef };
}

// Debounced state hook
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300
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
    if (process.env.NODE_ENV === "development") {
      console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }
  });

  return { renderCount: renderCount.current };
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = React.useState<any>(null);

  React.useEffect(() => {
    if ("memory" in performance) {
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
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFunc);

  return React.forwardRef<any, P>((props, ref) => (
    <React.Suspense 
      fallback={fallback ? React.createElement(fallback) : <div>Loading...</div>}
    >
      <LazyComponent {...props} ref={ref} />
    </React.Suspense>
  ));
}

// Virtual scrolling for large lists
export function useVirtualScrolling(
  items: any[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
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

// Web vitals tracking
export function useWebVitals() {
  const [vitals, setVitals] = React.useState<any>({});

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => setVitals((prev: any) => ({ ...prev, cls: metric })));
        getFID((metric) => setVitals((prev: any) => ({ ...prev, fid: metric })));
        getFCP((metric) => setVitals((prev: any) => ({ ...prev, fcp: metric })));
        getLCP((metric) => setVitals((prev: any) => ({ ...prev, lcp: metric })));
        getTTFB((metric) => setVitals((prev: any) => ({ ...prev, ttfb: metric })));
      }).catch(() => {
        // web-vitals not available
      });
    }
  }, []);

  return vitals;
}