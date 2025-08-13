import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IconType, AnimationType } from "./types";
import { Shield, Clock, Award, Users, Star } from "lucide-react";

// Enhanced className utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Icon mapping utility
export function getIcon(iconType: IconType, className?: string) {
  const iconClass = cn("w-8 h-8", className);
  
  const icons = {
    shield: <Shield className={iconClass} />,
    clock: <Clock className={iconClass} />,
    award: <Award className={iconClass} />,
    users: <Users className={iconClass} />,
    star: <Star className={iconClass} />,
  };
  
  return icons[iconType];
}

// Animation utility
export function getAnimationClass(type: AnimationType, delay?: number) {
  const baseClasses = {
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up", 
    pulse: "animate-pulse-glow",
    bounce: "animate-bounce",
  };
  
  const delayClass = delay ? `animation-delay-${delay}` : "";
  return cn(baseClasses[type], delayClass);
}

// Responsive grid utility
export function getGridClass(
  columns: { sm?: number; md?: number; lg?: number; xl?: number } = {}
) {
  const { sm = 1, md = 2, lg = 3, xl } = columns;
  
  return cn(
    `grid grid-cols-${sm}`,
    md && `md:grid-cols-${md}`,
    lg && `lg:grid-cols-${lg}`,
    xl && `xl:grid-cols-${xl}`
  );
}

// Section wrapper utility
export function createSectionWrapper(
  Component: React.ComponentType<any>,
  defaultProps: Record<string, any> = {}
) {
  return function WrappedSection(props: any) {
    const mergedProps = { ...defaultProps, ...props };
    return <Component {...mergedProps} />;
  };
}

// Card variant utility
export function getCardVariant(variant: "default" | "elevated" | "bordered" = "default") {
  const variants = {
    default: "bg-white rounded-lg shadow-sm",
    elevated: "bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300",
    bordered: "bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors",
  };
  
  return variants[variant];
}

// Button variant utility
export function getButtonVariant(
  variant: "primary" | "secondary" | "outline" | "ghost" = "primary",
  size: "sm" | "md" | "lg" = "md"
) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    ghost: "text-blue-600 hover:bg-blue-50",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };
  
  return cn(
    "font-semibold rounded-lg transition-colors duration-200 inline-flex items-center justify-center",
    variants[variant],
    sizes[size]
  );
}

// RTL text direction utility
export function getRTLProps(content: string) {
  // Simple heuristic to detect Arabic content
  const arabicRegex = /[\u0600-\u06FF]/;
  const isArabic = arabicRegex.test(content);
  
  return {
    dir: isArabic ? "rtl" : "ltr",
    className: isArabic ? "text-right" : "text-left",
  };
}

// Lazy loading utility
export function createLazyComponent<T = {}>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFunc);
  
  return function LazyWrapper(props: T) {
    return (
      <React.Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}

// Performance optimization: memoize expensive calculations
export function memoizeComponent<P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return React.memo(Component, areEqual);
}

// Contact info formatter
export function formatContactInfo(type: "phone" | "email", value: string) {
  switch (type) {
    case "phone":
      // Format phone number for better readability
      return value.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
    case "email":
      return value.toLowerCase();
    default:
      return value;
  }
}

// SEO utilities
export function generatePageTitle(pageName?: string, companyName: string = "عالم النظافة") {
  return pageName ? `${pageName} | ${companyName}` : companyName;
}

export function generateMetaDescription(content: string, maxLength: number = 160) {
  return content.length > maxLength ? 
    content.substring(0, maxLength - 3) + "..." : 
    content;
}

// Error boundary utility
export function createErrorBoundary(fallbackComponent?: React.ComponentType<{ error: Error }>) {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        const FallbackComponent = fallbackComponent || (() => <div>Something went wrong.</div>);
        return <FallbackComponent error={this.state.error!} />;
      }

      return this.props.children;
    }
  };
}

// Accessibility utilities
export function getAriaLabel(text: string, context?: string) {
  return context ? `${text} - ${context}` : text;
}

export function createSkipLink(targetId: string, text: string = "Skip to main content") {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
      tabIndex={0}
    >
      {text}
    </a>
  );
}

// Performance monitoring utilities
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Import React for JSX
import React from "react";