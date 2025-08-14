'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authService, User, LoginCredentials } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<User>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  hasPermission: (module: string, action: 'create' | 'read' | 'update' | 'delete') => boolean;
  hasRole: (role: 'admin' | 'manager' | 'operator') => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is already authenticated
        if (authService.isAuthenticated()) {
          // Verify token with server
          const verifiedUser = await authService.verifyToken();
          setUser(verifiedUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('فشل في تهيئة المصادقة');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { user: loggedUser } = await authService.login(credentials);
      setUser(loggedUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في تسجيل الدخول';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newUser = await authService.register(userData);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في إنشاء المستخدم';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Update user function
  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await authService.updateUser(userId, updates);
      
      // If updating current user, update state
      if (user && user.id === userId) {
        setUser(updatedUser);
      }
      
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في تحديث المستخدم';
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  // Change password function
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      await authService.changePassword(currentPassword, newPassword);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في تغيير كلمة المرور';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Permission check
  const hasPermission = useCallback((module: string, action: 'create' | 'read' | 'update' | 'delete') => {
    return authService.hasPermission(module, action);
  }, []);

  // Role check
  const hasRole = useCallback((role: 'admin' | 'manager' | 'operator') => {
    return authService.hasRole(role);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    updateUser,
    changePassword,
    hasPermission,
    hasRole,
    clearError,
  };
}

export { AuthContext };
