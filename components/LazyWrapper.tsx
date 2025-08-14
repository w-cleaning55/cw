"use client";

import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<any>;
}

function DefaultLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

function DefaultErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-500 mb-4">⚠️ خطأ في التحميل</div>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}

export default function LazyWrapper({ 
  children, 
  fallback = <DefaultLoadingSpinner />,
  errorFallback: ErrorFallback = DefaultErrorFallback 
}: LazyWrapperProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Higher-order component for easy lazy loading
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  loadingComponent?: React.ReactNode
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <LazyWrapper fallback={loadingComponent}>
      <Component {...props} ref={ref} />
    </LazyWrapper>
  ));
  
  WrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
