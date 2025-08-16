"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                حدث خطأ غير متوقع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                عذراً، حدث خطأ أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-gray-100 p-3 rounded-lg">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    تفاصيل الخطأ (التطوير)
                  </summary>
                  <pre className="text-xs text-red-600 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.resetError}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة المحاولة
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  العودة للرئيسية
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook للاستخدام في Functional Components
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Component error:', error, errorInfo);
    
    // يمكن إرسال الخطأ إلى خدمة مراقبة الأخطاء هنا
    if (process.env.NODE_ENV === 'production') {
      // إرسال إلى Sentry أو أي خدمة مراقبة أخرى
    }
  };

  return { handleError };
};

// Fallback Component مخصص
export const DefaultErrorFallback: React.FC<{ 
  error?: Error; 
  resetError: () => void;
  componentName?: string;
}> = ({ error, resetError, componentName }) => (
  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
    <div className="flex items-center gap-2 mb-2">
      <AlertTriangle className="w-4 h-4 text-red-600" />
      <span className="font-medium text-red-800">
        خطأ في {componentName || 'المكون'}
      </span>
    </div>
    <p className="text-sm text-red-600 mb-3">
      حدث خطأ أثناء تحميل هذا المكون
    </p>
    <Button 
      size="sm" 
      onClick={resetError}
      className="bg-red-600 hover:bg-red-700"
    >
      <RefreshCw className="w-3 h-3 mr-1" />
      إعادة المحاولة
    </Button>
  </div>
);

export default ErrorBoundary;

