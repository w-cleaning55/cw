"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICES, GRID_LAYOUTS } from "@/lib/constants";
import { cn, createOptimizedSection } from "@/lib/component-utils";
import type { Service } from "@/lib/types";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = React.memo(({ service }) => (
  <Card className="hover:shadow-xl transition-shadow duration-300">
    <CardHeader>
      <div className="text-4xl mb-4" role="img" aria-label={`أيقونة ${service.title}`}>
        {service.icon}
      </div>
      <CardTitle className="text-xl font-semibold text-gray-900" dir="rtl">
        {service.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-gray-600 mb-4" dir="rtl">
        {service.description}
      </CardDescription>
      <Button
        variant="ghost"
        className="text-blue-600 font-medium hover:text-blue-700 p-0"
        aria-label={`اطلب خدمة ${service.title}`}
      >
        اطلب الخدمة ←
      </Button>
    </CardContent>
  </Card>
));

ServiceCard.displayName = "ServiceCard";

interface ServicesSectionProps {
  className?: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ className = "" }) => {
  // Memoize the services array since it's static
  const services = React.useMemo(() => SERVICES, []);

  return (
    <section id="services" className={cn("py-20", className)} aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="services-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
            خدماتنا المميزة
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto" dir="rtl">
            نقدم مجموعة شاملة من خدمات التنظيف المحترفة لجميع احتياجاتكم
            السكنية والتجارية
          </p>
        </div>

        <div className={cn("grid gap-8", GRID_LAYOUTS.services)}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default createOptimizedSection(ServicesSection);
