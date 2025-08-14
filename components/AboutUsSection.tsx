"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useTranslation } from "../hooks/useTranslation";
import {
  Award,
  Users,
  Target,
  Lightbulb,
  Shield,
  Heart,
  TrendingUp,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Eye,
  Zap,
  Clock,
} from "lucide-react";

interface Milestone {
  year: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ElementType;
  color: string;
}

interface ValueCard {
  icon: React.ElementType;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  color: string;
  bgColor: string;
}

export default function AboutUsSection() {
  const { t, currentLanguage } = useTranslation();
  const [activeTab, setActiveTab] = useState("story");
  const [visibleMilestones, setVisibleMilestones] = useState<number[]>([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isArabic = currentLanguage === "ar";

  const milestones: Milestone[] = [
    {
      year: "2018",
      title: "Company Founded",
      titleAr: "تأسيس الشركة",
      description:
        "Started with a vision to revolutionize cleaning services in Saudi Arabia",
      descriptionAr:
        "بدأنا برؤية لثورة في خدمات التنظيف في المملكة العربية السعودية",
      icon: Lightbulb,
      color: "text-yellow-600",
    },
    {
      year: "2019",
      title: "First 100 Customers",
      titleAr: "أول 100 عميل",
      description:
        "Achieved our first milestone with exceptional customer satisfaction",
      descriptionAr: "حققنا أول معلم لنا برضا عملاء استثنائي",
      icon: Users,
      color: "text-blue-600",
    },
    {
      year: "2020",
      title: "ISO Certification",
      titleAr: "شهادة الأيزو",
      description:
        "Obtained ISO 9001:2015 certification for quality management",
      descriptionAr: "حصلنا على شهادة ISO 9001:2015 لإدارة الجودة",
      icon: Award,
      color: "text-green-600",
    },
    {
      year: "2021",
      title: "Technology Integration",
      titleAr: "تكامل التقنية",
      description: "Introduced advanced European cleaning technology",
      descriptionAr: "قدمنا تقنيات التنظيف الأوروبية المتطورة",
      icon: Zap,
      color: "text-purple-600",
    },
    {
      year: "2022",
      title: "Regional Expansion",
      titleAr: "التوسع الإقليمي",
      description: "Expanded services across major Saudi cities",
      descriptionAr: "وسعنا خدماتنا عبر المدن السعودية الرئيسية",
      icon: Globe,
      color: "text-indigo-600",
    },
    {
              year: "2025",
      title: "Industry Leader",
      titleAr: "رائد الصناعة",
      description: "Recognized as the leading cleaning service provider",
      descriptionAr: "معترف بنا كمقدم خدمات التنظيف الرائد",
      icon: TrendingUp,
      color: "text-red-600",
    },
  ];

  const values: ValueCard[] = [
    {
      icon: Shield,
      title: "Quality First",
      titleAr: "الجودة أولاً",
      description:
        "We never compromise on quality and always deliver excellence",
      descriptionAr: "لا نساوم أبداً على الجودة ونقدم دائماً التميز",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: Heart,
      title: "Customer Care",
      titleAr: "رعاية العملاء",
      description: "Your satisfaction is our top priority and driving force",
      descriptionAr: "رضاكم هو أولويتنا القصوى والقوة الدافعة لنا",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
    },
    {
      icon: Zap,
      title: "Innovation",
      titleAr: "الابتكار",
      description: "Constantly evolving with latest technology and methods",
      descriptionAr: "نتطور باستمرار مع أحدث التقنيات والطرق",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    },
    {
      icon: Clock,
      title: "Reliability",
      titleAr: "الموثوقية",
      description: "Dependable service you can trust, available 24/7",
      descriptionAr: "خدمة موثوقة يمكنك الاعتماد عليها، متاحة 24/7",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Animate milestones one by one
          milestones.forEach((_, index) => {
            setTimeout(() => {
              setVisibleMilestones((prev) => [...prev, index]);
            }, index * 200);
          });
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const tabs = [
    { id: "story", label: "Our Story", labelAr: "قصتنا", icon: Eye },
    { id: "values", label: "Our Values", labelAr: "قيمنا", icon: Heart },
    { id: "journey", label: "Our Journey", labelAr: "مسيرتنا", icon: Target },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/30"
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-4xl mx-auto mb-16 ${isInView ? "animate-in" : "opacity-0"}`}
        >
          <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Target className="w-4 h-4 mr-2" />
            {isArabic ? "من نحن" : "About Us"}
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {isArabic ? (
              <>
                <span className="block">أكثر من مجرد</span>
                <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  شركة تنظيف
                </span>
              </>
            ) : (
              <>
                <span className="block">We're More Than</span>
                <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  A Cleaning Company
                </span>
              </>
            )}
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {isArabic
              ? "نحن شركاء في خلق بيئات نظيفة وصحية ترفع من جودة حياة عملائنا وتساهم في سعادتهم"
              : "We are partners in creating clean and healthy environments that contribute to our clients&apos; well-being and happiness"}
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">
                      {isArabic ? tab.labelAr : tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {/* Our Story */}
          {activeTab === "story" && (
            <div className="grid lg:grid-cols-2 gap-12 items-center animate-in">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isArabic ? "قصة النجاح" : "A Success Story"}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {isArabic
                    ? "بدأت رحلتنا في عام 2018 برؤية واضحة: تقديم خدمات تنظيف احترافية تتجاوز توقعات عملائنا. اليوم، نحن فخورون بأن نكون الخيار الأول لأكثر من 2500 عميل راضٍ."
                    : "Our journey began in 2018 with a clear vision: to provide professional cleaning services that exceed our customers' expectations. Today, we're proud to be the first choice for over 2,500 satisfied customers."}
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      2500+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {isArabic ? "عميل سعيد" : "Happy Customers"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      98%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {isArabic ? "معدل الرضا" : "Satisfaction Rate"}
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {isArabic ? "تعرف على المزيد" : "Learn More"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-3xl p-8 shadow-2xl">
                  <div className="aspect-video bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-green-600/20"></div>
                    <Button
                      size="lg"
                      variant="outline"
                      className="relative z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                    >
                      <Play className="w-6 h-6 mr-2" />
                      {isArabic ? "شاهد قصتنا" : "Watch Our Story"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Our Values */}
          {activeTab === "values" && (
            <div className="animate-in">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {isArabic ? "القيم التي تقودنا" : "Values That Drive Us"}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {isArabic
                    ? "هذه هي المبادئ الأساسية التي توجه كل ما نقوم به"
                    : "These are the core principles that guide everything we do"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <Card
                      key={index}
                      className={`group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden ${value.bgColor} hover:scale-105`}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className={`w-8 h-8 ${value.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {isArabic ? value.titleAr : value.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                              {isArabic
                                ? value.descriptionAr
                                : value.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Our Journey */}
          {activeTab === "journey" && (
            <div className="animate-in">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {isArabic
                    ? "رحلة النمو والتطور"
                    : "Journey of Growth & Evolution"}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {isArabic
                    ? "تتبع معالمنا الرئيسية وإنجازاتنا عبر السنين"
                    : "Follow our key milestones and achievements over the years"}
                </p>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-600 to-green-600 rounded-full"
                  style={{ height: "100%" }}
                ></div>

                <div className="space-y-16">
                  {milestones.map((milestone, index) => {
                    const Icon = milestone.icon;
                    const isVisible = visibleMilestones.includes(index);
                    const isLeft = index % 2 === 0;

                    return (
                      <div
                        key={index}
                        className={`relative flex items-center ${
                          isLeft ? "justify-end" : "justify-start"
                        } ${isVisible ? "animate-in" : "opacity-0"}`}
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        {/* Timeline Node */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white dark:bg-gray-800 rounded-full border-4 border-blue-600 flex items-center justify-center shadow-lg z-10">
                          <Icon className={`w-8 h-8 ${milestone.color}`} />
                        </div>

                        {/* Content Card */}
                        <div className={`w-5/12 ${isLeft ? "mr-8" : "ml-8"}`}>
                          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-gray-800 hover:scale-105">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <Badge className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                                  {milestone.year}
                                </Badge>
                                <Star className="w-4 h-4 text-yellow-500" />
                              </div>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {isArabic ? milestone.titleAr : milestone.title}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                {isArabic
                                  ? milestone.descriptionAr
                                  : milestone.description}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              {isArabic ? "هل أنت مستعد للبدء؟" : "Ready to Get Started?"}
            </h3>
            <p className="text-xl mb-6 opacity-90">
              {isArabic
                ? "انضم إلى آلاف العملاء الراضين واكتشف الفرق"
                : "Join thousands of satisfied customers and discover the difference"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-blue-600 hover:bg-gray-50 border-white"
              >
                {isArabic ? "احصل على عرض أسعار" : "Get a Quote"}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                {isArabic ? "اتصل بنا" : "Contact Us"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
