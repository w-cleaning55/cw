"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Home, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4" dir="rtl">
            غير مصرح بالوصول
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed" dir="rtl">
            عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة. 
            يرجى التواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة إلى لوحة التحكم
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="w-4 h-4 ml-2" />
                العودة إلى الصفحة الرئيسية
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">معلومات الأمان</span>
            </div>
            <p className="text-xs text-blue-600" dir="rtl">
              تم تسجيل محاولة الوصول هذه لأغراض الأمان. 
              إذا كنت بحاجة إلى مساعدة، يرجى التواصل مع فريق الدعم.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}