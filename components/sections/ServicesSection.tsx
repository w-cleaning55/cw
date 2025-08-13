"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Service {
  title: string;
  desc: string;
  icon: string;
}

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => (
  <Card className="hover:shadow-xl transition-shadow duration-300">
    <CardHeader>
      <div className="text-4xl mb-4">{service.icon}</div>
      <CardTitle className="text-xl font-semibold text-gray-900" dir="rtl">
        {service.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-gray-600 mb-4" dir="rtl">
        {service.desc}
      </CardDescription>
      <Button variant="ghost" className="text-blue-600 font-medium hover:text-blue-700 p-0">
        اطلب الخدمة ←
      </Button>
    </CardContent>
  </Card>
);

interface ServicesSectionProps {
  className?: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ className = "" }) => {
  const services: Service[] = [
    {
      title: "تنظيف المنازل والفلل",
      desc: "خدمة تنظيف شاملة للمنازل والفلل مع ضمان الجودة",
      icon: "🏠",
    },
    {
      title: "تنظيف المكاتب والشركات",
      desc: "حلول تنظيف احترافية للمكاتب والمباني التجارية",
      icon: "🏢",
    },
    {
      title: "تنظيف السجاد والستائر",
      desc: "خدمة تنظيف وتعقيم السجاد والستائر بأحدث التقنيات",
      icon: "🧽",
    },
    {
      title: "جلي وتلميع الرخام",
      desc: "تلميع وصيانة الأرضيات الرخامية والبلاط",
      icon: "✨",
    },
    {
      title: "تنظيف خزانات المياه",
      desc: "تنظيف وتعقيم خزانات المياه وفقاً للمعايير الصحية",
      icon: "💧",
    },
    {
      title: "مكافحة الحشرات",
      desc: "خدمات مكافحة الحشرات والقوارض بمواد آمنة",
      icon: "🛡️",
    },
  ];

  return (
    <section id="services" className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
            خدماتنا المميزة
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto" dir="rtl">
            نقدم مجموعة شاملة من خدمات التنظيف المحترفة لجميع احتياجاتكم
            السكنية والتجارية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
