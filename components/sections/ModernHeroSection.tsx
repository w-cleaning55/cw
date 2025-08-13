"use client";

import React from "react";
import { Phone, CheckCircle, MapPin, Star, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModernHeroSectionProps {
  className?: string;
}

const ModernHeroSection: React.FC<ModernHeroSectionProps> = ({ className = "" }) => {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Background with advanced gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-12">
          
          {/* Left Content */}
          <div className="text-white space-y-8">
            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-green-500/20 text-green-300 border-green-400/30 px-3 py-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                مرخص رسمياً
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 px-3 py-1">
                <Star className="w-4 h-4 mr-1" />
                تقييم 4.9/5
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 px-3 py-1">
                <Users className="w-4 h-4 mr-1" />
                +2850 عميل
              </Badge>
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight" dir="rtl">
                <span className="block text-white">عالم النظافة</span>
                <span className="block text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">
                  المحترف
                </span>
              </h1>
              
              <div className="flex items-center gap-2 text-cyan-300">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-medium">جدة، المملكة العربية السعودية</span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl" dir="rtl">
              شريككم الموثوق لخدمات التنظيف المحترفة مع ضمان الجودة والتميز في كل مشروع
            </p>

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              {[
                { icon: <Star className="w-5 h-5" />, text: "أحدث المعدات العالمية" },
                { icon: <Award className="w-5 h-5" />, text: "فريق متخصص ومدرب" },
                { icon: <Shield className="w-5 h-5" />, text: "ضمان شامل 100%" },
                { icon: <CheckCircle className="w-5 h-5" />, text: "خدمة سريعة ومضمونة" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-blue-100">
                  <div className="text-cyan-300">{feature.icon}</div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-8 py-4 text-lg shadow-xl shadow-cyan-500/25 transform transition-all duration-300 hover:scale-105"
              >
                احصل على عرض مجاني الآن
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-blue-900 font-bold px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
              >
                <Phone className="w-5 h-5 ml-2" />
                اتصل الآن: 0500000000
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">6+</div>
                <div className="text-sm text-blue-200">سنوات خبرة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">24/7</div>
                <div className="text-sm text-blue-200">خدمة العملاء</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">98.5%</div>
                <div className="text-sm text-blue-200">رضا العملاء</div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="relative">
            {/* Main illustration area */}
            <div className="relative">
              {/* Central card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center space-y-6">
                  {/* Service icons */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: "🏠", label: "المنازل" },
                      { icon: "🏢", label: "المكاتب" },
                      { icon: "🧽", label: "السجاد" },
                      { icon: "✨", label: "الرخام" },
                      { icon: "💧", label: "الخزانات" },
                      { icon: "🛡️", label: "الحشرات" }
                    ].map((service, index) => (
                      <div key={index} className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                        <div className="text-3xl mb-2">{service.icon}</div>
                        <div className="text-xs text-white font-medium">{service.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Rating display */}
                  <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div className="text-white font-bold text-lg">4.9/5</div>
                    <div className="text-blue-200 text-sm">تقييم من +150 عميل</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                <Award className="w-6 h-6" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-cyan-500 text-white p-3 rounded-full shadow-lg animate-pulse">
                <CheckCircle className="w-6 h-6" />
              </div>

              {/* Achievement badges */}
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                <div className="bg-white rounded-lg p-4 shadow-xl border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2850+</div>
                    <div className="text-sm text-gray-600">مشروع مكتمل</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 top-1/4">
                <div className="bg-white rounded-lg p-4 shadow-xl border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600">ضمان الجودة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                fill="white" fillOpacity="1"/>
        </svg>
      </div>
    </section>
  );
};

export default ModernHeroSection;
