'use client';

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "lucide-react";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get("next") || "/admin";
  const { t, currentLanguage } = useTranslation();
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [serverDebug, setServerDebug] = useState<any | null>(null);

  const isArabic = currentLanguage === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    try {
      // Remember last attempt so we can show it on error
      setLastAttempt({
        username: formData.username,
        password: formData.password,
      });
      await login(formData);
      if (onSuccess) { onSuccess(); } else { router.push(nextUrl); }
      // Clear last attempt on success
      setLastAttempt(null);
      setServerDebug(null);
    } catch (err: any) {
      // Error is handled by the hook; capture server debug if provided
      setServerDebug(err?.debug ?? null);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  // Demo login function
  const handleDemoLogin = async () => {
    await handleChange("username", "admin");
    await handleChange("password", "admin123");

    setTimeout(() => {
      handleSubmit(new Event("submit") as any);
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-blue-950 dark:to-green-950 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-green-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
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
                  className="pl-10 pr-4"
                  name="username"
                  autoComplete="username"
                  required
                  disabled={isLoading}
                  dir={isArabic ? "rtl" : "ltr"}
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>
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
                  className="pl-10 pr-10"
                  name="password"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
                aria-label={isArabic ? "تذكرني" : "Remember me"}
                title={isArabic ? "تذكرني" : "Remember me"}
                name="remember"
                autoComplete="on"
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
              disabled={
                isLoading ||
                !formData.username.trim() ||
                !formData.password.trim()
              }
            >
              {isLoading ? (
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
          </form>

          {/* Last Attempt Box (shown on error) */}
          {error && lastAttempt && (
            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm dark:border-yellow-900/40 dark:bg-yellow-950/20">
              <div className="font-semibold text-yellow-800 dark:text-yellow-200">
                {isArabic ? "آخر محاولة تسجيل دخول" : "Last Login Attempt"}
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1 text-gray-800 dark:text-gray-100">
                <div>
                  <span className="opacity-70">
                    {isArabic ? "اسم المستخدم:" : "Username:"}{" "}
                  </span>
                  <code className="rounded bg-white/60 px-1 py-0.5 dark:bg-white/10">
                    {lastAttempt.username}
                  </code>
                </div>
                <div>
                  <span className="opacity-70">
                    {isArabic ? "كلمة المرور:" : "Password:"}{" "}
                  </span>
                  <code className="rounded bg-white/60 px-1 py-0.5 dark:bg-white/10">
                    {lastAttempt.password}
                  </code>
                </div>
                {serverDebug && (
                  <>
                    <div className="mt-3 font-semibold text-yellow-800 dark:text-yellow-200">
                      {isArabic ? "مقارنة الخادم" : "Server Comparison"}
                    </div>
                    <div>
                      <span className="opacity-70">
                        {isArabic ? "المستخدم المطابق:" : "Matched user:"}{" "}
                      </span>
                      <code className="rounded bg-white/60 px-1 py-0.5 dark:bg-white/10">
                        {serverDebug.matchedUser
                          ? serverDebug.matchedUser.username
                          : isArabic
                            ? "لا يوجد"
                            : "none"}
                      </code>
                    </div>
                    {serverDebug.storedHash && (
                      <div>
                        <span className="opacity-70">
                          {isArabic
                            ? "تجزئة كلمة المرور المخزنة:"
                            : "Stored password hash:"}{" "}
                        </span>
                        <code className="break-all rounded bg-white/60 px-1 py-0.5 dark:bg-white/10">
                          {serverDebug.storedHash}
                        </code>
                      </div>
                    )}
                    <div>
                      <span className="opacity-70">
                        {isArabic ? "النتيجة:" : "Result:"}{" "}
                      </span>
                      <code className="rounded bg-white/60 px-1 py-0.5 dark:bg-white/10">
                        {serverDebug.compare
                          ? isArabic
                            ? "مطابقة"
                            : "match"
                          : isArabic
                            ? "غير مطابقة"
                            : "no match"}
                      </code>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Demo Login */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              className="w-full"
              disabled={isLoading}
            >
              {isArabic
                ? "تسجيل دخول تجريبي (admin/admin123)"
                : "Demo Login (admin/admin123)"}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {isArabic ? (
              <>
                للحصول على المساعدة، اتصل بـ{" "}
                <a
                  href="mailto:admin@cleaningworld.sa"
                  className="text-blue-600 hover:underline"
                >
                  admin@cleaningworld.sa
                </a>
              </>
            ) : (
              <>
                Need help? Contact{" "}
                <a
                  href="mailto:admin@cleaningworld.sa"
                  className="text-blue-600 hover:underline"
                >
                  admin@cleaningworld.sa
                </a>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
