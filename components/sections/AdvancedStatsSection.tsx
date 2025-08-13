"use client";

import React from "react";
import { TrendingUp, Users, Award, Clock, Shield, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdvancedStatsSectionProps {
  className?: string;
}

const AdvancedStatsSection: React.FC<AdvancedStatsSectionProps> = ({ className = "" }) => {
  const stats = [
    {
      value: "6+",
      label: "سنوات الخبرة",
      icon: <Clock className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      description: "من التميز والإبداع"
    },
    {
      value: "2,850+",
      label: "مشروع مكتمل",
      icon: <Award className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      description: "بأ��لى معايير الجودة"
    },
    {
      value: "50+",
      label: "موظف متخصص",
      icon: <Users className="w-8 h-8" />,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      description: "مدربين ومؤهلين"
    },
    {
      value: "98.5%",
      label: "رضا العملاء",
      icon: <Star className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      description: "تقييم متميز"
    },
    {
      value: "24/7",
      label: "خدمة العملاء",
      icon: <Shield className="w-8 h-8" />,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      description: "دعم مستمر"
    },
    {
      value: "100%",
      label: "ضمان الجودة",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      description: "التزام كامل"
    }
  ];

  return (
    <section className={`py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" dir="rtl">
            أرقامنا تتحدث عن تميزنا
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" dir="rtl">
            نفخر بثقة عملائنا وإنجازاتنا المتميزة في مجال خدمات التنظيف المحترفة
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <CardContent className="p-8 text-center relative z-10">
                {/* Icon with gradient background */}
                <div className={`inline-flex p-4 rounded-2xl ${stat.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`}>
                    {stat.icon}
                  </div>
                </div>

                {/* Main stat value */}
                <div className="mb-4">
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2" dir="rtl">
                    {stat.label}
                  </h3>
                  <p className="text-gray-600 text-sm" dir="rtl">
                    {stat.description}
                  </p>
                </div>

                {/* Progress bar animation */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-6 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full transform transition-all duration-1000 delay-300 group-hover:w-full`}
                    style={{ width: '0%' }}
                    data-animate="true"
                  ></div>
                </div>
              </CardContent>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 font-medium" dir="rtl">
              نمو مستمر في الجودة والخدمة منذ 2018
            </span>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
    </section>
  );
};

export default AdvancedStatsSection;
