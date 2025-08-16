"use client";

import React from "react";
import { Sparkles, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FeaturedServicesBannerProps {
  services?: any[];
  className?: string;
}

const FeaturedServicesBanner: React.FC<FeaturedServicesBannerProps> = ({
  services: propServices,
  className = "",
}) => {
  // Filter featured services
  const featuredServices = propServices?.filter(service => service.featured) || [];
  
  if (featuredServices.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 bg-gradient-to-r from-amber-50 to-orange-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            الخدمات المميزة
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
            خدماتنا المميزة
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto" dir="rtl">
            اكتشف خدماتنا المميزة التي تم اختيارها خصيصاً لكم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.slice(0, 3).map((service, index) => (
            <div
              key={service.id || index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-amber-500"
            >
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-amber-100 text-amber-800">
                  <Star className="w-3 h-3 mr-1" />
                  مميزة
                </Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium mr-1">5.0</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2" dir="rtl">
                {service.name || service.title || "خدمة التنظيف"}
              </h3>

              <p className="text-gray-600 mb-4" dir="rtl">
                {service.description || "خدمة تنظيف احترافية بمعايير عالمية"}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-amber-600">
                  {service.price || "يبدأ من 150 ريال"}
                </div>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                  <ArrowRight className="w-4 h-4 mr-1" />
                  اطلب الآن
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="border-amber-500 text-amber-600 hover:bg-amber-50">
            عرض جميع الخدمات
            <ArrowRight className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServicesBanner;
