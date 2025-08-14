"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const SoftUIDashboard = dynamic(() => import("../../components/dashboard/SoftUIDashboard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">جاري تحميل لوحة التحكم...</p>
      </div>
    </div>
  ),
});

const SoftUICharts = dynamic(() => import("../../components/dashboard/SoftUICharts"), {
  ssr: false,
  loading: () => (
    <div className="h-96 animate-pulse bg-muted rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">جاري تحميل الرسوم البيانية...</p>
      </div>
    </div>
  ),
});

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold mb-2">جاري تحميل لوحة التحكم</h2>
          <p className="text-muted-foreground">يرجى الانتظار...</p>
        </div>
      </div>
    }>
      <SoftUIDashboard>
        <div className="mt-8 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">نظرة عامة على الأداء</h3>
            <SoftUICharts />
          </div>
        </div>
      </SoftUIDashboard>
    </Suspense>
  );
}
