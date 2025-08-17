import React from "react";
import type { Metadata } from "next";
import PremiumServicesSection from "@/components/sections/PremiumServicesSection";
import ContactSection from "@/components/sections/ContactSection";
import { SEO_CONFIG, SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "خدماتنا - عالم النظافة جدة",
  description: "نقدم مجموعة شاملة من خدمات التنظيف المحترفة: تنظيف المنازل، المكاتب، السجاد، الرخام، خزانات المياه، ومكافحة الحشرات.",
  openGraph: {
    title: "خدماتنا - عالم النظافة جدة",
    description: "خدمات تنظيف محترفة شاملة للمنازل والمكاتب والمنشآت التجارية",
    url: "https://www.cw.com.sa/services",
    type: "website",
  },
  alternates: {
    canonical: "https://www.cw.com.sa/services",
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" dir="rtl">
            خدماتنا المميزة
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed" dir="rtl">
            حلول تنظيف مهنية شاملة لجميع احتياجاتك في جدة
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
              خدمات تنظيف شاملة ومتخصصة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" dir="rtl">
              نقدم مجموعة واسعة من خدمات التنظيف المحترفة باستخدام أحدث المعدات والتقنيات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3" dir="rtl">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6" dir="rtl">
                    {service.description}
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    احصل على عرض سعر
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services */}
      <PremiumServicesSection />

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
              باقات أسعار شفافة ومنافسة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" dir="rtl">
              أسعار عادلة وشفافة مع ضمان الجودة والتميز في الخدمة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Package */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center hover:border-blue-500 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4" dir="rtl">الباقة الأساسية</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                150 ريال
                <span className="text-lg text-gray-500">/شقة</span>
              </div>
              <ul className="space-y-3 mb-8 text-right" dir="rtl">
                <li>✓ تنظيف الغرف الرئيسية</li>
                <li>✓ تنظيف المطبخ</li>
                <li>✓ تنظيف الحمامات</li>
                <li>✓ تنظيف الأرضيات</li>
                <li>✓ تنظيف النوافذ</li>
              </ul>
              <button className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                احجز الآن
              </button>
            </div>

            {/* Standard Package */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-8 text-center relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  الأكثر طلباً
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4" dir="rtl">الباقة القياسية</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                250 ريال
                <span className="text-lg text-gray-500">/فيلا</span>
              </div>
              <ul className="space-y-3 mb-8 text-right" dir="rtl">
                <li>✓ كل ما في الباقة الأساسية</li>
                <li>✓ تنظيف السجاد والستائر</li>
                <li>✓ تنظيف الممرات</li>
                <li>✓ تنظيف الأثاث</li>
                <li>✓ تنظيف المكيفات</li>
                <li>✓ تنظيف المطبخ بالكامل</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                احجز الآن
              </button>
            </div>

            {/* Premium Package */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center hover:border-green-500 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4" dir="rtl">الباقة المميزة</h3>
              <div className="text-4xl font-bold text-green-600 mb-6">
                400 ريال
                <span className="text-lg text-gray-500">/فيلا</span>
              </div>
              <ul className="space-y-3 mb-8 text-right" dir="rtl">
                <li>✓ كل ما في الباقة القياسية</li>
                <li>✓ تنظيف عميق للسجاد</li>
                <li>✓ جلي وتلميع الرخام</li>
                <li>✓ تنظيف خزانات المياه</li>
                <li>✓ تنظيف المسبح</li>
                <li>✓ مكافحة الحشرات</li>
                <li>✓ ضمان شامل 30 يوم</li>
              </ul>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200">
                احجز الآن
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
              لماذا تختار عالم النظافة؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🛡️",
                title: "ضمان الجودة",
                description: "ضمان شامل على جميع خدماتنا مع إمكانية الإعادة مجاناً",
              },
              {
                icon: "⚡",
                title: "سرعة الأداء",
                description: "فريق محترف ينجز المهام في الوقت المحدد بأعلى معايير الجودة",
              },
              {
                icon: "🔧",
                title: "معدات حديثة",
                description: "استخدام أحدث المعدات والتقنيات الأمريكية والأوروبية",
              },
              {
                icon: "👥",
                title: "فريق متخصص",
                description: "عمالة مدربة وذات خبرة في جميع أنواع التنظيف",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3" dir="rtl">
                  {feature.title}
                </h3>
                <p className="text-gray-600" dir="rtl">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <ContactSection />
    </div>
  );
}
