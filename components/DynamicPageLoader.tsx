"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="mr-3 text-gray-600">جارٍ التحميل...</span>
  </div>
);

const ErrorComponent = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
    <div className="text-red-500 text-6xl mb-4">⚠️</div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">خطأ في التحميل</h2>
    <p className="text-gray-600 mb-4">عذراً، حدث خطأ أثناء تحميل هذه الصفحة</p>
    <button 
      onClick={() => window.location.reload()}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      إعادة تحميل الصفحة
    </button>
  </div>
);

// Dynamic imports for admin pages with optimized loading
export const DynamicAdminDashboard = dynamic(
  () => import('./admin/AdminDashboard'),
  { 
    loading: LoadingSpinner,
    ssr: false 
  }
);

export const DynamicAnalytics = dynamic(
  () => import('./admin/AdvancedAnalyticsCharts'),
  { 
    loading: LoadingSpinner,
    ssr: false 
  }
);

export const DynamicBookingCalendar = dynamic(
  () => import('./admin/BookingCalendar'),
  { 
    loading: LoadingSpinner,
    ssr: false 
  }
);

export const DynamicAISettings = dynamic(
  () => import('./admin/AISettings'),
  { 
    loading: LoadingSpinner,
    ssr: false 
  }
);

export const DynamicColorPalettes = dynamic(
  () => import('./admin/ColorPalettes'),
  { 
    loading: LoadingSpinner,
    ssr: false 
  }
);

export const DynamicDatabaseManager = dynamic(
  () => import('./admin/DatabaseManager'),
  { 
    loading: LoadingSpinner,
    ssr: false 
  }
);

export const DynamicSystemSettings = dynamic(
  () => import('./admin/SystemSettings'),
  { 
    loading: LoadingSpinner,
    ssr: false 
  }
);

export const DynamicTeamManagement = dynamic(
  () => import('./admin/TeamManagement'),
  { 
    loading: LoadingSpinner,
    ssr: false 
  }
);

// Dynamic imports for sections with intersection observer
export const DynamicStatsSection = dynamic(
  () => import('./sections/AdvancedStatsSection'),
  { 
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>,
    ssr: true 
  }
);

export const DynamicServicesSection = dynamic(
  () => import('./sections/ServicesSection'),
  { 
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>,
    ssr: true 
  }
);

export const DynamicTestimonialsSection = dynamic(
  () => import('./sections/TestimonialsSection'),
  { 
    loading: () => <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>,
    ssr: true 
  }
);

// HOC for creating optimized dynamic components
export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options: {
    loading?: React.ComponentType;
    error?: React.ComponentType;
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFn, {
    loading: options.loading || LoadingSpinner,
    ssr: options.ssr ?? true,
  });
}

// Intersection Observer based lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  { threshold = 0.1, rootMargin = '50px' } = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return isIntersecting;
}

export default {
  DynamicAdminDashboard,
  DynamicAnalytics,
  DynamicBookingCalendar,
  DynamicAISettings,
  DynamicColorPalettes,
  DynamicDatabaseManager,
  DynamicSystemSettings,
  DynamicTeamManagement,
  DynamicStatsSection,
  DynamicServicesSection,
  DynamicTestimonialsSection,
  createDynamicComponent,
  useIntersectionObserver,
};
