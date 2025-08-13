"use client";

import React from "react";
import { Shield, Clock, Award } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => (
  <div className="text-center">
    <div className="bg-blue-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
      {feature.icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3" dir="rtl">
      {feature.title}
    </h3>
    <p className="text-gray-600" dir="rtl">
      {feature.description}
    </p>
  </div>
);

interface FeaturesSectionProps {
  className?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ className = "" }) => {
  const features: Feature[] = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "ضمان 100%",
      description: "ضمان شامل على جميع خدماتنا مع إمكانية الإعادة في حالة عدم الرضا",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "خدمة سريعة",
      description: "فريق عمل محترف ينجز المهام في الوقت المحدد بأعلى معايير الجودة",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "جودة عالية",
      description: "استخدام أفضل المعدات والمواد الصديقة للبيئة والآمنة على الصحة",
    },
  ];

  return (
    <section className={`py-20 bg-blue-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
            لماذا نحن الخيار الأفضل؟
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto" dir="rtl">
            نتميز بالجودة والمصداقية في تقديم خدمات التنظيف لأكثر من 6 سنوات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
