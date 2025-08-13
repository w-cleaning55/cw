"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useTranslation } from "../hooks/useTranslation";
import {
  Shield,
  Clock,
  Award,
  Zap,
  Users,
  Leaf,
  Star,
  CheckCircle,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
} from "lucide-react";

interface Feature {
  id: string;
  icon: React.ElementType;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  color: string;
  bgColor: string;
}

export default function FeaturesSection() {
  const { currentLanguage } = useTranslation();
  const isArabic = currentLanguage === "ar";

  const mainFeatures: Feature[] = [
    {
      id: "quality",
      icon: Award,
      title: "ISO 9001 Certified Quality",
      titleAr: "جودة معتمدة من الأيزو 9001",
      description:
        "Internationally certified quality management system ensuring excellence in every service we provide",
      descriptionAr:
        "نظام إدارة جودة معتمد دولياً يضمن التميز في كل خدمة نقدمها",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      id: "time",
      icon: Clock,
      title: "24/7 Emergency Service",
      titleAr: "خدمة طوارئ 24/7",
      description:
        "Round-the-clock availability for urgent cleaning needs with rapid response team",
      descriptionAr:
        "متاحون على مدار الساعة للاحتياجات الطارئة مع فريق استجابة سريع",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      id: "insurance",
      icon: Shield,
      title: "Fully Insured & Bonded",
      titleAr: "مؤمن ومكفول بالكامل",
      description:
        "Complete insurance coverage protecting your property and ensuring peace of mind",
      descriptionAr: "تغطية تأمينية شاملة تحمي ممتلكاتكم وتضمن راحة البال",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      id: "eco",
      icon: Leaf,
      title: "Eco-Friendly Products",
      titleAr: "منتجات صديقة للبيئة",
      description:
        "Safe, non-toxic cleaning products that protect your family and the environment",
      descriptionAr: "منتجات تنظيف آمنة وغير سامة تحمي عائلتكم والبيئة",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      id: "team",
      icon: Users,
      title: "Trained Professional Team",
      titleAr: "فريق محترف مدرب",
      description:
        "Highly skilled technicians with extensive training and experience in modern cleaning methods",
      descriptionAr:
        "فنيون ماهرون للغاية مع تدريب واسع وخبرة في طرق التنظيف الحديثة",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      id: "equipment",
      icon: Zap,
      title: "Advanced Equipment",
      titleAr: "معدات متطورة",
      description:
        "State-of-the-art American and European cleaning equipment for superior results",
      descriptionAr: "أحدث معدات التنظيف الأمريكية والأوروبية لنتائج فائقة",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
    },
  ];

  const serviceFeatures = [
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      titleAr: "جدولة مرنة",
      description: "Book at your convenience",
      descriptionAr: "احجز في الوقت المناسب لك",
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      titleAr: "خيارات دفع متعددة",
      description: "Cash, card, and digital payments",
      descriptionAr: "نقداً، بطاقة، ودفع رقمي",
    },
    {
      icon: Phone,
      title: "Customer Support",
      titleAr: "دعم العملاء",
      description: "Available when you need us",
      descriptionAr: "متاح عندما تحتاجنا",
    },
    {
      icon: MapPin,
      title: "Wide Coverage",
      titleAr: "تغطية واسعة",
      description: "Serving all Jeddah areas",
      descriptionAr: "نخدم جميع مناطق جدة",
    },
  ];

  return (
    <section className="section-padding bg-white dark:bg-gray-900">
      <div className="container container-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Star className="w-4 h-4 mr-2" />
            {isArabic ? "مميزاتنا" : "Why Choose Us"}
          </Badge>

          <h2 className="heading-primary mb-6">
            {isArabic ? (
              <>
                <span className="block">لماذا نحن الخيار</span>
                <span className="block text-primary">الأفضل في جدة</span>
              </>
            ) : (
              <>
                <span className="block">Why We're the</span>
                <span className="block text-primary">
                  Best Choice in Jeddah
                </span>
              </>
            )}
          </h2>

          <p className="text-xl text-professional max-w-3xl mx-auto">
            {isArabic
              ? "نحن ملتزمون بتقديم أعلى مستويات الخدمة والجودة، م��ا يجعلنا الخيار الأول لآلاف العملاء في جدة والمناطق المحيطة"
              : "We are committed to delivering the highest levels of service and quality, making us the first choice for thousands of customers in Jeddah and surrounding areas"}
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className={`group hover:shadow-xl transition-all duration-500 border-0 overflow-hidden hover:-translate-y-2 ${feature.bgColor}`}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`mx-auto w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {isArabic ? feature.titleAr : feature.title}
                  </h3>

                  <p className="text-professional leading-relaxed">
                    {isArabic ? feature.descriptionAr : feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Service Features */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-8 border border-primary/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isArabic
                ? "خدمة متكاملة وسهولة في التعامل"
                : "Complete Service & Easy Experience"}
            </h3>
            <p className="text-professional">
              {isArabic
                ? "نحن نؤمن بأن الخدمة الممتازة تتطلب أكثر من مجرد التنظيف الجيد"
                : "We believe that excellent service requires more than just good cleaning"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {isArabic ? feature.titleAr : feature.title}
                  </h4>
                  <p className="text-sm text-professional">
                    {isArabic ? feature.descriptionAr : feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 text-white">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-3xl font-bold mb-4">
              {isArabic ? "ضمان الرضا 100%" : "100% Satisfaction Guarantee"}
            </h3>

            <p className="text-xl opacity-90 mb-6">
              {isArabic
                ? "إذا لم تكن راضياً تماماً عن خدمتنا، سنعيد التنظيف مجاناً أو نسترد أموالك كاملة"
                : "If you're not completely satisfied with our service, we'll re-clean for free or refund your money"}
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {isArabic ? "ضمان مدى الحياة" : "Lifetime Guarantee"}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {isArabic ? "استرداد كامل" : "Full Refund"}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {isArabic ? "إعادة تنظيف مجانية" : "Free Re-cleaning"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
