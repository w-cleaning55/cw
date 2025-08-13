"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useTranslation } from "../hooks/useTranslation";
import {
  Sparkles,
  Home,
  Building2,
  Car,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Award,
  Users,
} from "lucide-react";

interface Service {
  id: string;
  icon: React.ElementType;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  price: string;
  priceAr: string;
  duration: string;
  durationAr: string;
  popular?: boolean;
  color: string;
}

export default function ServicesOverview() {
  const { currentLanguage } = useTranslation();
  const isArabic = currentLanguage === "ar";

  const services: Service[] = [
    {
      id: "deep-cleaning",
      icon: Sparkles,
      title: "Deep Cleaning",
      titleAr: "تنظيف عميق",
      description:
        "Complete deep cleaning for homes and offices with advanced equipment",
      descriptionAr: "تنظيف عميق شامل للمنازل والمكاتب بأحدث المعدات",
      features: [
        "Steam cleaning",
        "Sanitization",
        "Eco-friendly products",
        "24h guarantee",
      ],
      featuresAr: [
        "تنظيف بالبخار",
        "تعقيم",
        "منتجات صديقة للبيئة",
        "ضمان 24 ساعة",
      ],
      price: "From 299 SAR",
      priceAr: "من 299 ريال",
      duration: "2-4 hours",
      durationAr: "2-4 ساعات",
      popular: true,
      color: "text-blue-600",
    },
    {
      id: "carpet-cleaning",
      icon: Home,
      title: "Carpet & Upholstery",
      titleAr: "تنظيف السجاد والمفروشات",
      description:
        "Professional carpet and furniture cleaning with stain removal",
      descriptionAr: "تنظيف احترافي للسجاد والأثاث مع إزالة البقع",
      features: [
        "Stain removal",
        "Odor elimination",
        "Fabric protection",
        "Quick drying",
      ],
      featuresAr: [
        "إزالة البقع",
        "إزالة الروائح",
        "حماية الأقمشة",
        "تجفيف سريع",
      ],
      price: "From 199 SAR",
      priceAr: "من 199 ريال",
      duration: "1-3 hours",
      durationAr: "1-3 ساعات",
      color: "text-green-600",
    },
    {
      id: "office-cleaning",
      icon: Building2,
      title: "Commercial Cleaning",
      titleAr: "تنظيف تجاري",
      description: "Professional office and commercial space cleaning services",
      descriptionAr: "خدمات تنظيف احترافية للمكاتب والمساحات التجارية",
      features: [
        "Daily maintenance",
        "Night cleaning",
        "Flexible scheduling",
        "Trained staff",
      ],
      featuresAr: ["صيانة يومية", "تنظيف ليلي", "جدولة مرنة", "موظفون مدربون"],
      price: "From 499 SAR",
      priceAr: "من 499 ريال",
      duration: "2-6 hours",
      durationAr: "2-6 ساعات",
      color: "text-purple-600",
    },
    {
      id: "water-tank",
      icon: ShieldCheck,
      title: "Water Tank Cleaning",
      titleAr: "تنظيف خزانات المياه",
      description: "Complete water tank cleaning and sterilization service",
      descriptionAr: "خدمة تنظيف وتعقيم خزانات المياه الشاملة",
      features: [
        "Complete sterilization",
        "Quality testing",
        "Health certificate",
        "Annual maintenance",
      ],
      featuresAr: ["تعقيم شامل", "فحص الجودة", "شهادة صحية", "صيانة سنوية"],
      price: "From 399 SAR",
      priceAr: "من 399 ريال",
      duration: "3-5 hours",
      durationAr: "3-5 ساعات",
      color: "text-cyan-600",
    },
  ];

  const stats = [
    {
      number: "2500+",
      label: "Happy Customers",
      labelAr: "عميل سعيد",
      icon: Users,
    },
    {
      number: "98%",
      label: "Satisfaction Rate",
      labelAr: "معدل الرضا",
      icon: Star,
    },
    {
      number: "6+",
      label: "Years Experience",
      labelAr: "سنوات خبرة",
      icon: Award,
    },
    {
      number: "24/7",
      label: "Emergency Service",
      labelAr: "خدمة طوارئ",
      icon: Clock,
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/50">
      <div className="container container-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            {isArabic ? "خدماتنا" : "Our Services"}
          </Badge>

          <h2 className="heading-primary mb-6">
            {isArabic ? (
              <>
                <span className="block">خدمات تنظيف احترافية</span>
                <span className="block text-primary">لجميع احتياجاتك</span>
              </>
            ) : (
              <>
                <span className="block">Professional Cleaning Services</span>
                <span className="block text-primary">For All Your Needs</span>
              </>
            )}
          </h2>

          <p className="text-xl text-professional max-w-3xl mx-auto">
            {isArabic
              ? "نقدم مجموعة شاملة من خدمات التنظيف الاحترافية باستخدام أحدث التقنيات والمعدات العالمية لضمان أعلى مستويات النظافة والجودة"
              : "We provide a comprehensive range of professional cleaning services using the latest technologies and world-class equipment to ensure the highest levels of cleanliness and quality"}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-professional">
                  {isArabic ? stat.labelAr : stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.id}
                className={`group hover:shadow-xl transition-all duration-500 border-0 bg-white dark:bg-gray-800 overflow-hidden hover:-translate-y-2 ${
                  service.popular ? "ring-2 ring-primary/20" : ""
                }`}
              >
                <CardContent className="p-0">
                  {service.popular && (
                    <div className="bg-primary text-primary-foreground px-4 py-2 text-center text-sm font-medium">
                      {isArabic ? "الأكثر طلباً" : "Most Popular"}
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className={`p-3 rounded-2xl bg-primary/10 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className={`w-8 h-8 text-primary`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {isArabic ? service.titleAr : service.title}
                        </h3>
                        <p className="text-professional">
                          {isArabic
                            ? service.descriptionAr
                            : service.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-professional">
                          {isArabic ? "السعر:" : "Price:"}
                        </span>
                        <span className="font-semibold text-primary">
                          {isArabic ? service.priceAr : service.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-professional">
                          {isArabic ? "المدة:" : "Duration:"}
                        </span>
                        <span className="font-semibold">
                          {isArabic ? service.durationAr : service.duration}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {isArabic ? "المميزات:" : "Features:"}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {(isArabic ? service.featuresAr : service.features).map(
                          (feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-center gap-2 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-professional">
                                {feature}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90"
                        asChild
                      >
                        <Link href={`/services/${service.id}`}>
                          {isArabic ? "احجز الآن" : "Book Now"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        asChild
                      >
                        <Link href={`/services/${service.id}`}>
                          {isArabic ? "التفاصيل" : "Details"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isArabic ? "هل تحتاج خدمة مخصصة؟" : "Need a Custom Service?"}
            </h3>
            <p className="text-lg text-professional mb-6">
              {isArabic
                ? "تواصل معنا للحصول على استشارة مجانية وعرض أسعار مخصص لاحتياجاتك"
                : "Contact us for a free consultation and customized quote for your specific needs"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                asChild
              >
                <Link href="/contact">
                  {isArabic ? "احصل على عرض مجاني" : "Get Free Quote"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <Link href="/services">
                  {isArabic ? "عرض جميع الخدمات" : "View All Services"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
