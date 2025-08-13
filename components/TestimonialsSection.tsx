"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useTranslation } from "../hooks/useTranslation";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle,
  Play,
  Heart,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  rating: number;
  review: string;
  reviewAr: string;
  service: string;
  serviceAr: string;
  date: string;
  avatar: string;
  verified: boolean;
  featured?: boolean;
}

export default function TestimonialsSection() {
  const { currentLanguage } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const isArabic = currentLanguage === "ar";

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Ahmad Al-Hassan",
      nameAr: "أحمد الحسن",
      location: "Al-Zahra District, Jeddah",
      locationAr: "حي الزهراء، جدة",
      rating: 5,
      review:
        "Exceptional service! The team was professional, punctual, and used eco-friendly products. They completely transformed our office space. I highly recommend them to any business.",
      reviewAr:
        "خدمة استثنائية! كان الفريق محترفاً ودقيقاً في المواعيد واستخدم منتجات صديقة للبيئة. لقد حولوا مساحة مكتبنا بالكامل. أنصح بهم بشدة لأي شركة.",
      service: "Deep Office Cleaning",
      serviceAr: "تنظيف عميق للمكاتب",
      date: "2024-01-15",
      avatar: "👨‍💼",
      verified: true,
      featured: true,
    },
    {
      id: "2",
      name: "Fatima Al-Zahra",
      nameAr: "فاطمة الزهراء",
      location: "Al-Rawdah District, Jeddah",
      locationAr: "حي الروضة، جدة",
      rating: 5,
      review:
        "Amazing carpet cleaning service! My Persian rug looks brand new. The technicians were knowledgeable and careful with my precious carpet. Will definitely use their service again.",
      reviewAr:
        "خدمة تنظيف سجاد مذهلة! سجادي الفارسي يبدو كأنه جديد. كان الفنيون ذوي معرفة وحذرين مع سجادي الثمين. سأستخدم الخدمة مرة أخرى بالتأكيد.",
      service: "Carpet & Upholstery Cleaning",
      serviceAr: "تنظيف السجاد والمفروشات",
      date: "2024-01-10",
      avatar: "👩‍🏫",
      verified: true,
    },
    {
      id: "3",
      name: "Mohammed Al-Qarni",
      nameAr: "محمد القرني",
      location: "Al-Salamah District, Jeddah",
      locationAr: "حي السلامة، جدة",
      rating: 5,
      review:
        "Excellent water tank cleaning service. They provided detailed before and after reports with photos. The water quality improved significantly. Very transparent and professional.",
      reviewAr:
        "خدمة تنظيف خزانات المياه رائعة. قدموا تقارير مفصلة قبل وبعد مع الصور. تحسنت جودة المياه بشكل كبير. شفافين ومحترفين جداً.",
      service: "Water Tank Cleaning",
      serviceAr: "تنظيف خزانات المياه",
      date: "2024-01-05",
      avatar: "👨‍🔧",
      verified: true,
    },
    {
      id: "4",
      name: "Sarah Al-Mutairi",
      nameAr: "سارة المطيري",
      location: "Al-Andalus District, Jeddah",
      locationAr: "حي الأندلس، جدة",
      rating: 5,
      review:
        "Outstanding villa deep cleaning! Every corner was spotless. The team worked efficiently and respected our home. The marble polishing was particularly impressive.",
      reviewAr:
        "تنظيف عميق للفيلا رائع! كل زاوية كانت نظيفة. عمل الفريق بكفاءة واحترم منزلنا. جلي الرخام كان مثيراً للإعجاب بشكل خاص.",
      service: "Villa Deep Cleaning",
      serviceAr: "تنظيف عميق للفلل",
      date: "2023-12-28",
      avatar: "👩‍💼",
      verified: true,
    },
    {
      id: "5",
      name: "Khalid Al-Ghamdi",
      nameAr: "خالد الغامدي",
      location: "Al-Faisaliah District, Jeddah",
      locationAr: "حي الفيصلية، جدة",
      rating: 5,
      review:
        "Best pest control service in the area! They completely resolved our ant problem and provided preventive measures. Great follow-up service too.",
      reviewAr:
        "أفضل خدمة مكافحة آفات في المنطقة! قضوا على مشكلة النمل لدينا تماماً وقدموا تدابير وقائية. خدمة متابعة رائعة أيضاً.",
      service: "Pest Control",
      serviceAr: "مكافحة الآفات",
      date: "2023-12-20",
      avatar: "👨‍🌾",
      verified: true,
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/50">
      <div className="container container-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Heart className="w-4 h-4 mr-2" />
            {isArabic ? "آراء العملاء" : "Customer Reviews"}
          </Badge>

          <h2 className="heading-primary mb-6">
            {isArabic ? (
              <>
                <span className="block">ماذا يقول عملاؤنا</span>
                <span className="block text-primary">عن خدماتنا</span>
              </>
            ) : (
              <>
                <span className="block">What Our Customers</span>
                <span className="block text-primary">Say About Us</span>
              </>
            )}
          </h2>

          <p className="text-xl text-professional max-w-3xl mx-auto">
            {isArabic
              ? "اكتشف لماذا يختار آلاف العملاء خدماتنا ولماذا يثقون بنا لتنظيف مساحاتهم الثمينة"
              : "Discover why thousands of customers choose our services and trust us with their precious spaces"}
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>

                {/* Quote Icon */}
                <div className="absolute top-6 left-6 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Quote className="w-6 h-6 text-primary" />
                </div>

                {currentTestimonial.featured && (
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Star className="w-3 h-3 mr-1" />
                      {isArabic ? "تقييم مميز" : "Featured"}
                    </Badge>
                  </div>
                )}

                <div className="relative p-8 md:p-12">
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Customer Info */}
                    <div className="text-center md:text-left">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto md:mx-0">
                        {currentTestimonial.avatar}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {isArabic
                          ? currentTestimonial.nameAr
                          : currentTestimonial.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-professional mb-2 justify-center md:justify-start">
                        <MapPin className="w-4 h-4" />
                        {isArabic
                          ? currentTestimonial.locationAr
                          : currentTestimonial.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-professional justify-center md:justify-start">
                        <Calendar className="w-4 h-4" />
                        {currentTestimonial.date}
                      </div>
                      {currentTestimonial.verified && (
                        <div className="flex items-center gap-2 text-sm text-green-600 mt-2 justify-center md:justify-start">
                          <CheckCircle className="w-4 h-4" />
                          {isArabic ? "عميل موثق" : "Verified Customer"}
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-4">
                        {renderStars(currentTestimonial.rating)}
                        <span className="text-sm text-professional ml-2">
                          ({currentTestimonial.rating}/5)
                        </span>
                      </div>

                      <blockquote className="text-lg text-gray-900 dark:text-white leading-relaxed mb-4 italic">
                        "
                        {isArabic
                          ? currentTestimonial.reviewAr
                          : currentTestimonial.review}
                        "
                      </blockquote>

                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Badge variant="outline" className="border-primary/20">
                          {isArabic
                            ? currentTestimonial.serviceAr
                            : currentTestimonial.service}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={prevTestimonial}
            className="w-10 h-10 p-0 rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-6"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextTestimonial}
            className="w-10 h-10 p-0 rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Auto-play Control */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-sm text-professional"
          >
            {isAutoPlaying ? (
              <>
                {isArabic ? (
                  <>
                    <span>إيقاف التشغيل التلقائي</span>
                    <Play className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    <span>Pause Auto-play</span>
                  </>
                )}
              </>
            ) : (
              <>
                {isArabic ? (
                  <>
                    <span>تشغيل تلقائي</span>
                    <Play className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    <span>Resume Auto-play</span>
                  </>
                )}
              </>
            )}
          </Button>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isArabic
                ? "انضم إلى عملائنا السعداء"
                : "Join Our Happy Customers"}
            </h3>
            <p className="text-lg text-professional mb-6">
              {isArabic
                ? "انضم إلى آلاف العملاء الراضين واكتشف لماذا نحن الأفضل في مجال خدمات التنظيف"
                : "Join thousands of satisfied customers and discover why we're the best in cleaning services"}
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {isArabic ? "احجز خدمتك الآن" : "Book Your Service Now"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
