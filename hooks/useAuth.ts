'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });
  
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setState({
          user: data.user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setState({
        user: null,
        isLoading: false,
        error: 'Authentication check failed',
        isAuthenticated: false,
      });
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        setState({
          user: data.user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        });
        return data.user;
      } else {
        const errorMessage = data.error || 'Login failed';
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          isAuthenticated: false,
        }));
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });

      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Logout failed',
      }));
    }
  }, [router]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const hasPermission = useCallback((module: string, action: 'create' | 'read' | 'update' | 'delete') => {
    if (!state.user) return false;
    
    if (state.user.role === 'admin') return true;
    
    const permission = state.user.permissions.find(p => p.module === module);
    return permission?.actions.includes(action) || false;
  }, [state.user]);

  const hasRole = useCallback((role: 'admin' | 'manager' | 'operator') => {
    return state.user?.role === role || false;
  }, [state.user]);

  return {
    ...state,
    login,
    logout,
    checkAuth,
    clearError,
    hasPermission,
    hasRole,
  };
}
