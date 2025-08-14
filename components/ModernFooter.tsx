"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { useTranslation } from "../hooks/useTranslation";
import {
  Bot,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Send,
  Star,
  Shield,
  Award,
  ChevronRight,
  ExternalLink,
  Heart,
  Globe,
  Smartphone,
  Users,
  Zap,
  CheckCircle,
  Calendar,
  Building,
  CreditCard,
  Headphones,
  FileText,
  Lock,
  Eye,
} from "lucide-react";

interface FooterLink {
  title: string;
  titleAr: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  titleAr: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  nameAr: string;
  icon: React.ElementType;
  href: string;
  color: string;
  hoverColor: string;
}

interface QuickContact {
  type: string;
  typeAr: string;
  value: string;
  valueAr: string;
  icon: React.ElementType;
  action: string;
  color: string;
}

export default function ModernFooter() {
  const { t, currentLanguage } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [dots, setDots] = useState<
    Array<{ left: number; top: number; delay: number }>
  >([]);
  const [isClient, setIsClient] = useState(false);
  const isArabic = currentLanguage === "ar";

  const footerSections: FooterSection[] = [
    {
      title: "Services",
      titleAr: "الخدمات",
      links: [
        {
          title: "Deep Cleaning",
          titleAr: "تنظيف عميق",
          href: "/services/deep-cleaning",
        },
        {
          title: "Carpet Cleaning",
          titleAr: "تنظيف السجاد",
          href: "/services/carpet-cleaning",
        },
        {
          title: "Office Cleaning",
          titleAr: "تنظيف المكاتب",
          href: "/services/office-cleaning",
        },
        {
          title: "Water Tank Cleaning",
          titleAr: "تنظيف الخزانات",
          href: "/services/water-tank",
        },
        {
          title: "Pest Control",
          titleAr: "مكافحة الآفات",
          href: "/services/pest-control",
        },
        {
          title: "Marble Polishing",
          titleAr: "جلي الرخام",
          href: "/services/marble-polishing",
        },
      ],
    },
    {
      title: "Company",
      titleAr: "الشركة",
      links: [
        { title: "About Us", titleAr: "من نحن", href: "/about" },
        { title: "Our Team", titleAr: "فريقنا", href: "/team" },
        { title: "Careers", titleAr: "الوظائف", href: "/careers" },
        {
          title: "News & Updates",
          titleAr: "الأخبار والتحديثات",
          href: "/news",
        },
        { title: "Partnerships", titleAr: "الشراكات", href: "/partnerships" },
        { title: "Investors", titleAr: "المستثمرون", href: "/investors" },
      ],
    },
    {
      title: "Support",
      titleAr: "الدعم",
      links: [
        { title: "Contact Us", titleAr: "اتصل بنا", href: "/contact" },
        { title: "FAQ", titleAr: "الأسئلة الشائعة", href: "/faq" },
        {
          title: "Booking Guide",
          titleAr: "دليل الحجز",
          href: "/booking-guide",
        },
        {
          title: "Service Areas",
          titleAr: "مناطق الخدمة",
          href: "/service-areas",
        },
        {
          title: "Emergency Service",
          titleAr: "خدمة الطوارئ",
          href: "/emergency",
        },
        { title: "Customer Portal", titleAr: "بوابة العملاء", href: "/portal" },
      ],
    },
    {
      title: "Legal",
      titleAr: "قانوني",
      links: [
        {
          title: "Privacy Policy",
          titleAr: "سياسة الخصوصية",
          href: "/privacy",
        },
        { title: "Terms of Service", titleAr: "شروط الخدمة", href: "/terms" },
        {
          title: "Cancellation Policy",
          titleAr: "سياسة الإلغاء",
          href: "/cancellation",
        },
        {
          title: "Insurance Coverage",
          titleAr: "التغطية التأمينية",
          href: "/insurance",
        },
        {
          title: "Dispute Resolution",
          titleAr: "حل النزاعات",
          href: "/disputes",
        },
        { title: "Compliance", titleAr: "الامتثال", href: "/compliance" },
      ],
    },
  ];

  const socialLinks: SocialLink[] = [
    {
      name: "WhatsApp",
      nameAr: "واتساب",
      icon: MessageCircle,
      href: "https://wa.me/966501234567",
      color: "text-green-600",
      hoverColor: "hover:bg-green-100 dark:hover:bg-green-950/20",
    },
    {
      name: "Instagram",
      nameAr: "انستقرام",
      icon: Instagram,
      href: "https://instagram.com/cleaningworld_sa",
      color: "text-pink-600",
      hoverColor: "hover:bg-pink-100 dark:hover:bg-pink-950/20",
    },
    {
      name: "Twitter",
      nameAr: "تويتر",
      icon: Twitter,
      href: "https://twitter.com/cleaningworld_sa",
      color: "text-blue-600",
      hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-950/20",
    },
    {
      name: "Facebook",
      nameAr: "فيسبوك",
      icon: Facebook,
      href: "https://facebook.com/CleaningWorldSA",
      color: "text-blue-700",
      hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-950/20",
    },
    {
      name: "LinkedIn",
      nameAr: "لينكد إن",
      icon: Linkedin,
      href: "https://linkedin.com/company/cleaning-world-sa",
      color: "text-blue-800",
      hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-950/20",
    },
    {
      name: "YouTube",
      nameAr: "يوتيوب",
      icon: Youtube,
      href: "https://youtube.com/cleaningworldsa",
      color: "text-red-600",
      hoverColor: "hover:bg-red-100 dark:hover:bg-red-950/20",
    },
  ];

  const quickContacts: QuickContact[] = [
    {
      type: "Phone",
      typeAr: "هاتف",
      value: "+966 50 123 4567",
      valueAr: "+966 50 123 4567",
      icon: Phone,
      action: "tel:+966501234567",
      color: "text-green-600",
    },
    {
      type: "WhatsApp",
      typeAr: "واتساب",
      value: "Chat with us",
      valueAr: "تحدث معنا",
      icon: MessageCircle,
      action: "https://wa.me/966501234567",
      color: "text-blue-600",
    },
    {
      type: "Email",
      typeAr: "بريد إلكتروني",
      value: "info@cleaningworld.sa",
      valueAr: "info@cleaningworld.sa",
      icon: Mail,
      action: "mailto:info@cleaningworld.sa",
      color: "text-purple-600",
    },
    {
      type: "Emergency",
      typeAr: "طوارئ",
      value: "24/7 Emergency",
      valueAr: "طوارئ 24/7",
      icon: Zap,
      action: "tel:+966501234567",
      color: "text-red-600",
    },
  ];

  React.useEffect(() => {
    // Set client-side flag and generate dots only on client
    setIsClient(true);
    setDots(
      [...Array(15)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
      })),
    );
  }, []);

  const handleSubscribe = async () => {
    if (!email.trim()) return;

    setIsSubscribing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubscribing(false);
    setEmail("");
    // Show success message
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-green-600 to-blue-600"></div>
        {/* Animated dots */}
        {isClient &&
          dots.map((dot, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${dot.left}%`,
                top: `${dot.top}%`,
                animationDelay: `${dot.delay}s`,
              }}
            />
          ))}
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Badge className="mb-4 bg-blue-100 text-blue-800">
                <Mail className="w-4 h-4 mr-2" />
                {isArabic ? "النشرة البريدية" : "Newsletter"}
              </Badge>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                {isArabic ? (
                  <>
                    <span className="block">اشترك في نشرتنا</span>
                    <span className="block bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                      للحصول على عروض حصرية
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block">Subscribe to Our Newsletter</span>
                    <span className="block bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                      For Exclusive Offers
                    </span>
                  </>
                )}
              </h3>
              <p className="text-xl text-gray-300">
                {isArabic
                  ? "احصل على نصائح التنظيف والعروض الخاصة مباشرة في بريدك الإلكتروني"
                  : "Get cleaning tips and special offers delivered straight to your inbox"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={
                  isArabic ? "بريدك الإلكتروني" : "Your email address"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
                dir={isArabic ? "rtl" : "ltr"}
              />
              <Button
                onClick={handleSubscribe}
                disabled={isSubscribing || !email.trim()}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8"
              >
                {isSubscribing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {isArabic ? "اشتراك" : "Subscribe"}
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {isArabic ? "نصائح أسبوعية" : "Weekly Tips"}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {isArabic ? "عروض حصرية" : "Exclusive Offers"}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {isArabic ? "إلغاء في أي وقت" : "Unsubscribe Anytime"}
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                  <Bot className="h-7 w-7" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                  {isArabic ? "عالم النظافة" : "Cleaning World"}
                </span>
              </Link>

              <p className="text-gray-300 leading-relaxed text-lg">
                {isArabic
                  ? "شركة رائدة في مجال خدمات التنظيف الاحترافية في المملكة العربية السعودية، نقدم حلول تنظيف متطورة باستخدام أحدث التقنيات العالمية."
                  : "Leading professional cleaning services company in Saudi Arabia, providing advanced cleaning solutions using the latest global technologies."}
              </p>

              {/* Certifications */}
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/10 text-white border-white/20">
                  <Award className="w-3 h-3 mr-1" />
                  ISO 9001:2015
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20">
                  <Shield className="w-3 h-3 mr-1" />
                  {isArabic ? "مؤمن بالكامل" : "Fully Insured"}
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {isArabic ? "معتمد" : "Certified"}
                </Badge>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">
                  {isArabic ? "تابعنا على" : "Follow Us"}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-xl bg-white/10 border border-white/20 ${social.color} ${social.hoverColor} transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                        title={isArabic ? social.nameAr : social.name}
                      >
                        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {footerSections.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">
                      {isArabic ? section.titleAr : section.title}
                    </h4>
                    <ul className="space-y-3">
                      {section.links
                        .filter((link) => link && link.href)
                        .map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <Link
                              href={link.href}
                              className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                            >
                              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              <span>
                                {isArabic ? link.titleAr : link.title}
                              </span>
                              {link.external && (
                                <ExternalLink className="w-3 h-3" />
                              )}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="py-12 border-t border-white/10">
          <h4 className="text-2xl font-bold text-center mb-8">
            {isArabic ? "طرق التواصل السريع" : "Quick Contact"}
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickContacts.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <Card
                  key={index}
                  className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`mx-auto w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${contact.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h5 className="font-semibold text-white mb-2">
                      {isArabic ? contact.typeAr : contact.type}
                    </h5>
                    <a
                      href={contact.action}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                      target={
                        contact.action.startsWith("http") ? "_blank" : "_self"
                      }
                      rel={
                        contact.action.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {isArabic ? contact.valueAr : contact.value}
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © 2025 {isArabic ? "عالم النظافة" : "Cleaning World"}.
                {isArabic ? " جميع الحقوق محفوظة." : " All rights reserved."}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {isArabic
                  ? "مرخص من وزارة التجارة السعودية - رقم الترخيص: 1234567890"
                  : "Licensed by Saudi Ministry of Commerce - License No: 1234567890"}
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm">
                  {isArabic ? "آمن ومحمي" : "Secure & Protected"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Eye className="w-4 h-4" />
                <span className="text-sm">
                  {isArabic ? "سياسة خصوصية" : "Privacy Policy"}
                </span>
              </div>
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-sm">
                {isArabic ? "صنع بـ" : "Made with"}
              </span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-sm">
                {isArabic ? "في السعودية" : "in Saudi Arabia"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
