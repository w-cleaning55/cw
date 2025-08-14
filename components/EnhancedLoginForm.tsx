'use client';

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Loader2,
  Shield,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

interface EnhancedLoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function EnhancedLoginForm({ 
  onSuccess, 
  redirectTo = "/admin" 
}: EnhancedLoginFormProps) {
  const { t, currentLanguage } = useTranslation();
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isArabic = currentLanguage === "ar";

  // Field validation
  const validateField = useCallback((field: string, value: string) => {
    const errors = { ...validationErrors };

    switch (field) {
      case "username":
        if (!value.trim()) {
          errors.username = isArabic ? "اسم المستخدم مطلوب" : "Username is required";
        } else if (value.length < 3) {
          errors.username = isArabic ? "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" : "Username must be at least 3 characters";
        } else {
          delete errors.username;
        }
        break;

      case "password":
        if (!value.trim()) {
          errors.password = isArabic ? "كلمة المرور مطلوبة" : "Password is required";
        } else if (value.length < 6) {
          errors.password = isArabic ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters";
        } else {
          delete errors.password;
        }
        break;
    }

    setValidationErrors(errors);
  }, [validationErrors, isArabic]);

  // Handle input changes
  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear general error
    if (error) clearError();
    
    // Validate field
    validateField(field, value);
  }, [validationErrors, error, clearError, validateField]);

  // Form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Validate all fields
    validateField("username", formData.username);
    validateField("password", formData.password);

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      clearError();
      setSuccessMessage(null);

      await login(formData);
      
      setSuccessMessage(isArabic ? "تم تسجيل الدخول بنجاح!" : "Login successful!");
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("lastUsername", formData.username);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("lastUsername");
      }

      // Call success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Error is handled by the auth hook
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validationErrors, isSubmitting, rememberMe, login, clearError, onSuccess, isArabic, validateField]);

  // Demo login function
  const handleDemoLogin = useCallback(async () => {
    setFormData({
      username: "admin",
      password: "admin123",
    });
    
    // Clear any existing errors
    clearError();
    setValidationErrors({});
    
    // Wait a bit for state to update
    setTimeout(() => {
      handleSubmit(new Event("submit") as any);
    }, 100);
  }, [clearError, handleSubmit]);

  // Load remembered data on mount
  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe");
    const lastUsername = localStorage.getItem("lastUsername");
    
    if (remembered === "true" && lastUsername) {
      setRememberMe(true);
      setFormData(prev => ({ ...prev, username: lastUsername }));
    }
  }, []);

  const isFormValid = formData.username.trim() && 
                     formData.password.trim() && 
                     Object.keys(validationErrors).length === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-blue-950 dark:to-green-950 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          {/* Logo */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {isArabic ? "تسجيل الدخول" : "Admin Login"}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {isArabic
                ? "قم بتسجيل الدخول للوصول إلى لوحة الإدارة"
                : "Sign in to access the admin dashboard"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Alert */}
          {successMessage && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 dark:bg-red-950/20"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              {isArabic 
                ? "بيانات الدخول: admin / admin123" 
                : "Demo credentials: admin / admin123"}
            </AlertDescription>
          </Alert>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                {isArabic ? "اسم المستخدم" : "Username"}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder={
                    isArabic ? "أدخل اسم المستخدم" : "Enter username"
                  }
                  className={`pl-10 pr-4 ${
                    validationErrors.username ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  required
                  disabled={isSubmitting}
                  dir={isArabic ? "rtl" : "ltr"}
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>
              {validationErrors.username && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {isArabic ? "كلمة المرور" : "Password"}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder={isArabic ? "أدخل كلمة المرور" : "Enter password"}
                  className={`pl-10 pr-10 ${
                    validationErrors.password ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  required
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isSubmitting}
                aria-label={isArabic ? "تذكرني" : "Remember me"}
                title={isArabic ? "تذكرني" : "Remember me"}
              />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {isArabic ? "تذكرني" : "Remember me"}
              </Label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isArabic ? "جاري تسجيل الدخول..." : "Signing in..."}
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  {isArabic ? "تسجيل الدخول" : "Sign In"}
                </>
              )}
            </Button>

            {/* Demo Login Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full"
            >
              {isArabic ? "تسجيل دخول تجريبي" : "Demo Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
