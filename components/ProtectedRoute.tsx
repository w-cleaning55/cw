'use client';

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from './LoginForm';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'operator';
  requiredPermission?: {
    module: string;
    action: 'create' | 'read' | 'update' | 'delete';
  };
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredPermission 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Check role permission if required
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required role: {requiredRole}
          </p>
        </div>
      </div>
    );
  }

  // Check specific permission if required
  if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.action)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Insufficient Permissions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have the required permissions to access this resource.
          </p>
          <p className="text-sm text-gray-500">
            Required: {requiredPermission.action} access to {requiredPermission.module}
          </p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}
