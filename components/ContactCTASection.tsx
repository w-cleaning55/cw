"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useTranslation } from "../hooks/useTranslation";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Calendar,
  Headphones,
  Zap,
  Shield,
  CheckCircle,
} from "lucide-react";

interface ContactMethod {
  id: string;
  icon: React.ElementType;
  title: string;
  titleAr: string;
  value: string;
  valueAr: string;
  description: string;
  descriptionAr: string;
  action: string;
  color: string;
  bgColor: string;
  popular?: boolean;
}

export default function ContactCTASection() {
  const { currentLanguage } = useTranslation();
  const isArabic = currentLanguage === "ar";

  const contactMethods: ContactMethod[] = [
    {
      id: "whatsapp",
      icon: MessageCircle,
      title: "WhatsApp Chat",
      titleAr: "دردشة واتساب",
      value: "+966 50 123 4567",
      valueAr: "+966 50 123 4567",
      description: "Get instant response and quick booking",
      descriptionAr: "احصل على رد فوري وحجز سريع",
      action: "https://wa.me/966501234567",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      popular: true,
    },
    {
      id: "phone",
      icon: Phone,
      title: "Call Us Now",
      titleAr: "اتصل بنا الآن",
      value: "+966 12 654 3210",
      valueAr: "+966 12 654 3210",
      description: "Speak directly with our experts",
      descriptionAr: "تحدث مباشرة مع خبرائنا",
      action: "tel:+966126543210",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      id: "email",
      icon: Mail,
      title: "Email Us",
      titleAr: "راسلنا بالبريد",
      value: "info@cleaningworld.sa",
      valueAr: "info@cleaningworld.sa",
      description: "Send detailed inquiry and get quote",
      descriptionAr: "أرسل استفساراً مفصلاً واحصل على عرض",
      action: "mailto:info@cleaningworld.sa",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      id: "booking",
      icon: Calendar,
      title: "Online Booking",
      titleAr: "حجز أونلاين",
      value: "Book Online",
      valueAr: "احجز أونلاين",
      description: "Schedule service at your convenience",
      descriptionAr: "جدول الخدمة في الوقت المناسب لك",
      action: "/admin",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
  ];

  const businessInfo = {
    hours: {
      weekdays: "Saturday - Thursday: 7:00 AM - 10:00 PM",
      weekdaysAr: "السبت - الخميس: 7:00 ص - 10:00 م",
      friday: "Friday: 2:00 PM - 10:00 PM",
      fridayAr: "الجمعة: 2:00 م - 10:00 م",
      emergency: "24/7 Emergency Service",
      emergencyAr: "خدمة طوارئ 24/7",
    },
    location: {
      address: "Prince Sultan Street, Al-Zahra District, Jeddah",
      addressAr: "شارع الأمير سلطان، حي الزهراء، جدة",
      coverage: "Serving all Jeddah areas",
      coverageAr: "نخدم جميع مناطق جدة",
    },
  };

  const guarantees = [
    {
      icon: Shield,
      title: "Satisfaction Guaranteed",
      titleAr: "ضمان الرضا",
      description: "100% money back if not satisfied",
      descriptionAr: "استرداد كامل إذا لم تكن راضياً",
    },
    {
      icon: Zap,
      title: "Quick Response",
      titleAr: "استجابة سريعة",
      description: "Same day service available",
      descriptionAr: "خدمة في نفس اليوم متاحة",
    },
    {
      icon: Star,
      title: "Certified Quality",
      titleAr: "جودة معتمدة",
      description: "ISO 9001 certified service",
      descriptionAr: "خدمة معتمدة ISO 9001",
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-green-600 to-blue-600"></div>
        {/* Animated dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container container-padding relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-white/10 text-white border-white/20">
            <Headphones className="w-4 h-4 mr-2" />
            {isArabic ? "تواصل معنا" : "Get In Touch"}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {isArabic ? (
              <>
                <span className="block">جاهزون لخدمتك</span>
                <span className="block bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  على مدار الساعة
                </span>
              </>
            ) : (
              <>
                <span className="block">Ready to Serve You</span>
                <span className="block bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  24/7
                </span>
              </>
            )}
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {isArabic
              ? "احصل على خدمة تنظيف احترافية فورية. فريقنا مستعد للرد على استفساراتك وتقديم أفضل الحلول لاحتياجاتك"
              : "Get professional cleaning service instantly. Our team is ready to answer your inquiries and provide the best solutions for your needs"}
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Card
                key={method.id}
                className={`group hover:scale-105 transition-all duration-300 border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white relative overflow-hidden ${
                  method.popular ? "ring-2 ring-green-400" : ""
                }`}
              >
                {method.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-green-400 text-green-900 text-xs font-bold py-1 text-center">
                    {isArabic ? "الأكثر استخداماً" : "Most Popular"}
                  </div>
                )}

                <CardContent className="p-6 text-center">
                  <div
                    className={`mx-auto w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${method.color}`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-lg font-bold mb-2">
                    {isArabic ? method.titleAr : method.title}
                  </h3>

                  <p className="text-gray-300 text-sm mb-3">
                    {isArabic ? method.descriptionAr : method.description}
                  </p>

                  <div className="text-white font-medium mb-4">
                    {isArabic ? method.valueAr : method.value}
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-white/30 text-white hover:bg-white hover:text-gray-900"
                  >
                    {method.action.startsWith("http") ||
                    method.action.startsWith("tel:") ||
                    method.action.startsWith("mailto:") ? (
                      <a
                        href={method.action}
                        target={
                          method.action.startsWith("http") ? "_blank" : "_self"
                        }
                        rel={
                          method.action.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {isArabic ? "تواصل الآن" : "Contact Now"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    ) : (
                      <Link href={method.action}>
                        {isArabic ? "تواصل الآن" : "Contact Now"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Business Information */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Working Hours */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold">
                  {isArabic ? "ساعات العمل" : "Working Hours"}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-300">
                    {isArabic ? "السبت - الخميس" : "Saturday - Thursday"}
                  </span>
                  <span className="font-medium">
                    {isArabic ? "7:00 ص - 10:00 م" : "7:00 AM - 10:00 PM"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-gray-300">
                    {isArabic ? "الجمعة" : "Friday"}
                  </span>
                  <span className="font-medium">
                    {isArabic ? "2:00 م - 10:00 م" : "2:00 PM - 10:00 PM"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-green-400 font-medium">
                    {isArabic ? "خدمة الطوارئ" : "Emergency Service"}
                  </span>
                  <span className="text-green-400 font-bold">24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-8 h-8 text-green-400" />
                <h3 className="text-2xl font-bold">
                  {isArabic ? "موقعنا" : "Our Location"}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-300 mb-2">
                    {isArabic ? "العنوان:" : "Address:"}
                  </h4>
                  <p className="text-white">
                    {isArabic
                      ? businessInfo.location.addressAr
                      : businessInfo.location.address}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-300 mb-2">
                    {isArabic ? "مناطق الخدمة:" : "Service Coverage:"}
                  </h4>
                  <p className="text-white">
                    {isArabic
                      ? businessInfo.location.coverageAr
                      : businessInfo.location.coverage}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white hover:text-gray-900 mt-4"
                  asChild
                >
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {isArabic ? "عرض على الخريطة" : "View on Map"}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guarantees */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <div
                key={index}
                className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-lg font-bold mb-2">
                  {isArabic ? guarantee.titleAr : guarantee.title}
                </h4>
                <p className="text-gray-300 text-sm">
                  {isArabic ? guarantee.descriptionAr : guarantee.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-3xl p-8 border border-white/20 backdrop-blur-sm">
            <h3 className="text-3xl font-bold mb-4">
              {isArabic
                ? "ابدأ رحلة النظافة معنا اليوم"
                : "Start Your Cleaning Journey Today"}
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              {isArabic
                ? "احصل على عرض أسعار مجاني خلال 15 دقيقة واكتشف لماذا نحن ��لخيار الأول في جدة"
                : "Get a free quote within 15 minutes and discover why we're the first choice in Jeddah"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
                asChild
              >
                <a
                  href="https://wa.me/966501234567"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isArabic ? "واتساب مجاني" : "Free WhatsApp"}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-gray-900"
                asChild
              >
                <a href="tel:+966126543210">
                  <Phone className="w-5 h-5 mr-2" />
                  {isArabic ? "اتصال مباشر" : "Call Direct"}
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {isArabic ? "استشارة مجانية" : "Free Consultation"}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {isArabic ? "رد فوري" : "Instant Response"}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {isArabic ? "بدون التزام" : "No Obligation"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
