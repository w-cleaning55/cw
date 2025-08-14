"use client";

import React from "react";
import { Users, Award, Clock, Shield, CheckCircle, Star } from "lucide-react";

export default function ProfessionalStatsSection() {
  const stats = [
    {
      icon: Users,
      number: "2850+",
      label: "عميل راضي",
      description: "عملاء حصلوا على خدماتنا المتميزة",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      icon: Award,
      number: "10+",
      label: "سنوات خبرة",
      description: "في مجال خدمات التنظيف المحترفة",
      color: "text-green-700",
      bgColor: "bg-green-50",
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "تقييم العملاء",
      description: "متوسط تقييمات عملائنا الكرام",
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
    },
    {
      icon: CheckCircle,
      number: "100%",
      label: "ضمان الجودة",
      description: "نضمن رضاكم عن خدماتنا",
      color: "text-purple-700",
      bgColor: "bg-purple-50",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "ضمان شامل",
      description: "نضمن جودة العمل 100%",
    },
    {
      icon: Clock,
      title: "خدمة سريعة",
      description: "استجابة فورية لطلباتكم",
    },
    {
      icon: Award,
      title: "جودة معتمدة",
      description: "معايير عالمية في التنظيف",
    },
    {
      icon: Users,
      title: "فريق محترف",
      description: "مدربون على أعلى مستوى",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            أرقام تتحدث عن تميزنا
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نفخر بالثقة التي وضعها عملاؤنا فينا وبالإنجازات التي حققناها معاً
            عبر السنوات
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow duration-200"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 mx-auto mb-6 ${stat.bgColor} rounded-full flex items-center justify-center`}
              >
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>

              {/* Number */}
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>

              {/* Label */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              لماذا نحن الخيار الأمثل؟
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نقدم خدمات تنظيف متكاملة تلبي جميع احتياجاتكم بأعلى معايير الجودة
              والاحترافية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-blue-700" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-blue-700 text-white rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              جاهزون لخدمتكم على مدار الساعة
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              احصلوا على استشارة مجانية وعرض سعر مخصص لاحتياجاتكم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition-colors duration-200">
                احجز موعد مجاني
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-lg font-semibold transition-colors duration-200">
                تواصل واتساب
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
