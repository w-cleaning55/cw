"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useTranslation } from "../hooks/useTranslation";
import { useNumberFormatter } from "../utils/numberFormatter";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  User,
  MapPin,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Award,
  Verified,
  TrendingUp,
  Heart,
} from "lucide-react";

const UserAvatar: React.FC<{ variant?: string }> = ({ variant = "default" }) => {
  const colors = {
    default: "bg-blue-500",
    business: "bg-purple-500",
    teacher: "bg-green-500",
    worker: "bg-orange-500",
    manager: "bg-indigo-500",
    farmer: "bg-emerald-500"
  };

  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${colors[variant as keyof typeof colors] || colors.default}`}>
      <User className="w-6 h-6" />
    </div>
  );
};

interface Review {
  id: string;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  rating: number;
  review: string;
  reviewAr: string;
  date: string;
  service: string;
  serviceAr: string;
  avatar: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  videoTestimonial?: string;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { stars: number; count: number; percentage: number }[];
}

export default function CustomerReviews() {
  const { t, currentLanguage } = useTranslation();
  const numberFormatter = useNumberFormatter(currentLanguage as "en" | "ar");
  const [currentReview, setCurrentReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isArabic = currentLanguage === "ar";

  const reviews: Review[] = [
    {
      id: "1",
      name: "Ahmed Al-Rashid",
      nameAr: "أحمد الراشد",
      location: "Riyadh, Saudi Arabia",
      locationAr: "الرياض، المملكة العربية السعودية",
      rating: 5,
      review:
        "Exceptional service! They transformed our office space completely. The team was professional, punctual, and used eco-friendly products. Highly recommended for any business.",
      reviewAr:
        "خدمة استثنائية! لقد حولوا مساحة مكتبنا بالكامل. كان الفريق محترفاً ودقيقاً في المواعيد واستخدم منتجات صديقة للبيئة. أنصح به بشدة لأي شركة.",
      date: "2024-01-15",
      service: "Office Deep Cleaning",
      serviceAr: "تنظيف عميق ��لمكاتب",
      avatar: "business",
      verified: true,
      helpful: 23,
      images: ["office1.jpg", "office2.jpg"],
    },
    {
      id: "2",
      name: "Fatima Al-Zahra",
      nameAr: "فاطمة الزهراء",
      location: "Jeddah, Saudi Arabia",
      locationAr: "جدة، المملكة العربية السعودية",
      rating: 5,
      review:
        "Amazing carpet cleaning service! My Persian rugs look like new. The technicians were knowledgeable and careful with my expensive carpets. Will definitely use again.",
      reviewAr:
        "خدمة تنظيف سجاد مذهلة! سجادي الفارسي يبدو كأنه جديد. كان الفنيون ذوي معرفة وحذرين مع سجادي الثمين. سأست��دم الخدمة مرة أخرى بالتأكيد.",
      date: "2024-01-10",
      service: "Carpet & Upholstery Cleaning",
      serviceAr: "تنظيف السجاد والمفروشات",
      avatar: "teacher",
      verified: true,
      helpful: 31,
      videoTestimonial: "testimonial1.mp4",
    },
    {
      id: "3",
      name: "Mohammad Al-Qassim",
      nameAr: "محمد القاسم",
      location: "Dammam, Saudi Arabia",
      locationAr: "الدمام، المملكة العربية السعودية",
      rating: 5,
      review:
        "Outstanding water tank cleaning service. They provided detailed before and after reports with photos. The water quality improved significantly. Very transparent and professional.",
      reviewAr:
        "خدمة تنظيف خزانات المياه رائعة. قدموا تقارير مفصلة قبل وبعد مع الصور. تحسنت جودة المياه بشكل كبير. شفافين ومحترفين جداً.",
      date: "2024-01-05",
      service: "Water Tank Cleaning",
      serviceAr: "تنظيف خزانات المياه",
      avatar: "worker",
      verified: true,
      helpful: 18,
      images: ["tank1.jpg", "tank2.jpg", "tank3.jpg"],
    },
    {
      id: "4",
      name: "Sarah Al-Mutairi",
      nameAr: "سارة المطيري",
      location: "Riyadh, Saudi Arabia",
      locationAr: "الرياض، المملكة العربية السعودية",
      rating: 5,
      review:
        "Incredible villa deep cleaning! Every corner was spotless. The team worked efficiently and respected our home. The marble polishing was particularly impressive.",
      reviewAr:
        "تنظيف عميق للف��لا رائع! كل زاوية كانت نظيفة. عمل الفريق بكفاءة واحترم منزلنا. جلي الرخام كان مثيراً للإعجاب بشكل خاص.",
      date: "2023-12-28",
      service: "Villa Deep Cleaning",
      serviceAr: "تنظيف عميق للفلل",
      avatar: "manager",
      verified: true,
      helpful: 27,
    },
    {
      id: "5",
      name: "Khalid Al-Harthi",
      nameAr: "خالد الحارثي",
      location: "Mecca, Saudi Arabia",
      locationAr: "مكة المكرمة، المملكة العربية السعودية",
      rating: 5,
      review:
        "Best pest control service in the region! They eliminated our ant problem completely and provided preventive measures. Great follow-up service too.",
      reviewAr:
        "أفضل خدمة مكافحة آفات في المنطقة! ق��وا على مشكلة النمل لدينا تماماً وقدموا تداب��ر وقائية. خدمة متابعة رائعة أيضاً.",
      date: "2023-12-20",
      service: "Pest Control",
      serviceAr: "مكافحة الآفات",
      avatar: "farmer",
      verified: true,
      helpful: 15,
    },
  ];

  const stats: ReviewStats = {
    totalReviews: 1247,
    averageRating: 4.9,
    ratingDistribution: [
      { stars: 5, count: 1089, percentage: 87.3 },
      { stars: 4, count: 127, percentage: 10.2 },
      { stars: 3, count: 23, percentage: 1.8 },
      { stars: 2, count: 5, percentage: 0.4 },
      { stars: 1, count: 3, percentage: 0.3 },
    ],
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const filteredReviews = selectedRating
    ? reviews.filter((review) => review.rating === selectedRating)
    : reviews;

  const StarRating = ({
    rating,
    size = "w-5 h-5",
  }: {
    rating: number;
    size?: string;
  }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );

  const ReviewCard = ({
    review,
    isActive = false,
  }: {
    review: Review;
    isActive?: boolean;
  }) => (
    <Card
      className={`transition-all duration-500 border-0 ${
        isActive
          ? "shadow-2xl scale-105 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20"
          : "shadow-lg hover:shadow-xl bg-white dark:bg-gray-800"
      }`}
    >
      <CardContent className="p-8">
        {/* Quote Icon */}
        <div className="flex justify-between items-start mb-6">
          <Quote
            className={`w-12 h-12 ${isActive ? "text-blue-600" : "text-gray-400"} transform rotate-180`}
          />
          {review.verified && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Verified className="w-3 h-3 mr-1" />
              {isArabic ? "موثق" : "Verified"}
            </Badge>
          )}
        </div>

        {/* Review Text */}
        <blockquote className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic">
          &ldquo;{isArabic ? review.reviewAr : review.review}&rdquo;
        </blockquote>

        {/* Rating */}
        <div className="flex items-center gap-3 mb-6">
          <StarRating rating={review.rating} />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {review.rating}.0
          </span>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center text-2xl">
            {review.avatar}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 dark:text-white">
              {isArabic ? review.nameAr : review.name}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-3 h-3" />
              {isArabic ? review.locationAr : review.location}
            </div>
          </div>
        </div>

        {/* Service Info */}
        <div className="flex items-center justify-between text-sm">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {isArabic ? review.serviceAr : review.service}
          </Badge>
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span suppressHydrationWarning>
                {new Date(review.date).toLocaleDateString(
                  isArabic ? "ar-SA" : "en-US",
                )}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {review.helpful}
            </div>
          </div>
        </div>

        {/* Media */}
        {review.videoTestimonial && (
          <div className="mt-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Play className="w-3 h-3" />
              {isArabic ? "شاهد الشهادة" : "Watch Testimonial"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/30"
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-4xl mx-auto mb-16 ${isInView ? "animate-in" : "opacity-0"}`}
        >
          <Badge className="mb-4 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <MessageSquare className="w-4 h-4 mr-2" />
            {isArabic ? "آراء العملاء" : "Customer Reviews"}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {isArabic ? (
              <>
                <span className="block">ما يقوله</span>
                <span className="block bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  عملاؤنا السعداء
                </span>
              </>
            ) : (
              <>
                <span className="block">What Our</span>
                <span className="block bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Happy Customers Say
                </span>
              </>
            )}
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {isArabic
              ? "اكتشف لماذا يختار آلاف العملاء خدماتنا ولماذا يثقون بنا"
              : "Discover why thousands of customers choose our services and trust us with their spaces"}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-0">
            <CardContent className="p-8">
              <div className="text-5xl font-bold text-yellow-600 mb-2">
                {numberFormatter.formatNumber(stats.averageRating)}
              </div>
              <StarRating
                rating={Math.floor(stats.averageRating)}
                size="w-6 h-6"
              />
              <div className="text-gray-600 dark:text-gray-400 mt-2">
                {isArabic ? "متوسط التقييم" : "Average Rating"}
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-0">
            <CardContent className="p-8">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {numberFormatter.formatNumber(stats.totalReviews)}
              </div>
              <div className="flex items-center justify-center gap-2 text-lg">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">
                  {isArabic ? "مراجعة" : "Reviews"}
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">
                {isArabic ? "إجمالي المراجعات" : "Total Reviews"}
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-0">
            <CardContent className="p-8">
              <div className="text-5xl font-bold text-green-600 mb-2">98%</div>
              <div className="flex items-center justify-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-green-600" />
                <span className="font-semibold">
                  {isArabic ? "رضا" : "Satisfaction"}
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">
                {isArabic ? "معدل الرضا" : "Satisfaction Rate"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <div className="max-w-2xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {isArabic ? "توزيع التقييمات" : "Rating Distribution"}
          </h3>
          <div className="space-y-3">
            {stats.ratingDistribution.map((item) => (
              <div
                key={item.stars}
                className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-3 transition-colors"
                onClick={() =>
                  setSelectedRating(
                    selectedRating === item.stars ? 0 : item.stars,
                  )
                }
              >
                <div className="flex items-center gap-2 w-20">
                  <span className="font-semibold">{item.stars}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      selectedRating === item.stars
                        ? "bg-yellow-500"
                        : "bg-yellow-400"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 w-16 text-right">
                  {item.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Controls */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedRating > 0
                ? `${selectedRating} ${isArabic ? "نجوم" : "Star"} ${isArabic ? "مراجعات" : "Reviews"}`
                : isArabic
                  ? "أحدث المراجعات"
                  : "Latest Reviews"}
            </h3>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="gap-2"
              >
                {isAutoPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isAutoPlaying
                  ? isArabic
                    ? "إيقاف"
                    : "Pause"
                  : isArabic
                    ? "تشغيل"
                    : "Play"}
              </Button>

              <Button variant="outline" size="sm" onClick={prevReview}>
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={nextReview}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {filteredReviews
              .slice(currentReview, currentReview + 3)
              .map((review, index) => (
                <div
                  key={review.id}
                  className={isInView ? "animate-in" : "opacity-0"}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <ReviewCard review={review} isActive={index === 1} />
                </div>
              ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(filteredReviews.length / 3) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index * 3)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    Math.floor(currentReview / 3) === index
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ),
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              {isArabic
                ? "كن جزءاً من قصص النجاح"
                : "Be Part of Our Success Stories"}
            </h3>
            <p className="text-xl mb-6 opacity-90">
              {isArabic
                ? "انضم إلى آلاف العملاء الراضين واكتشف لماذا نحن الأفضل"
                : "Join thousands of satisfied customers and discover why we're the best"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-orange-600 hover:bg-gray-50 border-white"
              >
                {isArabic ? "احجز خدمتك الآن" : "Book Your Service"}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                {isArabic ? "شارك تجربتك" : "Share Your Experience"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
