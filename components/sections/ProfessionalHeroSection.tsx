"use client";

import React from "react";
import { Shield, Award, Users, CheckCircle, Star, Phone } from "lucide-react";

export default function ProfessionalHeroSection() {
  return (
    <section className="relative bg-white">
      {/* Clean geometric background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>

      {/* Content */}
      <div className="relative container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          {/* Text Content */}
          <div className="text-right space-y-8">
            {/* Professional Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>خدمات تنظيف معتمدة ومرخصة</span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                عالم النظافة
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-blue-700 mb-6">
                شريكك الموثوق في خدمات التنظيف المحترفة
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              نقدم خدمات تنظيف شاملة للمنازل والمكاتب والمنشآت التجارية بأعلى
              معايير الجودة والاحترافية، مع فريق مدرب وخبرة تزيد عن 10 سنوات في
              المملكة العربية السعودية.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "ضمان شامل على جميع الخدمات",
                "فريق محترف ومدر��",
                "مواد تنظيف آمنة ومعتمدة",
                "خدمة عملاء 24/7",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                احجز موعد مجاني
              </button>
              <button className="border-2 border-gray-300 hover:border-blue-700 hover:text-blue-700 text-gray-700 px-8 py-4 rounded-lg font-semibold transition-colors duration-200">
                تواصل معنا
              </button>
            </div>
          </div>

          {/* Professional Stats Card */}
          <div className="lg:text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8">
              {/* Company Badge */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  شركة معتمدة ومرخصة
                </h3>
                <p className="text-gray-600 mt-2">
                  خدمات تنظيف احترافية منذ 2014
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-700">2850+</div>
                  <div className="text-sm text-gray-600 font-medium">
                    عميل راضي
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-yellow-600">
                      4.9
                    </span>
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    تقييم العملاء
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600 font-medium">
                    ضمان الجودة
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-center gap-6 text-gray-500">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      معتمد من وزارة التجارة
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700 mb-1">
                    +966 50 000 0000
                  </div>
                  <div className="text-sm text-gray-600">
                    للاستفسار والحجز المباشر
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="relative bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-medium">مؤمن ومرخص</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="font-medium">فريق محترف</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="font-medium">جودة معتمدة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium">ضمان شامل</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
