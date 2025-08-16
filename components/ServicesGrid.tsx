"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Sparkles, ArrowRight } from 'lucide-react';

interface ServiceItem {
  id?: string;
  name: string;
  title?: string;
  description: string;
  price?: string;
  featured?: boolean;
  popular?: boolean;
  icon?: string;
  color?: string;
}

interface ServicesGridProps {
  title?: string;
  subtitle?: string;
  items?: ServiceItem[];
  services?: any[]; // Fallback to global services
  layout?: 'grid' | 'list' | 'cards';
  columns?: 1 | 2 | 3 | 4;
  showPrices?: boolean;
  showBadges?: boolean;
  className?: string;
}

const ServicesGrid: React.FC<ServicesGridProps> = React.memo(({
  title,
  subtitle,
  items,
  services,
  layout = 'grid',
  columns = 3,
  showPrices = true,
  showBadges = true,
  className = ""
}) => {
  // Use provided items or fallback to services
  const serviceItems = items || services || [];
  
  if (!serviceItems || serviceItems.length === 0) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" dir="rtl">
            لا توجد خدمات متاحة
          </h2>
          <p className="text-gray-600" dir="rtl">
            يرجى التحقق من تكوين الخدمات
          </p>
        </div>
      </section>
    );
  }

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  const renderServiceCard = (service: ServiceItem, index: number) => {
    const serviceName = service.name || service.title || `خدمة ${index + 1}`;
    const serviceDescription = service.description || "وصف الخدمة";
    const servicePrice = service.price || "يبدأ من 150 ريال";

    return (
      <Card 
        key={service.id || index} 
        className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500 relative overflow-hidden"
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-2">
            {showBadges && service.featured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                مميزة
              </Badge>
            )}
            {showBadges && service.popular && (
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                الأكثر طلباً
              </Badge>
            )}
          </div>
          
          <CardTitle className="text-xl font-semibold text-gray-900" dir="rtl">
            {serviceName}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-gray-600 mb-4 leading-relaxed" dir="rtl">
            {serviceDescription}
          </p>
          
          <div className="flex items-center justify-between">
            {showPrices && (
              <div className="text-2xl font-bold text-blue-600">
                {servicePrice}
              </div>
            )}
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <ArrowRight className="w-4 h-4 mr-1" />
              اطلب الآن
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderList = () => (
    <div className="space-y-4">
      {serviceItems.map((service, index) => (
        <Card key={service.id || index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2" dir="rtl">
                  {service.name || service.title || `خدمة ${index + 1}`}
                </h3>
                <p className="text-gray-600" dir="rtl">
                  {service.description || "وصف الخدمة"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {showPrices && (
                  <div className="text-xl font-bold text-blue-600">
                    {service.price || "يبدأ من 150 ريال"}
                  </div>
                )}
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <ArrowRight className="w-4 h-4 mr-1" />
                  اطلب الآن
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderCards = () => (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {serviceItems.map((service, index) => renderServiceCard(service, index))}
    </div>
  );

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto" dir="rtl">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {layout === 'list' ? renderList() : renderCards()}
      </div>
    </section>
  );
});

ServicesGrid.displayName = 'ServicesGrid';

export default ServicesGrid;
