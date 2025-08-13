"use client";

import React from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
  return (
    <section
      id="home"
      className={`bg-gradient-to-r from-blue-600 to-blue-800 text-white ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" dir="rtl">
            عالم النظافة جدة
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" dir="rtl">
            شريككم الموثوق لخدمات التنظيف المحترفة في جدة
          </p>
          <p className="text-lg mb-10 max-w-4xl mx-auto opacity-90" dir="rtl">
            نستخدم أحدث المعدات العالمية مع فريق من المتخصصين المدربين لضمان
            أعلى معايير النظافة والجودة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              size="lg"
            >
              احصل على عرض مجاني
            </Button>
            <Button 
              variant="outline"
              className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              size="lg"
            >
              <Phone className="w-5 h-5 inline ml-2" />
              اتصل الآن: 0500000000
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
