"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeColors, useThemeClasses } from "@/hooks/useTheme";
import { getLocalizedText } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ThumbsUp,
  MessageCircle,
  Calendar,
  MapPin,
  Verified,
  Award,
  Heart,
  TrendingUp,
  Users,
  Camera,
  Video,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  title?: string;
  company?: string;
  location?: string;
  avatar?: string;
  rating: number;
  comment: { ar: string; en: string };
  date: string;
  service?: string;
  verified?: boolean;
  featured?: boolean;
  likes?: number;
  photos?: string[];
  video?: string;
  tags?: string[];
}

interface TestimonialsSectionProps {
  data: {
    style?:
      | "carousel"
      | "grid"
      | "masonry"
      | "timeline"
      | "slider3d"
      | "testimonial-wall";
    title?: { ar: string; en: string };
    subtitle?: { ar: string; en: string };
    description?: { ar: string; en: string };
    showCount?: number;
    autoSlide?: boolean;
    slideInterval?: number;
    showRatings?: boolean;
    showDates?: boolean;
    showPhotos?: boolean;
    showVideos?: boolean;
    enableFilters?: boolean;
    layout?: "1column" | "2columns" | "3columns" | "4columns";
    backgroundStyle?: "none" | "gradient" | "pattern" | "image";
    testimonials?: Testimonial[];
  };
  settings?: any;
  sectionSettings?: any;
  isVisible?: boolean;
  isPreview?: boolean;
}

