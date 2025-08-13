"use client";

import React from "react";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Home,
  Building,
  Sparkles,
  Droplet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PremiumServicesSectionProps {
  className?: string;
}

const PremiumServicesSection: React.FC<PremiumServicesSectionProps> = ({
  className = "",
}) => {
  const getServiceIcon = (iconType: string) => {
    const iconClass = "w-8 h-8";
    switch (iconType) {
      case "home":
        return <Home className={iconClass} />;
      case "office":
        return <Building className={iconClass} />;
      case "carpet":
        return <Star className={iconClass} />;
      case "sparkles":
        return <Sparkles className={iconClass} />;
      case "water":
        return <Droplet className={iconClass} />;
      case "shield":
        return <Shield className={iconClass} />;
      default:
        return <Star className={iconClass} />;
    }
  };

  const services = [
    {
      id: "home-cleaning",
      title: "تنظيف المنازل والفلل",
      description:
        "خدمة تنظيف شاملة ومتكاملة للمنازل والفلل مع ضمان الجودة والتميز",
      icon: "home",
      features: [
        "تنظيف عميق لجميع الغرف",
        "تعقيم شامل",
        "تنظيف النوافذ",
        "ترتيب وتنظيم",
      ],
      price: "ابتداء من 300 ريال",
      popular: true,
      gradient: "from-blue-600 to-cyan-500",
      bgPattern: "bg-blue-50",
    },
    {
      id: "office-cleaning",
      title: "تنظيف المكاتب والشركات",
      description: "حلول تنظيف احترافية ومخصصة للمكاتب والمباني التجارية",
      icon: "office",
      features: [
        "تنظيف يومي أو أسبوعي",
        "تعقيم أجهزة الكمبيوتر",
        "تنظيف السجاد",
        "إدارة النفايات",
      ],
      price: "عروض شهرية مميزة",
      popular: false,
      gradient: "from-emerald-600 to-teal-500",
      bgPattern: "bg-emerald-50",
    },
    {
      id: "carpet-cleaning",
      title: "تنظيف السجاد والستائر",
      description: "تنظيف وتعقيم متخصص للسجاد والستائر بأحدث التقنيات العالمية",
      icon: "carpet",
      features: [
        "تقنيات تنظيف متطورة",
        "إزالة البقع الصعبة",
        "تعقيم مضاد للبكتيريا",
        "تجفيف سريع",
      ],
      price: "حسب المساحة",
      popular: false,
      gradient: "from-purple-600 to-violet-500",
      bgPattern: "bg-purple-50",
    },
    {
      id: "marble-polishing",
      title: "جلي وتلميع الرخام",
      description: "خدمة متخصصة في جلي ��تلميع الرخام والأرضيات الحجرية",
      icon: "sparkles",
      features: ["جلي احترافي", "تلميع وحماية", "إصلاح الخدوش", "لمعان دائم"],
      price: "عروض موسمية",
      popular: false,
      gradient: "from-amber-600 to-orange-500",
      bgPattern: "bg-amber-50",
    },
    {
      id: "tank-cleaning",
      title: "تنظيف خزانات المياه",
      description: "تنظيف وتعقيم خزانات المياه وفقاً للمعايير الصحية العالمية",
      icon: "water",
      features: [
        "تنظيف وتعقيم شامل",
        "فحص جودة المياه",
        "شهادة صحية",
        "ضمان لمدة عام",
      ],
      price: "حسب حجم الخزان",
      popular: false,
      gradient: "from-sky-600 to-blue-500",
      bgPattern: "bg-sky-50",
    },
    {
      id: "pest-control",
      title: "مكافحة الحشرات",
      description: "خدمات متكاملة لمكافحة الحشرات والقوارض بمواد آمنة ومعتمدة",
      icon: "shield",
      features: [
        "مواد آمنة ومعتمدة",
        "متابعة دورية",
        "ضمان لمدة 6 أشهر",
        "استشارة مجانية",
      ],
      price: "باقا�� شاملة متنوعة",
      popular: false,
      gradient: "from-red-600 to-rose-500",
      bgPattern: "bg-red-50",
    },
  ];

  return (
    <section className={`py-20 relative overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium mb-4">
            <Star className="w-4 h-4" />
            خدماتنا المميزة
          </div>

          <h2
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            dir="rtl"
          >
            خدمات تنظيف شاملة
            <span className="block text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text">
              بمعايير عالمية
            </span>
          </h2>

          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            dir="rtl"
          >
            نقدم مجموعة شاملة ومتكاملة من خدمات التنظيف المحترفة مع ضمان الجودة
            والتميز في كل تفصيل
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/90 backdrop-blur-sm ${
                service.popular ? "ring-2 ring-blue-500/50" : ""
              }`}
            >
              {/* Popular badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    الأكثر طلباً
                  </Badge>
                </div>
              )}

              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              <CardContent className="p-8 relative z-10">
                {/* Service icon and title */}
                <div className="mb-6">
                  <div
                    className={`inline-flex p-4 rounded-2xl ${service.bgPattern} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div
                      className={`text-transparent bg-gradient-to-r ${service.gradient} bg-clip-text`}
                    >
                      {getServiceIcon(service.icon)}
                    </div>
                  </div>

                  <h3
                    className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300"
                    dir="rtl"
                  >
                    {service.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed" dir="rtl">
                    {service.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3"
                      dir="rtl"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-right">
                      <div
                        className="text-lg font-bold text-gray-900"
                        dir="rtl"
                      >
                        {service.price}
                      </div>
                      <div className="text-sm text-gray-500" dir="rtl">
                        شامل الضريبة
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    className={`w-full bg-gradient-to-r ${service.gradient} text-white hover:shadow-lg transform transition-all duration-300 group-hover:scale-105`}
                    size="lg"
                  >
                    <span dir="rtl">اطلب الخدمة الآن</span>
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </div>

                {/* Guarantee badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span dir="rtl">ضمان الجودة 100%</span>
                </div>
              </CardContent>

              {/* Decorative elements */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${service.gradient} opacity-10 rounded-bl-3xl`}
              ></div>
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,white_0%,transparent_50%)]"></div>
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_50%,white_0%,transparent_50%)]"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4" dir="rtl">
                هل تحتاج خدمة مخصصة؟
              </h3>
              <p
                className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                dir="rtl"
              >
                نقدم حلول تنظيف مخصصة تناسب احتياجاتك الخاصة مع استشارة مجانية
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4 shadow-xl"
                >
                  <Zap className="w-5 h-5 ml-2" />
                  استشارة مجانية الآن
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold px-8 py-4"
                >
                  عرض جميع الخدمات
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumServicesSection;
