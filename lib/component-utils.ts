import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IconType, AnimationType } from "./types";
import { Shield, Clock, Award, Users, Star } from "lucide-react";

// Enhanced className utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Icon mapping utility
export function getIcon(iconType: IconType, className?: string): React.ReactElement {
  const iconClass = cn("w-8 h-8", className);
  
  const icons: Record<IconType, React.ReactElement> = {
    shield: React.createElement(Shield, { className: iconClass }),
    clock: React.createElement(Clock, { className: iconClass }),
    award: React.createElement(Award, { className: iconClass }),
    users: React.createElement(Users, { className: iconClass }),
    star: React.createElement(Star, { className: iconClass }),
  };
  
  return icons[iconType];
}

// Animation utility
export function getAnimationClass(type: AnimationType, delay?: number): string {
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
): string {
  const { sm = 1, md = 2, lg = 3, xl } = columns;
  
  return cn(
    `grid grid-cols-${sm}`,
    md && `md:grid-cols-${md}`,
    lg && `lg:grid-cols-${lg}`,
    xl && `xl:grid-cols-${xl}`
  );
}

// Card variant utility
export function getCardVariant(variant: "default" | "elevated" | "bordered" = "default"): string {
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
): string {
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
export function getRTLProps(content: string): { dir: string; className: string } {
  // Simple heuristic to detect Arabic content
  const arabicRegex = /[\u0600-\u06FF]/;
  const isArabic = arabicRegex.test(content);
  
  return {
    dir: isArabic ? "rtl" : "ltr",
    className: isArabic ? "text-right" : "text-left",
  };
}


// Performance optimization: memoize expensive calculations
export function memoizeComponent<P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
): React.ComponentType<P> {
  return React.memo(Component, areEqual);
}

// Contact info formatter
export function formatContactInfo(type: "phone" | "email", value: string): string {
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
export function generatePageTitle(pageName?: string, companyName: string = "عالم النظافة"): string {
  return pageName ? `${pageName} | ${companyName}` : companyName;
}

export function generateMetaDescription(content: string, maxLength: number = 160): string {
  return content.length > maxLength ? 
    content.substring(0, maxLength - 3) + "..." : 
    content;
}

// Accessibility utilities
export function getAriaLabel(text: string, context?: string): string {
  return context ? `${text} - ${context}` : text;
}

// Performance monitoring utilities
export function measurePerformance(name: string, fn: () => void): void {
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

// Create optimized section component wrapper
export function createOptimizedSection<P extends Record<string, any>>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const OptimizedSection = React.memo((props: P) => {
    return React.createElement(Component, props);
  });
  
  OptimizedSection.displayName = `Optimized(${Component.displayName || Component.name})`;
  return OptimizedSection;
}

// Loading skeleton generator
export function createLoadingSkeleton(
  type: "card" | "text" | "section" = "section"
): React.ReactElement {
  const skeletons = {
    card: React.createElement("div", {
      className: "bg-white p-6 rounded-lg shadow animate-pulse",
      children: [
        React.createElement("div", { key: "1", className: "h-4 bg-gray-200 rounded w-full mb-2" }),
        React.createElement("div", { key: "2", className: "h-4 bg-gray-200 rounded w-3/4" }),
      ]
    }),
    text: React.createElement("div", {
      className: "animate-pulse",
      children: [
        React.createElement("div", { key: "1", className: "h-4 bg-gray-200 rounded w-full mb-2" }),
        React.createElement("div", { key: "2", className: "h-4 bg-gray-200 rounded w-5/6" }),
      ]
    }),
    section: React.createElement("div", {
      className: "py-20 bg-gray-50 animate-pulse",
      children: React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        children: [
          React.createElement("div", { key: "1", className: "h-8 bg-gray-200 rounded w-64 mx-auto mb-4" }),
          React.createElement("div", { key: "2", className: "h-4 bg-gray-200 rounded w-96 mx-auto mb-8" }),
        ]
      })
    })
  };
  
  return skeletons[type];
}