export default function DynamicTestimonialsSection({
  data,
  settings,
  sectionSettings,
  isVisible = true,
  isPreview = false,
}: TestimonialsSectionProps) {
  const { t, isRTL } = useTranslation();
  const isArabic = isRTL;
  const { colors } = useThemeColors();
  const themeClasses = useThemeClasses();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(data.autoSlide || false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const testimonialStyle = data.style || "carousel";
  const showCount = data.showCount || 3;

  // تحميل آراء العملاء
  useEffect(() => {
    loadTestimonials();
  }, []);

  // التشغيل التلقائي للكاروسيل
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying && testimonialStyle === "carousel") {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev >= testimonials.length - 1 ? 0 : prev + 1));
      }, data.slideInterval || 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, testimonials.length, data.slideInterval, testimonialStyle]);

  const loadTestimonials = async () => {
    try {
      // محاكاة تحميل البيانات
      const defaultTestimonials = getDefaultTestimonials();
      setTestimonials(defaultTestimonials);
    } catch (error) {
      console.error("Error loading testimonials:", error);
      setTestimonials(getDefaultTestimonials());
    }
  };

  const getDefaultTestimonials = (): Testimonial[] => [
    {
      id: "1",
      name: "نورا الحربي",
      title: "ربة منزل",
      location: "جدة، السعودية",
      avatar: "/avatars/noura.jpg",
      rating: 5,
      comment: {
        ar: "خدمة ممتازة جداً! الفريق محترف ومهذب، والنتيجة فاقت كل توقعاتي. السجاد عاد كالجديد تماماً. أنصح بشدة بخدماتهم.",
        en: "Excellent service! Professional and polite team, and the results exceeded all my expectations. The carpet is like new again. Highly recommend their services.",
      },
      date: "2024-01-15",
      service: "تنظيف السجاد",
      verified: true,
      featured: true,
      likes: 24,
      photos: ["/testimonials/before-after-1.jpg"],
      tags: ["تنظيف السجاد", "خدمة ممتازة"],
    },
    {
      id: "2",
      name: "أحمد المطيري",
      title: "مدير شركة",
      company: "شركة المطيري للتجارة",
      location: "الرياض، السعودية",
      avatar: "/avatars/ahmed.jpg",
      rating: 5,
      comment: {
        ar: "نتعامل معهم منذ سنتين لتنظيف مكاتبنا. الالتزام بالمواعيد والجودة العالية جعلتنا نجدد العقد كل عام. فريق عمل رائع.",
        en: "We have been working with them for two years to clean our offices. Punctuality and high quality made us renew the contract every year. Great team.",
      },
      date: "2024-01-10",
      service: "تنظيف المكاتب",
      verified: true,
      likes: 18,
      tags: ["تنظيف مكاتب", "عقود سنوية"],
    },
    {
      id: "3",
      name: "فاطمة العتيبي",
      title: "صاحبة فيلا",
      location: "الدمام، السعودية",
      avatar: "/avatars/fatima.jpg",
      rating: 4,
      comment: {
        ar: "جلي الرخام كان رائعاً، عاد اللمعان الطبيعي للأرضيات. سعر عادل ونتيجة مذهلة. سأطلب خدماتهم مرة أخرى قريباً.",
        en: "Marble polishing was wonderful, the natural shine returned to the floors. Fair price and amazing results. Will request their services again soon.",
      },
      date: "2024-01-08",
      service: "جلي الرخام",
      verified: true,
      likes: 15,
      video: "/testimonials/fatima-review.mp4",
      tags: ["جلي رخام", "نتائج مذهلة"],
    },
    {
      id: "4",
      name: "محمد الغامدي",
      title: "صاحب مطعم",
      company: "مطعم الغامدي",
      location: "مكة، السعودية",
      avatar: "/avatars/mohammed.jpg",
      rating: 5,
      comment: {
        ar: "تنظيف المطعم والمطبخ بأعلى المعايير الصحية. فريق متخصص يفهم متطلبات المطاعم. ممتاز في التعامل مع الدهون العنيدة.",
        en: "Restaurant and kitchen cleaning to the highest health standards. Specialized team that understands restaurant requirements. Excellent in dealing with stubborn grease.",
      },
      date: "2024-01-05",
      service: "تنظيف المطاعم",
      verified: true,
      featured: true,
      likes: 32,
      photos: [
        "/testimonials/restaurant-before.jpg",
        "/testimonials/restaurant-after.jpg",
      ],
      tags: ["تنظيف مطاعم", "معايير صحية"],
    },
    {
      id: "5",
      name: "سارة القحطاني",
      title: "طبيبة",
      location: "جدة، السعودية",
      avatar: "/avatars/sarah.jpg",
      rating: 5,
      comment: {
        ar: "خدمة تنظيف العيادة ممتازة، يستخدمون مواد تعقيم طبية مناسبة. الفريق مدرب على التعامل مع البيئة الطبية بحذر.",
        en: "Excellent clinic cleaning service, they use appropriate medical sterilization materials. The team is trained to handle the medical environment carefully.",
      },
      date: "2024-01-03",
      service: "تنظيف العيادات",
      verified: true,
      likes: 21,
      tags: ["تنظيف عيادات", "تعقيم طبي"],
    },
    {
      id: "6",
      name: "خالد البقمي",
      title: "مهندس",
      location: "الطائف، السعودية",
      avatar: "/avatars/khalid.jpg",
      rating: 4,
      comment: {
        ar: "تنظيف شامل للفيلا بعد أعمال الترميم. أزالوا كل آثار الأتربة والدهان. عمل دقيق ومنظم، والسعر مناسب جداً.",
        en: "Comprehensive villa cleaning after renovation work. They removed all traces of dust and paint. Precise and organized work, and very reasonable price.",
      },
      date: "2024-01-01",
      service: "تنظيف بعد الترميم",
      verified: true,
      likes: 12,
      tags: ["تنظيف شامل", "بعد الترميم"],
    },
  ];

  // شكل الكاروسيل
  const renderCarouselLayout = () => (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${-currentSlide * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 p-8">
              <Card className="max-w-3xl mx-auto text-center shadow-xl">
                <CardContent className="p-8">
                  {/* الاقتباس */}
                  <div className="relative mb-6">
                    <Quote
                      className="w-12 h-12 mx-auto mb-4 opacity-20"
                      style={{ color: colors.primary }}
                    />
                    <p
                      className="text-xl md:text-2xl leading-relaxed"
                      style={{ color: colors.text }}
                    >
                      "{getLocalizedText(testimonial.comment, isArabic, "تعليق")}"
                    </p>
                  </div>

                  {/* التقييم */}
                  {data.showRatings && (
                    <div className="flex justify-center mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* معلومات العميل */}
                  <div className="flex items-center justify-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <h3
                          className="font-bold text-lg"
                          style={{ color: colors.text }}
                        >
                          {testimonial.name}
                        </h3>
                        {testimonial.verified && (
                          <Verified className="w-5 h-5 text-blue-500" />
                        )}
                      </div>

                      {testimonial.title && (
                        <p
                          className="text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          {testimonial.title}
                          {testimonial.company && ` - ${testimonial.company}`}
                        </p>
                      )}

                      {testimonial.location && (
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <MapPin
                            className="w-3 h-3"
                            style={{ color: colors.textSecondary }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            {testimonial.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* الخدمة والتاريخ */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    {testimonial.service && (
                      <Badge variant="secondary">{testimonial.service}</Badge>
                    )}
                    {data.showDates && (
                      <div
                        className="flex items-center gap-1 text-xs"
                        style={{ color: colors.textSecondary }}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(testimonial.date).toLocaleDateString(
                            "ar-SA",
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* الصور أو الفيديو */}
                  {data.showPhotos &&
                    testimonial.photos &&
                    testimonial.photos.length > 0 && (
                      <div className="mt-6">
                        <div className="flex justify-center gap-2">
                          {testimonial.photos
                            .slice(0, 3)
                            .map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`صورة ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                              />
                            ))}
                        </div>
                      </div>
                    )}

                  {data.showVideos && testimonial.video && (
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentVideoId(testimonial.id)}
                        className="flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        مشاهدة فيديو الشهادة
                      </Button>
                    </div>
                  )}

                  {/* الإعجابات */}
                  {testimonial.likes && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <ThumbsUp
                        className="w-4 h-4"
                        style={{ color: colors.primary }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {testimonial.likes} شخص أعجب بهذه الشهادة
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* أزرار التنقل */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg"
        onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
        disabled={currentSlide === 0}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg"
        onClick={() =>
          setCurrentSlide(Math.min(testimonials.length - 1, currentSlide + 1))
        }
        disabled={currentSlide === testimonials.length - 1}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* أزرار التشغيل */}
      <div className="flex justify-center mt-6 gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isPlaying ? "إيقاف" : "تشغيل"} التلقائي
        </Button>
      </div>

      {/* مؤشرات */}
      <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-blue-500 w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );

  // شكل الشبكة
  const renderGridLayout = () => {
    const getGridColumns = () => {
      switch (data.layout) {
        case "1column":
          return "grid-cols-1";
        case "2columns":
          return "grid-cols-1 md:grid-cols-2";
        case "3columns":
          return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
        case "4columns":
          return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
        default:
          return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      }
    };

    return (
      <div className={`grid ${getGridColumns()} gap-6`}>
        {testimonials.slice(0, showCount).map((testimonial) => (
          <Card
            key={testimonial.id}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6">
              {/* رأس البطاقة */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-semibold"
                      style={{ color: colors.text }}
                    >
                      {testimonial.name}
                    </h3>
                    {testimonial.verified && (
                      <Verified className="w-4 h-4 text-blue-500" />
                    )}
                    {testimonial.featured && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        مميز
                      </Badge>
                    )}
                  </div>

                  {testimonial.title && (
                    <p
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {testimonial.title}
                    </p>
                  )}

                  {data.showRatings && (
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* النص */}
              <div className="relative mb-4">
                <Quote
                  className="w-6 h-6 absolute -top-2 -right-2 opacity-20"
                  style={{ color: colors.primary }}
                />
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: colors.text }}
                >
                  {getLocalizedText(testimonial.comment, isArabic, "تعليق")}
                </p>
              </div>

              {/* معلومات إضافية */}
              <div
                className="flex items-center justify-between text-xs"
                style={{ color: colors.textSecondary }}
              >
                <div className="flex items-center gap-2">
                  {testimonial.service && (
                    <Badge variant="outline" className="text-xs">
                      {testimonial.service}
                    </Badge>
                  )}
                </div>

                {data.showDates && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(testimonial.date).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                )}
              </div>

              {/* التفاعل */}
              {testimonial.likes && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{testimonial.likes}</span>
                  </div>

                  {testimonial.photos && testimonial.photos.length > 0 && (
                    <Button variant="ghost" size="sm">
                      <Camera className="w-4 h-4 mr-1" />
                      {testimonial.photos.length} صورة
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // شكل ��لخط الزمني
  const renderTimelineLayout = () => (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* الخط المركزي */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>

        {testimonials.slice(0, showCount).map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`relative flex items-center mb-16 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            {/* المحتوى */}
            <div
              className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}
            >
              <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      {testimonial.title && (
                        <p className="text-sm text-gray-600">
                          {testimonial.title}
                        </p>
                      )}
                    </div>
                  </div>

                  {data.showRatings && (
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-sm leading-relaxed mb-4">
                  {getLocalizedText(testimonial.comment, isArabic, "تعليق")}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  {testimonial.service && (
                    <Badge variant="outline">{testimonial.service}</Badge>
                  )}
                  {data.showDates && (
                    <span>
                      {new Date(testimonial.date).toLocaleDateString("ar-SA")}
                    </span>
                  )}
                </div>
              </Card>
            </div>

            {/* النقطة المرك��ية */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg"
              style={{ backgroundColor: colors.primary }}
            ></div>

            {/* التاريخ */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 -translate-y-12 bg-white rounded-full px-3 py-1 text-xs font-medium border-2"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              {new Date(testimonial.date).toLocaleDateString("ar-SA")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // جدار الشهادات
  const renderTestimonialWall = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {testimonials.slice(0, showCount).map((testimonial) => (
        <Card
          key={testimonial.id}
          className="break-inside-avoid mb-6 overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          <CardContent className="p-4">
            {/* التقييم والاقتباس */}
            <div className="mb-4">
              {data.showRatings && (
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}

              <Quote
                className="w-6 h-6 mb-2 opacity-20"
                style={{ color: colors.primary }}
              />
              <p
                className="text-sm leading-relaxed"
                style={{ color: colors.text }}
              >
                {getLocalizedText(testimonial.comment, isArabic, "تعليق")}
              </p>
            </div>

            {/* معلومات العميل */}
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={testimonial.avatar} />
                <AvatarFallback>
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className="font-semibold text-sm"
                    style={{ color: colors.text }}
                  >
                    {testimonial.name}
                  </h3>
                  {testimonial.verified && (
                    <Verified className="w-4 h-4 text-blue-500" />
                  )}
                </div>

                {testimonial.title && (
                  <p
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    {testimonial.title}
                  </p>
                )}

                {testimonial.service && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {testimonial.service}
                  </Badge>
                )}
              </div>
            </div>

            {/* التاريخ والتفاعل */}
            <div
              className="flex items-center justify-between mt-3 pt-3 border-t text-xs"
              style={{ color: colors.textSecondary }}
            >
              {data.showDates && (
                <span>
                  {new Date(testimonial.date).toLocaleDateString("ar-SA")}
                </span>
              )}

              {testimonial.likes && (
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{testimonial.likes}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (!isVisible && !isPreview) return null;

  return (
    <section
      className={`py-20 ${!isVisible ? "opacity-50" : ""}`}
      style={{
        backgroundColor: sectionSettings?.backgroundColor || colors.background,
        padding: sectionSettings?.padding,
        margin: sectionSettings?.margin,
        ...sectionSettings?.customStyles,
      }}
    >
      <div className="container mx-auto px-4">
        {/* العنوان والوصف */}
        {(data.title || data.subtitle || data.description) && (
          <div className="text-center mb-16">
            {data.title && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.text }}
              >
                {getLocalizedText(data.title, isArabic, "آراء العملاء")}
              </h2>
            )}
            {data.subtitle && (
              <h3
                className="text-xl md:text-2xl mb-6"
                style={{ color: colors.textSecondary }}
              >
                {getLocalizedText(data.subtitle, isArabic, "تعرف على آراء عملائنا")}
              </h3>
            )}
            {data.description && (
              <p
                className="text-lg max-w-3xl mx-auto"
                style={{ color: colors.textSecondary }}
              >
                {getLocalizedText(data.description, isArabic, "وصف")}
              </p>
            )}
          </div>
        )}

        {/* الفلاتر */}
        {data.enableFilters && (
          <div className="flex justify-center mb-12">
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <Button
                variant={selectedCategory === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                الكل
              </Button>
              <Button
                variant={selectedCategory === "featured" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory("featured")}
              >
                <Star className="w-4 h-4 mr-1" />
                مميز
              </Button>
              <Button
                variant={selectedCategory === "verified" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory("verified")}
              >
                <Verified className="w-4 h-4 mr-1" />
                موثق
              </Button>
            </div>
          </div>
        )}

        {/* عرض الشهادات حسب النمط المحدد */}
        <div>
          {testimonialStyle === "carousel" && renderCarouselLayout()}
          {testimonialStyle === "grid" && renderGridLayout()}
          {testimonialStyle === "timeline" && renderTimelineLayout()}
          {testimonialStyle === "testimonial-wall" && renderTestimonialWall()}
        </div>

        {/* إحصائيات إجمالية */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div
              className="text-3xl font-bold mb-2"
              style={{ color: colors.primary }}
            >
              {testimonials.length}+
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              عميل راضي
            </div>
          </div>

          <div>
            <div
              className="text-3xl font-bold mb-2"
              style={{ color: colors.primary }}
            >
              {Math.round(
                (testimonials.reduce((acc, t) => acc + t.rating, 0) /
                  testimonials.length) *
                  10,
              ) / 10}
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              متوسط التقييم
            </div>
          </div>

          <div>
            <div
              className="text-3xl font-bold mb-2"
              style={{ color: colors.primary }}
            >
              98%
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              معدل الرضا
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
