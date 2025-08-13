"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import {
  SpeedIcon,
  CheckIcon,
  UsersIcon,
  StarIcon,
} from "@/components/ui/CompactIcons";
import SoftUICard from "./SoftUICard";

interface SoftUIChartsProps {
  className?: string;
}

const SoftUICharts: React.FC<SoftUIChartsProps> = ({ className = "" }) => {
  const chartData = [
    { month: "يناير", value: 45000, change: 12 },
    { month: "فبراير", value: 52000, change: 15 },
    { month: "مارس", value: 48000, change: -8 },
    { month: "أبريل", value: 61000, change: 27 },
    { month: "مايو", value: 55000, change: -10 },
    { month: "يونيو", value: 67000, change: 22 },
  ];

  const serviceStats = [
    {
      name: "تنظيف المنازل",
      percentage: 45,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "تنظيف المكاتب",
      percentage: 25,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "تنظيف السجاد",
      percentage: 15,
      color: "from-purple-500 to-pink-500",
    },
    { name: "جلي الرخام", percentage: 10, color: "from-orange-500 to-red-500" },
    { name: "أخرى", percentage: 5, color: "from-gray-400 to-gray-600" },
  ];

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Revenue Chart */}
      <SoftUICard variant="glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900" dir="rtl">
            الإيرادات الشهرية
          </h3>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">+18%</span>
          </div>
        </div>

        <div className="space-y-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-16 text-sm text-gray-600" dir="rtl">
                {data.month}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {data.value.toLocaleString()} ريال
                  </span>
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      data.change > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {data.change > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(data.change)}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min((data.value / 70000) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SoftUICard>

      {/* Service Distribution */}
      <SoftUICard variant="glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900" dir="rtl">
            توزيع الخدمات
          </h3>
          <PieChart className="w-6 h-6 text-blue-600" />
        </div>

        <div className="space-y-4">
          {serviceStats.map((service, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900" dir="rtl">
                  {service.name}
                </span>
                <span className="text-sm text-gray-600">
                  {service.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${service.color} h-2 rounded-full transition-all duration-1000`}
                  style={{ width: `${service.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-600" />
            <div className="text-right" dir="rtl">
              <div className="font-medium text-gray-900">
                أداء ممتاز هذا الشهر
              </div>
              <div className="text-sm text-gray-600">
                نمو في جميع الخدمات بنسبة 15%
              </div>
            </div>
          </div>
        </div>
      </SoftUICard>

      {/* Performance Metrics */}
      <SoftUICard variant="gradient" className="lg:col-span-2">
        <h3
          className="text-xl font-bold text-gray-900 mb-6 text-center"
          dir="rtl"
        >
          مؤشرات الأداء الرئيسية
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              label: "متوسط وقت الاستجابة",
              value: "15 دقيقة",
              icon: <SpeedIcon size="lg" className="text-white" />,
              color: "from-yellow-400 to-orange-500",
            },
            {
              label: "معدل إتمام المشاريع",
              value: "98.5%",
              icon: <CheckIcon size="lg" className="text-white" />,
              color: "from-green-400 to-emerald-500",
            },
            {
              label: "عملاء جدد هذا الشهر",
              value: "147",
              icon: <UsersIcon size="lg" className="text-white" />,
              color: "from-blue-400 to-cyan-500",
            },
            {
              label: "متوسط التقييم",
              value: "4.9/5",
              icon: <StarIcon size="lg" className="text-white" />,
              color: "from-purple-400 to-pink-500",
            },
          ].map((metric, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-r ${metric.color} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                {metric.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600" dir="rtl">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </SoftUICard>
    </div>
  );
};

export default SoftUICharts;
