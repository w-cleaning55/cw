"use client";

import React from "react";
import { CheckCircle, Users, Award, Star, Clock } from "lucide-react";

interface AboutSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ className = "", title, subtitle, description, image }) => {
  const benefits = [
    "معدات حديثة ومتطورة",
    "فريق مدرب ومؤهل",
    "أسعار تنافسية وعادلة",
  ];

  const stats = [
    { icon: <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />, value: "50+", label: "موظف متخصص" },
    { icon: <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />, value: "2850+", label: "مشروع مكتمل" },
    { icon: <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />, value: "4.9/5", label: "تقييم العملاء" },
    { icon: <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />, value: "24/7", label: "خدمة العملاء" },
  ];

  return (
    <section id="about" className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" dir="rtl">
              {title || "من نحن؟"}
            </h2>
            <p className="text-gray-700 mb-4" dir="rtl">
              {subtitle || "شركة رائدة في مجال خدمات التنظيف بجدة"}
            </p>
            <p className="text-gray-600 mb-6" dir="rtl">
              {description || "شركة تنظيف احترافية تأسست عام 2018"}
            </p>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700" dir="rtl">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-blue-100 p-8 rounded-xl">
            <div className="grid grid-cols-2 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  {stat.icon}
                  <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
